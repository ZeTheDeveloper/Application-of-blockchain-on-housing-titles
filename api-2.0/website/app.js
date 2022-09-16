'use strict';
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const bodyParser = require('body-parser');
const http = require('http')
const util = require('util');
const express = require('express')
const app = express();
const path = require('path')
const cors = require('cors');
const constants = require('../config/constants.json');
const fetch = require('node-fetch');
const sessions = require('express-session')
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload');
const fs = require('fs');
const extract = require('extract-json-from-string')
const { BlockDecoder } = require('fabric-common');
const { Channel } = require('fabric-common');


const host = process.env.HOST || constants.host;
const port = process.env.PORT || constants.port;


const helper = require('../app/helper')
const invoke = require('../app/invoke')
const qscc = require('../app/qscc')
const query = require('../app/query');
const { response } = require('express');

// setting up twillio
var TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN;

// TWILIO_ACCOUNT_SID = "ACe46d0a42d36013031eb26b11a3c0ecfc"
// TWILIO_AUTH_TOKEN = "b1e320ce05eba14ac0d9e6b18cb00b03"
const accountSidTwi = "ACe46d0a42d36013031eb26b11a3c0ecfc";
const authTokenTwillio = "b1e320ce05eba14ac0d9e6b18cb00b03";
const clientTwi = require('twilio')(accountSidTwi, authTokenTwillio);

// pouch db setup
var PouchDB = require("pouchdb");


PouchDB.plugin(require('pouchdb-authentication'));
var db = new PouchDB('http://localhost:7984/users', {skip_setup: true});
var local = new PouchDB('local_db');
local.sync(db, {live: true, retry: true}).on('error', console.log.bind(console));

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(__dirname + '/src'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.get('/',function(req,res){
    session=req.session;
    if(session.userBase64){
        // res.send("");
    }else
    res.sendFile('src/index.html' , { root : __dirname});

    
  });

app.options('*', cors());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const oneDay = 1000 * 60 * 60 * 24;

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: true
}));

// set secret variable
// app.set('secret', 'thisismysecret');
// app.use(expressJWT({
//     secret: 'thisismysecret'
// }).unless({
//     path: ['/users','/users/login', '/register']
// }));
// app.use(bearerToken());

logger.level = 'debug';


// app.use((req, res, next) => {
//     logger.debug('New req for %s', req.originalUrl);
//     if (req.originalUrl.indexOf('/users/login') >= 0 || req.originalUrl.indexOf('/register') >= 0) {
//         return next();
//     }
//     var token = req.body.token;
//     console.log(token);
//     // session = req.session;
//     // session.userBase64 = "";
//     if(session){
//         if(token !== session.userBase64) {
//             console.log(`Error ================`)
//             res.send({
//                 success: false,
//                 message: 'Failed to authenticate token. Make sure to include the ' +
//                         'token returned from /users/login call in the authorization header ' +
//                         ' as a Bearer token'
//                 });
//             return;
//         } else if(token === session.userBase64) {
//             return next();
//         }
//     }else{
//         console.log(`Error ================`)
//             res.send({
//                 success: false,
//                 message: 'Please Login'
//                 });
//             return;
//     }

// });


var server = http.createServer(app).listen(port, function () { console.log(`Server started on ${port}`) });
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************', host, port);
server.timeout = 240000;

function getErrorMessage(field) {
    var response = {
        success: false,
        message: field + ' field is missing or Invalid in the request'
    };
    return response;
}

var session;


// Register and enroll admin
app.post('/wallet/enroll-admin', async function (req, res) {
    var username = req.body.username;
    var orgName = req.body.orgName;
    logger.debug('End point : /users');
    logger.debug('User name : ' + username);
    logger.debug('Org name  : ' + orgName);
    if (!username) {
        res.json(getErrorMessage('\'username\''));
        return;
    }
    if (!orgName) {
        res.json(getErrorMessage('\'orgName\''));
        return;
    }

    // var token = jwt.sign({
    //     exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
    //     username: username,
    //     orgName: orgName
    // }, app.get('secret'));

    let response = await helper.getRegisteredUser(username, orgName, true);

    logger.debug('-- returned from registering the username %s for organization %s', username, orgName);
    if (response && typeof response !== 'string') {
        logger.debug('Successfully registered the username %s for organization %s', username, orgName);
        res.json('Successfully registered the username %s for organization %s', username, orgName);
    } else {
        logger.debug('Failed to register the username %s for organization %s with::%s', username, orgName, response);
        res.json({ success: false, message: response });
    }

});

