const fs = require('fs/promises')
const fst = require('fs')

async function writedataToFile(fileName,content){
    await fs.writeFile(fileName,JSON.stringify(content),'utf-8',(err)=>{
        if(err) console.log(err)
    })
}
function getPostData(req){
    return new Promise((resolve,reject)=>{
        try{
            let body = ''
            req.on('data',(chunk)=>{
                body += chunk.toString();
            })
            req.on('end',()=>{
                resolve(body);
            })
        } catch(err){
            reject(err)
        }
    })
}


async function getPublicAssets(path,req,res){
    var mime = {
        html: 'text/html',
        txt: 'text/plain',
        css: 'text/css',
        gif: 'image/gif',
        jpg: 'image/jpeg',
        png: 'image/png',
        svg: 'image/svg+xml',
        js: 'application/javascript',
        pdf: 'application/pdf'
    };

    path = `./public/${path}`
    const fileName = path.split('/')[path.split('/').length-1]
    const ext = fileName.split('.')[1]
    
    const mimeType = mime[ext]  || 'text/plain'
    res.writeHead(200,{'Content-type': mimeType})

    var readStream = fst.createReadStream(path);
    readStream.on('open', function () {
        readStream.pipe(res);
    });
}

module.exports = {
    writedataToFile,
    getPostData,
    getPublicAssets
}