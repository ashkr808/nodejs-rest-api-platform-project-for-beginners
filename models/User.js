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
        user = {id,...user,api_key}
        users.push(user)
        writedataToFile('./data/users.json',users)
        resolve(user)
    })
}

module.exports = {
    create
}