// owners login with couch db
app.post('/users/owners/signup', async function (req, res) {

    var username = req.body.username;
    var password = req.body.password;
    var identityNumber = req.body.identityNumber;
    var mobileNumber = req.body.mobileNumber;
    console.log(mobileNumber);

    var adminBase64 = Buffer.from("leezexuan4:abc%123").toString('base64');

  
    const url = 'http://localhost:7984/_users/org.couchdb.user:' + username;
    let message = fetch(url, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + adminBase64
        },
        body : JSON.stringify({
            "name": username,
            "password": password,
            "roles": ["owner"],
            "type": "user",
            "identityNumber": identityNumber,        
            "address": "",
            "postCode": "",
            "state": "",
            "area": "",
            "country": "",
            "mobileNumber": mobileNumber,
            "email": ""
        })

    }).then( data => {
        console.log(data);
        mobileNumber = "+6" + mobileNumber;

        // res.send(data);
        if(data.status >= 200 && data.status <= 299){
            clientTwi.messages.create({
                from: '+19403604771', 
                body: `username: ${username}\npassword: ${password}\nPlease change your password ASAP!`, 
                to: mobileNumber})
                .then(message => console.log(message.sid));
            res.json({ success: "true"})
        }
        
        

    }).catch(error => {
        console.log('Error', error)
        res.json({ success: error})
        // res.send(response_payload)
    })

});


// llogin users
app.post('/users/login', async function (req, res) {

    var username = req.body.username;
    var password = req.body.password;
    
    
    const url = 'http://localhost:7984/_session';
    let message = fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            
        },
        body : JSON.stringify({
            "name": username,
            "password": password,
        }),

    }).then( data => {
            var userBase64 = Buffer.from(username + ":" + password).toString('base64');
            db.login(username, password, function (err, response) {
                if (err) {
                  if (err.name === 'unauthorized') {
                    // name or password incorrect
                    console.log("unauthorized login");
                    res.json({ 
                        authenticated: "failed"
                    });
                  } else {
                    // cosmic rays, a meteor, etc.
                    
                   
                  }
                }else{
                    console.log("successful login");

                    // db.getSession(function (err, response) {
                    //     if (err) {
                    //       // network error
                    //       console.log(err);
                    //     } else if (!response.userCtx.name) {
                    //       // nobody's logged in
                    //       console.log("nobody logged in");
                    //     } else {
                          // response.userCtx.name is the current user
                          session = req.session;
                          console.log(session);
                          session.userBase64 = userBase64;
                          console.log(session.userBase64)


                          // user logged in and given authentication header
                          if(session.userBase64){
                            // get user data
                            db.getUser(req.body.username, function (err, response) {
                                if (err) {
                                  if (err.name === 'not_found') {
                                    // typo, or you don't have the privileges to see this user
                                    console.log("not found");
                                  } else {
                                    // some other error
                                    console.log(err);
                                  }
                                } else {
                                    // response is the user object
                                    
                                    session.identityNumber = response.identityNumber;
                                    session.username = req.body.username;
                                    session.password = req.body.password;                                   
                                    session.role = response.roles[0];
                                    console.log(session.role);
                                    
                                    if(session.role === "admin"){
                                        console.log("navigate to admin");
                                        session.orgName = response.orgName;
                                        console.log(session.orgName);
        
                                        async function getAdmin(){
                                            let isUserRegistered = await helper.isUserRegistered(session.username, session.orgName);
        
                                            if (isUserRegistered) {
                                                res.json({ 
                                                    // userAuthToken: session.userBase64,
                                                    username: session.username, 
                                                    role: session.role,
                                                    orgName: session.orgName,
                                                    identityNumber: session.identityNumber,
                                                    address: response.address,
                                                    postCode: response.postCode,
                                                    state: response.state,
                                                    area: response.area,
                                                    country: response.country,
                                                    mobileNumber: response.mobileNumber,
                                                    email: response.email
                                                });
                                                
        
                                            } else {
                                                res.json({ success: false, message: `User with username ${username} is not registered with ${session.orgName}, Please register first.` });
                                            }
                                        }
        
                                        getAdmin();
        
                                    }else if(session.role === "owner"){
                                        console.log("navigate to user");
                                        res.json({ 
                                            userAuthToken: session.userBase64,
                                            username: session.username, 
                                            role: session.role,
                                            identityNumber: session.identityNumber,
                                            address: response.address,
                                            postCode: response.postCode,
                                            state: response.state,
                                            area: response.area,
                                            country: response.country,
                                            mobileNumber: response.mobileNumber,
                                            email: response.email
                                        });
                                    }else{
                                        console.log("navigate to login");
                                        
                                    }
                                }
                              });

                            
                          }else{
                            //navigate to login page
                          }

                        // }
                      } /*)*/;
                // }
              });

            

            
    }).catch(error => {
        console.log('Error', error)
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
    })

    
});

