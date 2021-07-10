const {getPostData} = require('../utils')
const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

async function createUser(req,res){
    try{
        const data = await getPostData(req)
        const {name,email,password} = JSON.parse(data)
        let errMsg = [];
        if(!name)
            errMsg.push({name : 'Name is required'})
        if(!email)   
            errMsg.push({email : 'Email is required'})
        else if(!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
            errMsg.push({email : 'Enter a valid email'})
        if(!password)
            errMsg.push({password : 'Password is required'})
        if(errMsg.length!==0){
            res.writeHead(422,{'Content-type':'application/json'})
            res.end(JSON.stringify({message: "Plase enter all fields in valid manner",errors:errMsg}))   
            return
        }
        bcrypt.hash(password, saltRounds, async function(err, hash) {
            const newUser = {name,email,password:hash}
            let response =  await User.create(newUser)
            if(!response.errMessage){
                res.writeHead(201,{'Content-type':'application/json'})
                res.end(JSON.stringify(response))   
                return
            }else{
                res.writeHead(422,{'Content-type':'application/json'})
                res.end(JSON.stringify({message: response.errMessage,errors:errMsg}))   
            }
        });
               
    }    
    catch(err){
        console.log(err)
    }

}

async function login(req,res){
    try{
        const data = await getPostData(req)
        const {email,password} = JSON.parse(data)
        const user = User.findByEmail(email)
        if(!user){
            res.writeHead(403,{'Content-type':'application/json'})
            res.end(JSON.stringify({message: "Account doesn't exist."})) 
            return
        }
        bcrypt.compare(password, user.password, function(err, result) {
            if(err) throw err
            
            if(result){
                const {name,email,api_key} = user 
                const payload = {name,email,api_key}

                const token = jwt.sign( payload , "a8sd98798da9d8a98sd");
                var expires = "";
                var date = new Date();
                date.setTime(date.getTime() + (30*60*1000));
                expires = "; expires=" + date.toUTCString();
                res.writeHead(200,{'Content-type':'application/json','Set-Cookie':`jwt=${token};Expires=${expires};HttpOnly;Secure`})
                res.end(JSON.stringify({name,email,api_key} ))
            }else{
                res.writeHead(403,{'Content-type':'application/json'})
                res.end(JSON.stringify({message: "Wrong Password"}))  
            }

        });
    }catch(err){
        console.log(err)
    }
}


async function signup(req,res){
    try{
        const data = await getPostData(req)
        const {name,email,password} = JSON.parse(data)
        let errMsg = [];
        if(!name)
            errMsg.push({name : 'Name is required'})
        if(!email)   
            errMsg.push({email : 'Email is required'})
        else if(!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
            errMsg.push({email : 'Enter a valid email'})
        if(!password)
            errMsg.push({password : 'Password is required'})
        if(errMsg.length!==0){
            res.writeHead(422,{'Content-type':'application/json'})
            res.end(JSON.stringify({message: "Plase enter all fields in valid manner",errors:errMsg}))   
            return
        }
        bcrypt.hash(password, saltRounds, async function(err, hash) {
            const newUser = {name,email,password:hash}
            let response =  await User.create(newUser)
            if(!response.errMessage){

                const {name,email,api_key} = response 
                const payload = {name,email,api_key}

                const token = jwt.sign( payload , "a8sd98798da9d8a98sd");
                console.log('token',token);
                res.writeHead(200,{'Content-type':'application/json'})
                res.end(JSON.stringify({name,email,api_key,token} ))
 
                return
            }else{
                errMsg.push({email : 'Email is allready taken'})
                res.writeHead(422,{'Content-type':'application/json'})
                res.end(JSON.stringify({message: "Plase enter all fields in valid manner",errors:errMsg}))   
            }
        });
               
    }    
    catch(err){
        console.log(err)
    }
}
async function checkAuth(req,res){
    const checkAuth = await checkAuthPrivate(req,res)
    if(!checkAuth.err){
        res.writeHead(200,{'Content-type':'application/json'})
        res.end(JSON.stringify({payload:checkAuth.user}))
    }else{
        res.writeHead(403,{'Content-type':'application/json'})
        res.end(JSON.stringify({message: checkAuth.message} ))
    }
}
async function checkAuthPrivate(req,res){
    try{
        
        if(!req.headers.cookie){
            return {err:true,message: "No autheticatation found !"}
        }

        const cookies = req.headers.cookie.split(';').map(cookie=>{
            let key = cookie.split('=')[0].trim()
            let value = cookie.split('=')[1]
            return {
                [key] :value
            }
        })
        // console.log(cookies)
        let token = cookies.filter(cookie=>cookie.jwt)[0]
        // console.log(token)
        if(!token){
            return {err:true,message: "Login expired"}
        }
        const payload = jwt.verify( token.jwt , "a8sd98798da9d8a98sd");
        let user = User.findByEmail(payload.email)
        if(user){
            return {err:false,user: {name:user.name,email:user.email,api_key:user.api_key,request:user.request}}
        }else{
            return {err:true,message: "Login expired"}
        }
    }
    catch(err){
        console.log(err)
    }
}

async function regenApiKey(req,res){
    try{

        const checkAuth = await checkAuthPrivate(req,res)
        if(checkAuth.err){
            res.writeHead(403,{'Content-type':'application/json'})
            res.end(JSON.stringify({message: checkAuth.message} ))
            return;
        }
        let user = User.regenKey(checkAuth.user.email)
        if(user){
            res.writeHead(200,{'Content-type':'application/json'})
            res.end(JSON.stringify({payload:{name:user.name,email:user.email,api_key:user.api_key,request:user.request}} ))
        }else{
            res.writeHead(403,{'Content-type':'application/json'})
            res.end(JSON.stringify({message: "Login expired"} ))
        }
    }
    catch(err){
        console.log(err)
    }
}

async function logout(req,res){
        res.writeHead(200,{'Content-type':'application/json','Set-Cookie':`jwt=8a7sda;expires=Thu, 01 Jan 1970 00:00:00 UTC;HttpOnly;Secure`})
        res.end(JSON.stringify({message: "Logged out successfully !"} ))
}


module.exports = {
    createUser,
    login,
    checkAuth,
    signup,
    regenApiKey,
    logout
}
