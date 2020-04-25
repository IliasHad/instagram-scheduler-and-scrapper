require('dotenv').config()
const cron = require("node-cron")

const express = require('express');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 8030;
const path = require('path')
const cookieParser = require('cookie-parser')
const Post = require("./models/Post");
const {uploadPhoto} = require("./helpers/upload-post")


mongoose.connect(
    
   process.env.MONGO_URL,
    { useNewUrlParser: true , useCreateIndex: true , useFindAndModify: false , useUnifiedTopology: true }, () => {
        console.log('MongoDB Connected')
    })


mongoose.Promise = global.Promise;


// MiddleWeares
app.use(morgan('dev'));
app.use(cookieParser("secret"));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json()); 
app.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-with, Content-Type, Accept, Authorization")
    if(req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, PATCH, GET')
        return res.status(200).json({})
    }
next();
})


// Routes Handling Incomming Requests

const userRoutes = require('./routes/user')

const postRoutes  = require('./routes/post')


app.use('/api/v1/user', userRoutes)
app.use('/api/v1/post', postRoutes)



if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', (req, res) => {
          res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    
      })
}



const uploadPost = () => {
    Post.find({isPublished : false}) 
    .then(posts => {
        if(posts.length > 0) {
           const {photo , description, author, postId } = posts[Math.floor(Math.random()*posts.length)]
       
           uploadPhoto(photo, description, author, postId)
        }
    })
}

//This will run at the start of every hour
cron.schedule("24 12 * * *", () => {
    //code to be executed
    console.log("Wow Amazing :)")
    uploadPost()
})

cron.schedule("0 18 * * *", () => {
    //code to be executed
    uploadPost()
})

cron.schedule("0 21 * * *", () => {
    //code to be executed
     uploadPost()
})


app.listen(port, function () {
    console.log(`Server listening on port ${port}`)
  })