// change password
app.post('/users/owners/change-password', async function (req, res) {

    var username = req.body.username;
    var password = req.body.password;
    var newPass = req.body.newPassword;
    var rev = "";
    let userBase64 = "";
    
    if(password !== session.password){
        res.json({success: "false"})
    }

    if(session){
        userBase64 = session.userBase64;
    }
  
    // user can only change passsword of own account with authorization header
    const url = "http://localhost:7984/_users/org.couchdb.user:" + username;
    let message = fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + userBase64
        }

    }).then( data => {
            console.log("valid user")
            console.log(data)
            rev = data.headers.get('etag');
            console.log(rev)

            // after authenticated user, use admina account to make changes (only admin can assign roles sadly T.T)
            var adminBase64 = Buffer.from("leezexuan4:abc%123").toString('base64');

            const url = 'http://localhost:7984/_users/org.couchdb.user:' + username;
            fetch(url, {
                method: 'PUT',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "If-Match": rev,
                    Authorization: "Basic " + adminBase64
                },
                body : JSON.stringify({
                    "name": username,
                    "password": newPass,
                    "type": "user",
                    "roles": ["owner"],
                    "identityNumber": session.identityNumber,
                    "address": req.body.address,
                    "postCode": req.body.postCode,
                    "state": req.body.state,
                    "area": req.body.area,
                    "country": req.body.country,
                    "mobileNumber": req.body.mobileNumber,
                    "email": req.body.email,
                }),

                }).then( data => {

                    if(data.status >= 200 && data.status <= 299){
                        res.json({success: "true"});
                        session.userBase64 = Buffer.from(username + ":" + newPass).toString('base64');

                    }else{
                        res.json({success: "false"});
                    }

                }).catch(e => {
                    console.log('Error', e)
                    res.json({sucess: "false"});
            })
    }).catch(e => {
        console.log('Error', e)
        res.json({sucess: "false"});
    })  
});

// update profile
app.post('/users/update-profile', async function (req, res) {

    var username = session.username;
    var rev = "";
    let userBase64 = "";

    // use session variable because update user data no need provide password
    userBase64 = session.userBase64;
  
    // user can only change passsword of own account with authorization header
    const url = "http://localhost:7984/_users/org.couchdb.user:" + username;
    let message = fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + userBase64
        }

    }).then( data => {
            console.log(data)
            rev = data.headers.get('etag');
            console.log(rev)
            
            // update for admins account
            if(session.role === "admin"){
                fetch(url, {
                    method: 'PUT',
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "If-Match": rev,
                        Authorization: "Basic " + userBase64
                    },
                    body : JSON.stringify({
                        "name": session.username,
                        "password": session.password,
                        "identityNumber": session.identityNumber,
                        "orgName": session.orgName,
                        "type": "user",
                        "roles": ["admin"],
                        "address": req.body.address,
                        "postCode": req.body.postCode,
                        "state": req.body.state,
                        "area": req.body.area,
                        "country": req.body.country,
                        "mobileNumber": req.body.mobileNumber,
                        "email": req.body.email,

                    }),

                    }).then( data => {
                        console.log(data.status);
                        if(data.status >= 200 && data.status <= 299){
                            res.json({
                                address: req.body.address,
                                postCode: req.body.postCode,
                                state: req.body.state,
                                area: req.body.area,
                                country: req.body.country,
                                mobileNumber: req.body.mobileNumber,
                                email: req.body.email,
                                success: "true"
                            })
                        }
                            // console.log(data)
                            // res.send(data);
                    }).catch(e => {
                        console.log('Error', e)
                })
            }

            // update for owners account
            if(session.role === "owner"){
                fetch(url, {
                    method: 'PUT',
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "If-Match": rev,
                        Authorization: "Basic " + userBase64
                    },
                    body : JSON.stringify({
                        "name": session.username,
                        "password": session.password,
                        "identityNumber": session.identityNumber,
                        "type": "user",
                        "roles": ["owner"],
                        "address": req.body.address,
                        "postCode": req.body.postCode,
                        "state": req.body.state,
                        "area": req.body.area,
                        "country": req.body.country,
                        "mobileNumber": req.body.mobileNumber,
                        "email": req.body.email,

                    }),

                    }).then( data => {
                        console.log(data.status);
                        if(data.status >= 200 && data.status <= 299){
                            res.json({
                                address: req.body.address,
                                postCode: req.body.postCode,
                                state: req.body.state,
                                area: req.body.area,
                                country: req.body.country,
                                mobileNumber: req.body.mobileNumber,
                                email: req.body.email,
                            })
                        }
                            // console.log(data)
                            // res.send(data);
                    }).catch(e => {
                        console.log('Error', e)
                })
            }
    }).catch(e => {
        console.log('Error', e)
    }) 

});

