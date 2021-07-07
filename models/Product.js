const products = require('../data/products')
const {writedataToFile} = require('../utils')

function findAll(){
    return new Promise((resolve, reject)=>{
        resolve(products)
    })
}

function findById(id){
    return new Promise((resolve, reject)=>{
        const product = products.find((p)=>p.id == id)
        resolve(product)      
    })
}


function create(product){
    return new Promise((resolve, reject)=>{
        const newProduct = {...product, id: Math.round(Math.random()*Math.random()*323497)} 
        products.push(newProduct)
        writedataToFile('./data/products.json',products)
        resolve(newProduct)
    })
}

function deleteById(id){
    return new Promise((resolve, reject)=>{
        const newProducts = products.filter(product=>product.id != id)
        if(newProducts.length === products.length){
            resolve(false)
        }else{
            writedataToFile('./data/products.json',newProducts)
            resolve(true)
        }   
    })
}

function update(product,id){
    return new Promise((resolve, reject)=>{
        let updatedProduct = false
        const newProducts = products.map(prod=>{
            if(prod.id != id)
                return prod;
            else{
                updatedProduct=  {
                    id,
                    ...product
                }
                return updatedProduct
            }
        })
        writedataToFile('./data/products.json',newProducts)
        resolve(updatedProduct)
    })
}


module.exports = {
    findAll,
    findById,
    create,
    deleteById,
    update
}