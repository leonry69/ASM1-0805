var express = require('express')
var hbs = require('hbs')

var app = express()
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false}))
app.set('view engine','hbs')

var url = 'mongodb+srv://asm2:huy0966902734@cluster0.puba8.mongodb.net/test';
var MongoClient = require('mongodb').MongoClient;

app.get('/home', (req,res)=>{
    res.render('/home')
})
app.get('/about', (req,res)=>{
    res.render('about',{
        pageTitle:'About page'
    })
})

app.get('/',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo= client.db("ATN");
    let results= await dbo.collection("product").find({}).toArray();
    res.render('home',{model:results})
})
app.post('/search',async (req,res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATN");
    let nameInput = req.body.txtName;
    let searchCondition = new RegExp(nameInput,'i')
    let results = await dbo.collection("product").find({name:searchCondition}).toArray();
    res.render('home',{model:results})

})
app.get('/delete',async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectId;
    let condition = {"_id" : ObjectID(id)};
    let client= await MongoClient.connect(url);
    let dbo = client.db("ATN");
    await dbo.collection("product").deleteOne(condition);
    res.redirect('/')

})

app.get('/insert',(req,res)=>{
    res.render('newProduct')
})
app.post('/doInsert', async(req,res)=>{
    var nameInput = req.body.txtName;
    var priceInput = req.body.txtPrice;
    var newProduct = {name:nameInput, price:priceInput};
    let client= await MongoClient.connect(url);
    let dbo= client.db("ATN");
    await dbo.collection("product").insertOne(newProduct)
    res.redirect('/')
})

const PORT = process.env.PORT || 5000
app.listen(PORT);
console.log('Sever is running ' + PORT)