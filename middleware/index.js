const users = require('../data/users.json')

function isAuthenricated(req,res){
        const headers = req.headers;
        if(!headers['x-api-key']){
            res.writeHead(403,{'Content-type':'application/json'})
            res.end(JSON.stringify({message: "API key nor found"}))   
            return false;
        }
        let found = users.filter(user=>user.api_key === headers['x-api-key'])
        if(found.length === 1){
            return true
        }
        else{
            res.writeHead(403,{'Content-type':'application/json'})
            res.end(JSON.stringify({message: "Invalid API key"}))   
            return false
        }
}
module.exports = {
    isAuthenricated
}