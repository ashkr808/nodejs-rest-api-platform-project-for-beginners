const {getPublicAssets, getPostData} = require('../utils')


async function getHompage(req,res){
        getPublicAssets('index.html',req,res)
}

async function getAboutPage(req,res){
        getPublicAssets('about.html',req,res)
}

async function sendPublicAssets(req,res){
        getPublicAssets(req.url,req,res)
}

async function getLoginPage(req,res){
        getPublicAssets('login.html',req,res)
}
async function getSignUpPage(req,res){
        getPublicAssets('signup.html',req,res)
}
async function getDashboardPage(req,res){
        getPublicAssets('dashboard.html',req,res)
}
async function handleFeeadbackForm(req,res){
        let data = await getPostData(req)
        let url = `http://test.com/?${data}`
        let params = new URL(url).searchParams
        let name = params.get('name')
        let email = params.get('email')
        let feedback = params.get('feedback')
        if(name.trim()==''){
                res.writeHead(422,{'Content-type':'text/html'})
                res.end("Please enter name")
                return
        }
        if(email.trim()==''){
                res.writeHead(422,{'Content-type':'text/html'})
                res.end("Please enter email")
                return
        }
        if(feedback.trim()==''){
                res.writeHead(422,{'Content-type':'text/html'})
                res.end("Please enter feedback")
                return
        }
        res.writeHead(201,{'Content-type':'text/html'})
        res.end(`
        
        <!doctype html>
        <html lang="en">
        <head>
        <title>Thank you</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        </head>
        <body style="min-height:100vh" class="d-flex flex-column justify-content-center align-items-center">
        <center> 
                <img src="/assets/images/thank-you.svg" class="mb-4" style="height:200px">
        </center>
        <h2 class="m-0 mb-4 display-4">Thank you ${name} for feedback.</h2>
        <a href="/">Back to home</a>

        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
        </body>
        </html>


        `)
}


module.exports={
    getHompage,
    getAboutPage,
    sendPublicAssets,
    handleFeeadbackForm,
    getLoginPage,
    getSignUpPage,
    getDashboardPage
}
