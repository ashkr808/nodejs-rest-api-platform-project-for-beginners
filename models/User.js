const crypto = require('crypto')
const uniqueId = require('uniqid')

const users = require('../data/users.json')
const {writedataToFile} = require('../utils')


function create(user){
    return new Promise((resolve,reject)=>{
        let userFound = false
        users.forEach(usr=>{
            if(usr.email === user.email)
            userFound = true;
            return;
        })
        if(userFound){
            resolve({errMessage:'Email is allready taken !'})
            return;
        }
        let api_key = crypto.createHash("sha256").update(uniqueId(), 'utf8').digest('hex').substr(0,31);
        let id = uniqueId()
        user = {id,...user,api_key,request:0}
        users.push(user)
        writedataToFile('./data/users.json',users)
        resolve(user)
    })
}
function findByEmail(email){
    let user = users.filter(user=>user.email === email)[0]
    if(!user)
        return null;
    return user;
}

function regenKey(email){
    let user = users.filter(user=>user.email === email)[0]
    if(!user)
        return null;
   
    const newUsers = users.map(user=>{
        if(user.email === email){
            user.api_key = crypto.createHash("sha256").update(uniqueId(), 'utf8').digest('hex').substr(0,31);
            return user
        }
        else
            return user
    })
    writedataToFile('./data/users.json',newUsers)
    return users.filter(user=>user.email === email)[0]
}

function incrRequst(api_key){
    const newUsers = users.map(user=>{
        if(user.api_key === api_key){
            user.request = user.request + 1  
            return user
        }else   
            return user
    })
    writedataToFile('./data/users.json',newUsers)
}

module.exports = {
    create,
    findByEmail,
    regenKey,
    incrRequst
}