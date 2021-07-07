const {getPostData} = require('../utils')
const User = require('../models/User')
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function createUser(req,res){
    try{
        const data = await getPostData(req)
        const {name,email,password} = JSON.parse(data)
        let errMsg = [];
        if(!name)
            errMsg.push({name : 'User name is required'})
        if(!email)   
            errMsg.push({email : 'User email is required'})
        else if(!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
            errMsg.push({email : 'Enter a valid email'})
        if(!password)
            errMsg.push({name : 'Password is required'})
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


module.exports = {
    createUser
}
