const puppeteer = require("puppeteer");
let browser = null;
let page = null;

exports.getPostData = async (url) => {
  try {

    console.log(url)
    // set up Puppeteer
    browser = await puppeteer.launch({
      headless: false,
    });
    page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    return new Promise(async (resolve, reject) => {
      await page.goto(url, { waitUntil: "networkidle2" });
      await page.waitForSelector("li[role='menuitem']");
      let description = await page.evaluate(() => {
        return document.querySelectorAll("li[role='menuitem']")[0].children[0]
          .children[0].lastChild.children[1].innerText;
      });
      let author = await page.evaluate(() => {
        return document.querySelectorAll("li[role='menuitem']")[0].children[0]
          .children[0].lastChild.children[0].innerText;
      });

      let image = await page.evaluate(() => {
        return document.querySelectorAll("div > img")[0].src;
      });
      let id = await page.evaluate(() => {
        return window.location.href.split("/p/")[1].split("/")[0];
      });
      let username_img = await page.evaluate(() => {
        return document.querySelector("header div img").src;
      });

      if (description, author, image, id, username_img) {
        resolve({
          description,
          author,
          image,
          id,
          username_img,
        });
      }
      else {
         reject()
      }
      await browser.close();
    });
  } catch (err) {
    console.log(err);
  }
};
