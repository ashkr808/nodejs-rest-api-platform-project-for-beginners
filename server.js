const http = require('http')
const {getProducts,getProduct,createProduct,deleteProduct,updateProduct} = require('./controller/ProductController')
const {getHompage,getAboutPage,sendPublicAssets, handleFeeadbackForm, getLoginPage,getSignUpPage, getDashboardPage} = require('./controller/PagesController')
const {createUser,login, checkAuth, signup,regenApiKey, logout} = require('./controller/AuthController')
const {isAuthenricated} = require('./middleware')

const server = http.createServer(async(req,res)=>{
    if(req.url === '/'){
         
        getHompage(req,res)

    } else if(req.url === '/about'){

        getAboutPage(req,res)

    } else if(req.url === '/login' && req.method === 'GET'){

        getLoginPage(req,res)

    } else if(req.url === '/signup' && req.method === 'GET'){

        getSignUpPage(req,res)

    } else if(req.url === '/dashboard' && req.method === 'GET'){
       
        getDashboardPage(req,res)

    } else if(req.url === '/login'  && req.method === 'POST'){

        login(req,res)

    } else if(req.url === '/logout'  && req.method === 'POST'){

        logout(req,res)

    }  else if(req.url === '/signup' && req.method === 'POST'){

        signup(req,res)

    }  else if(req.url === '/checkAuth'  && req.method === 'POST'){

        checkAuth(req,res)

    } else if(req.url === '/regenApiKey'  && req.method === 'POST'){

        regenApiKey(req,res)

    } else if(req.url === '/feedback' && req.method === 'POST'){

        handleFeeadbackForm(req,res)

    } else if(req.url.match(/\/assets\/./) && req.method === 'GET'){
        
        sendPublicAssets(req,res)

    } else if(req.url.match(/\/api\/prod/)){
        // all /api/* routes

        if(isAuthenricated(req,res))
        if(req.url === '/api/products' && req.method === 'GET'){
            
            getProducts(req,res)
    
        } else if(req.url.match(/\/api\/product\/([0-9]+)/) && req.method === 'GET'){
    
            const id = req.url.split('/')[3]
            getProduct(req,res,id)
    
        } else if(req.url === '/api/product' && req.method === 'POST'){
    
            createProduct(req,res)
    
        } else if(req.url.match(/\/api\/product\/([0-9]+)/) && req.method === 'DELETE'){
    
            const id = req.url.split('/')[3]
            deleteProduct(req,res,id)
    
        } else if(req.url.match(/\/api\/product\/([0-9]+)/) && req.method === 'PUT'){
    
            const id = req.url.split('/')[3]
            updateProduct(req,res,id)
    
        } 

    } else if(req.url.match(/\/api\/user/)){

        if(req.url === '/api/user' && req.method === 'POST'){
    
            createUser(req,res)
    
        } 
    } else{

        res.writeHead(404,{'Content-type':'application/json'})
        res.end(JSON.stringify({message: '404: Not Found'}))

    }
})


const PORT= 5000 || process.env.PORT

server.listen(PORT,()=>console.log(`server stated at port ${PORT}`));