app.post('/users/checkAuth', async function (req, res) {

    let userBase64 = "";
    let role = "";
    let identityNumber = "";
    if(session){
        role = session.role;
        identityNumber = session.identityNumber;
    }
  
    try{
        // check front end auth token same with server userBase64
        if(req.body.role === role && req.body.identityNumber === identityNumber){
            console.log("authenticated");
            res.json({
                authenticated: "true"
                
            })
        }else{
            console.log("unauthenticated");
            res.json({
                authenticated: "false"
            })
        }
    }catch(error){
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
    }
    
});

app.post('/users/logout', async function (req, res) {

    db.logOut(function (err, response) {
        // clear session
        session = {};

        if (err) {
          // network error
        }else{
            res.json({
                session
            })
        }
      })
    
});




// Invoke transaction on chaincode on target peers
app.post('/channels/:channelName/chaincodes/:chaincodeName', async function (req, res) {
    try {
        logger.debug('==================== INVOKE ON CHAINCODE ==================');
        var chaincodeName = req.params.chaincodeName;
        var channelName = req.params.channelName;
        var peers = req.body.peers;     
        var fcn = req.body.fcn;
        var args = req.body.args;

        if(req.body.fileName){
            var fileName = req.body.fileName;
        }
        
        logger.debug('channelName  : ' + channelName);
        logger.debug('chaincodeName : ' + chaincodeName);
        logger.debug('fcn  : ' + fcn);
        logger.debug('args  : ' + args);
        logger.debug(req.username + req.orgname);
        
        if (!chaincodeName) {
            res.json(getErrorMessage('\'chaincodeName\''));
            return;
        }
        if (!channelName) {
            res.json(getErrorMessage('\'channelName\''));
            return;
        }
        if (!fcn) {
            res.json(getErrorMessage('\'fcn\''));
            return;
        }
        if (!args) {
            res.json(getErrorMessage('\'args\''));
            return;
        }

        let message = await invoke.invokeTransaction(channelName, chaincodeName, fcn, args, session.username, session.orgName);
        console.log(`message result is : ${message}`)

        if(message === "Unexpected end of JSON input"){
            res.json({success: "true"});

            if(fcn === "DeleteAsset"){

            }
        }else{
            res.json({success: "false"});
        }
        const response_payload = {
            result: message,
            error: null,
            errorData: null
        }
        // res.json(message);

    } catch (error) {
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
    }
});



app.get('/channels/:channelName/chaincodes/:chaincodeName/queryAll', async function (req, res) {
    try {
        logger.debug('==================== QUERY BY CHAINCODE ==================');

        let channelName = req.params.channelName;
        let chaincodeName = req.params.chaincodeName;
        console.log(`chaincode name is :${chaincodeName}`)
        let args = req.query.args;
        let fcn = req.query.fcn;
        let peers = req.query.peers;

        logger.debug('channelName : ' + channelName);
        logger.debug('chaincodeName : ' + chaincodeName);
        logger.debug('fcn : ' + fcn);
        logger.debug('args : ' + args);

        if (!chaincodeName) {
            res.json(getErrorMessage('\'chaincodeName\''));
            return;
        }
        if (!channelName) {
            res.json(getErrorMessage('\'channelName\''));
            return;
        }
        if (!fcn) {
            res.json(getErrorMessage('\'fcn\''));
            return;
        }
        if (!args) {
            res.json(getErrorMessage('\'args\''));
            return;
        }
        // console.log('args==========', args);
        // args = JSON.parse(args);
        // args = args.replace(/'/g, '"');
        // logger.debug(args);

        let message = await query.query(channelName, chaincodeName, args, fcn, session.username, session.orgName);

        const response_payload = {
            result: message,
            error: null,
            errorData: null
        }

        res.send(response_payload);
    } catch (error) {
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
    }
});

