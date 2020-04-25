require('dotenv').config()
const  { IgApiClient }= require('instagram-private-api');
const { get } = require('request-promise'); 

const ig = new IgApiClient();

async function login() {
    // basic login-procedure
   await ig.state.generateDevice(process.env.username);
   await ig.qe.syncLoginExperiments()
  
  
    await ig.account.login(process.env.username,process.env.password);
  }


exports.uploadPhoto  = async  (photo, caption, author, id) => {
  
    await login();
  
  
  
      // getting random square image from internet as a Buffer
      const imageBuffer = await get({
        url: photo, // random picture with 800x800 size
        encoding: null, // this is required, only this way a Buffer is returned
      });
  
  
    
    const publishResult = await ig.publish.photo({
      // read the file into a Buffer
      file: imageBuffer,
      // optional, default ''
      caption: `Post by @${author} 
      ${caption}`,
      usertags: {
        in: [
          // tag the user 'instagram' @ (0.5 | 0.5)
          await generateUsertagFromName(author, 0.5, 0.5),
        ],
      },
    
    });
  
   
    return new Promise( async (resolve, reject) => {


      if(publishResult.status === "ok") {
  
  
     await ig.media.comment({mediaId:publishResult.media.id, text:`
    #programming
      #developer
      #coding
       #programmer
       #programminglife
        #codinglif
         #coder
          #webdeveloper
           #javascript
            #java
             #php #code
              #codingisfun #programmers
               #softwaredeveloper #codingpics
                #programming #webdevelopment
                 #programmingisfun #html
                  #python #programminghumor
                   #css
                   #developers
                   #programmerslife
                   #computerscience` })

                 resolve(id)
   
      } 
      
      else {
    reject("error")
    
      }
    })
    
  }