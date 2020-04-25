require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth');






// Mongoose Models
const User = require('../models/User')


router.post('/signup', (req, res, next) => {

    User.find({email: req.body.email})
    .then(user => {
        console.log(user)
        if(user.length >= 1) {
            return res.status(422).json({
                message: 'Email already excists'
            })
        }
        else {



    
   
    bcrypt.hash(req.body.password, 10, (err, hash) => {
       
        if(err) {
            return res.status(500).json({
                error:err
            })
        }
        else {
     
            const userId =  mongoose.Types.ObjectId();
          
           
           
            const user = new User({
                _id: userId,
                email: req.body.email,
                password: hash,

                })
             
                user.save()

               
                .then(result => {
                    console.log(result);
                   
                    res.status(201).json({
                        message: 'User Created'
                    })
                }) 
                .catch(err => {
                    console.log(err)
                    return res.status(500).json({
                        error:err
                    })
                })
               
               
        }
 
    })
}

})
})


router.post('/login', (req, res, next) => {

    console.log(req.body)
    User.find({email: req.body.email})
    .then((user) => {
        console.log(user)
        if(user.length === 0) {
            return res.status(401).json({
               message: 'Auth Failed'
            })
        }
        console.log(user[0].password)

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Auth Failed'
                 })
            }
            if(result) {
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id,
                    apiKey: user[0].apiKey


                }
                ,'SupoerComplexKey', {
                    expiresIn:"7d"
                })

                const refreshToken = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id,
                    apiKey: user[0].apiKey

                }
                ,'SupoerComplexKey', {
                    expiresIn:"7d"
                })

                console.log("Refresh Token",refreshToken)

              


                const cookieConfig = {
                  
                    httpOnly: true, // to disable accessing cookie via client side js
                    secure: true, // to force https (if you use it)
                    maxAge: 60000 * 60 * 24 * 7, // ttl in ms (remove this option and cookie will die when browser is closed)
                   signed: true // if you use the secret with cookieParser
                  };
           /*
           
res.cookie('jwt', token, cookieConfig)
           */
           //console.log(user[0].apiKey)
       res.cookie('jwt', token, cookieConfig)
       res.cookie('isLogged', true, {
                  
        httpOnly: false, // to disable accessing cookie via client side js
        secure: false, // to force https (if you use it)
        maxAge: 60000  * 60 * 24 * 7, // ttl in ms (remove this option and cookie will die when browser is closed)
       signed: false // if you use the secret with cookieParser
      })
      res.cookie('usedId',  user[0]._id, {
                  
        httpOnly: false, // to disable accessing cookie via client side js
        secure: false, // to force https (if you use it)
        maxAge: 60000  * 60 * 24 * 7, // ttl in ms (remove this option and cookie will die when browser is closed)
       signed: false // if you use the secret with cookieParser
      })
       res.status(200).json({
                message: 'Auth Sucessfull',
                userId: user[0]._id,
                token: token,
                apiKey: user[0].apiKey
              
            })
            

          

            }
            else {
                res.status(401).json({
                    message: 'Auth Failed'
                 })
            }
           
        })
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        })
    })
})


router.get('/',checkAuth, (req, res, next) => {

    User.find({_id: req.userData.userId})
    .populate('karmas')

    .then((user) => {
console.log(user)
        if(user.length < 1) {
            return res.status(401).json({
               message: 'Auth Failed'
            })
        }
        else {
           // console.log(user[0].email, user[0].karmas.earned_points)
            return res.status(200).json({
                email: user[0].email,
                username: user[0].username,
                apiKey: user[0].apiKey,
                firstName:user[0].firstName,
                lastName:user[0].lastName,
                about: user[0].about,
                title:user[0].title,
                karmas: 15,
                followersCount: user[0].followersCount
             //   joinedDate: user[0].joinedDate
            })
        }
    })
.catch(err => {
    console.log(err)
    res.status(500).json({error: err})
})

})



// just define your wanted config
const cookieConfig = {
    httpOnly: true, // to disable accessing cookie via client side js
    //secure: true, // to force https (if you use it)
    maxAge: 1000000000, // ttl in ms (remove this option and cookie will die when browser is closed)
    signed: true // if you use the secret with cookieParser
  };
  // there is many other params you can find here https://www.npmjs.com/package/cookie#options-1
  // make /set route 
 router.get('/set', (req, res) => {
    // MAIN CODE HERE :
    res.cookie('test', 'some value', cookieConfig);
    res.send('set cookie');
  });



module.exports = router;