app.use(fileUpload({
    useTempFiles : true,
    // tempFileDir : '/tmp/',
    createParentPath: './src/assets/HousingTitles' 
}));

app.route('/file-upload/:fileName').post(onFileupload);

function onFileupload(req, res) {

    var fileName = req.params.fileName;

    let file = req['files'].titlePDF;
    file.mv("./src/assets/HousingTitles/" + fileName);
    console.log("File uploaded: ", fileName);
  }

app.post('/deleteTitleFile', async function (req, res) {
    console.log("Filename:" + req.body.fileName)
    let files = fs.unlink('./src/assets/HousingTitles/' + req.body.fileName, err => {
        if(err){
            console.log(err);
        }else{
            res.json({"success": "true"})
        }
    });

}
  );

app.get('/getTitlesFilename', async function (req, res) {


    let files = fs.readdirSync('./src/assets/HousingTitles');
    files.forEach(file => {
          console.log(file);
      })
    let response_payload = files;

    res.send(response_payload);
}
);

app.get('/getTransactionLog', async function (req, res) {
    let transactionLog = fs.readFileSync("../../../../../../var/ze/peer0-org1/ledgersData/chains/chains/mychannel/blockfile_000000");
    let str = transactionLog.toString();
    transactionLog = str.replace(/[^a-zA-Z0-9 ]/g, "");

    res.json(transactionLog.toString());
}
);

app.get('/channels/:channelName/chaincodes/:chaincodeName', async function (req, res) {
    try {
        logger.debug('==================== QUERY BY CHAINCODE ==================');

        var channelName = req.params.channelName;
        var chaincodeName = req.params.chaincodeName;
        console.log(`chaincode name is :${chaincodeName}`)
        let args = req.query.args;
        let fcn = req.query.fcn;
        let peers = req.query.peers;

        logger.debug('channelName : ' + channelName);
        logger.debug('chaincodeName : ' + chaincodeName);
        logger.debug('fcn : ' + fcn);
        logger.debug('args : ' + args);

        if (!chaincodeName) {
            res.json(getErrorMessage('\'chaincodeName\''));
            return;
        }
        if (!channelName) {
            res.json(getErrorMessage('\'channelName\''));
            return;
        }
        if (!fcn) {
            res.json(getErrorMessage('\'fcn\''));
            return;
        }
        if (!args) {
            res.json(getErrorMessage('\'args\''));
            return;
        }
        // console.log('args==========', args);
        args = JSON.parse(args);
        // args = args.replace(/'/g, '"');
        logger.debug(args);

        let message = await query.query(channelName, chaincodeName, args, fcn, session.username, session.orgName);

        const response_payload = {
            result: message,
            error: null,
            errorData: null
        }

        res.send(response_payload);
    } catch (error) {
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
    }
});

app.get('/qscc/channels/:channelName/chaincodes/:chaincodeName', async function (req, res) {
    try {
        logger.debug('==================== QUERY BY CHAINCODE ==================');

        var channelName = req.params.channelName;
        var chaincodeName = req.params.chaincodeName;
        console.log(`chaincode name is :${chaincodeName}`)
        let args = req.query.args;
        let fcn = req.query.fcn;
        // let peer = req.query.peer;

        logger.debug('channelName : ' + channelName);
        logger.debug('chaincodeName : ' + chaincodeName);
        logger.debug('fcn : ' + fcn);
        logger.debug('args : ' + args);

        if (!chaincodeName) {
            res.json(getErrorMessage('\'chaincodeName\''));
            return;
        }
        if (!channelName) {
            res.json(getErrorMessage('\'channelName\''));
            return;
        }
        if (!fcn) {
            res.json(getErrorMessage('\'fcn\''));
            return;
        }
        if (!args) {
            res.json(getErrorMessage('\'args\''));
            return;
        }
        // console.log('args==========', args);
        // args = args.replace(/'/g, '"');
        // args = JSON.parse(args);
        // logger.debug(args);

        let response_payload = await qscc.qscc(channelName, chaincodeName, args, fcn, session.username, session.orgName);

        // const response_payload = {
        //     result: message,
        //     error: null,
        //     errorData: null
        // }

        res.send(response_payload);
    } catch (error) {
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
    }
});
  