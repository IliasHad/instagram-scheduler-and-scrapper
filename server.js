const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");
const { getPostData } = require("./helpers/get-post-data");
const cron = require("node-cron");
const { uploadPhoto } = require("./helpers/upload-post");
const kue = require("kue");
const queue = kue.createQueue();
// Create server
const app = express();
// MiddleWeares
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images"); // here we specify the destination . in this case i specified the current directory
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname); // here we specify the file saving name . in this case i specified the original file name
  },
});

var uploadDisk = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, PATCH, GET");
    return res.status(200).json({});
  }
  next();
});
// Create database instance and start server
const adapter = new FileAsync("db.json");
low(adapter)
  .then((db) => {
    // Routes
    // GET /posts/:id
    app.get("/posts/", (req, res) => {
      const postsIG = db.get("posts") || [];

      res.status(200).json({ posts: postsIG });
    });

    // POST /posts

    app.use("/kue-api/", kue.app);

    app.post("/posts", (req, res) => {
      console.log(req.body);

      let id = req.body.url.split("/p/")[1].split("/")[0];
      const posts = db.get("posts").find({ postId: id }).value();
      console.log(posts);
      if (!posts || posts.length === 0) {
        queue
          .create("scrape instagram post", {
            url: req.body.url,
          })
          .priority("high")
          .save();
        res.status(201).json({ posts: db.get("posts") || [] });
      } else {
        const postsIG = db.get("posts") || [];

        res.status(200).json({ posts: postsIG });
      }
    });

    app.post("/upload", uploadDisk.single("image"), (req, res) => {
      console.log(" file disk uploaded", req.file);
      res.send(req.file.path);
    });

    app.post("/schedule", uploadDisk.single("image"), (req, res) => {
      const { image, scheduledDate, caption } = req.body;

      db.get("posts")
        .push({
          image: path.join(__dirname, image),
          caption,
          scheduledDate,
          isPublished: false,
        })
        .write()
        .then((post) => res.status(201).json({ post }));
    });

    // Set db default values
    const uploadPost = () => {
      const post = db.get("posts").find({
        isPublished: false,
        scheduledDate: new Date().toLocaleDateString(),
      });
      const { image, description, author, postId } = post.value();

      uploadPhoto(image, description, author, postId).then((data) => {
        db.get("posts").find({ postId }).assign({ isPublished: true }).write();
      });
    };

    //This will run at the start of every minute
    cron.schedule("* * * * *", () => {
      //code to be executed
      uploadPost();
    });

    queue.process("scrape instagram post", (job, done) => {
      getPostData(job.data.url)
        .then(({ description, author, image, id, username_img }) => {
          db.get("posts")
            .push({
              description,
              author,
              image,
              username_img,
              postId: id,
              isPublished: false,
            })
            .write()

            .then((posts) => {
              done();
            });
        })
        .catch((error) => done(error));
    });

    return db.defaults({ posts: [] }).write();
  })

  .then(() => {
    app.listen(8030, () => console.log("listening on port 8030"));
  });
