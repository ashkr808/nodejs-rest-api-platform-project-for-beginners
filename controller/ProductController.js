const Product = require('../models/Product')
const {incrRequst} = require('../models/User')
const {getPostData} = require('../utils')


// @dsec    gets all products
//@route    GET     /api/products
async function getProducts(req, res){
    try{
        const products = await Product.findAll()
        incrRequst(req.apiKey)
        res.writeHead(200,{'Content-type':'application/json'})
        res.end(JSON.stringify(products));
    }
    catch(err){
        console.log(er)
    }
}

// @dsec    gets specific product
//@route    GET     /api/products/:id
async function getProduct(req,res,id){
    try{
        const products = await Product.findById(id)
        if(!products){
            res.writeHead(404,{'Content-type':'application/json'})
            res.end(JSON.stringify({message: "Product not found !"}));
        }else{
            incrRequst(req.apiKey)
            res.writeHead(200,{'Content-type':'application/json'})
            res.end(JSON.stringify(products));
        }

    }catch(err){
        console.log(err)
    }
}

// @dsec    create a product
//@route    POST     /api/products
async function createProduct(req, res){
    incrRequst(req.apiKey)
    try{
        const data = await getPostData(req)
        const {title,description,price} = JSON.parse(data)
        let errMsg = [];
        if(!title)
            errMsg.push({title : 'Product title is required'})
        if(!description)   
            errMsg.push({description : 'Product description is required'})
        if(!price)   
            errMsg.push({price : 'Product price is required'})
        else if(!price.match(/^[0-9]*$/))   
            errMsg.push({price : 'Product price should only be a number, No special char (, $)'})
        if(errMsg.length!==0){
            res.writeHead(422,{'Content-type':'application/json'})
            res.end(JSON.stringify({message: "Plase enter all fields in valid manner",errors:errMsg}))   
            return
        }
        let product = {
            title,
            description,
            price
        }  
        const newProduct = await Product.create(product)  
        res.writeHead(201,{'Content-type':'application/json'})
        res.end(JSON.stringify(newProduct))       
    }
    catch(err){
        console.log(err)
    }
}


// @dsec    update a product
//@route    PUT     /api/product/:id
async function updateProduct(req, res,id){
    try{
        
        const data = await getPostData(req)
        const {title,description,price} = JSON.parse(data)
        let product = {
            title,
            description,
            price
        }  
        let errMsg = [];
        if(!title)
            errMsg.push({title : 'Product title is required'})
        if(!description)   
            errMsg.push({description : 'Product description is required'})
        if(!price)   
            errMsg.push({price : 'Product price is required'})
        else if(!price.match(/^[0-9]*$/))   
            errMsg.push({price : 'Product price should only be a number, No special char (, $)'})
        if(errMsg.length!==0){
            res.writeHead(422,{'Content-type':'application/json'})
            res.end(JSON.stringify({message: "Plase enter all fields in valid manner",errors:errMsg}))   
            return
        }
        const updatedProduct = await Product.update(product,id)  
        if(updatedProduct){ 
            incrRequst(req.apiKey)
            res.writeHead(201,{'Content-type':'application/json'})
            res.end(JSON.stringify(updatedProduct))
        }
        else{
            res.writeHead(404,{'Content-type':'application/json'})
            res.end(JSON.stringify({message: "Product not found"}));
        }
        
       
    }
    catch(err){
        console.log(err)
    }
}


// @dsec    delete specific product
//@route    DELETE     /api/products/:id
async function deleteProduct(req,res,id){
    try{
        const products = await Product.deleteById(id)
        if(!products){
            res.writeHead(404,{'Content-type':'application/json'})
            res.end(JSON.stringify({message: "Product not found"}));
        }else{
            incrRequst(req.apiKey)
            res.writeHead(200,{'Content-type':'application/json'})
            res.end(JSON.stringify({message:'Product deleted !!'}));
        }
    }catch(err){
        console.log(err)
    }
}

module.exports ={
    getProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct
}