const express = require('express');
const fs = require('fs');
const { get } = require('http');
const fetch = require('node-fetch');

const app = express();
const port = 8090;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static((__dirname + '/assets')));

var mydata = fs.readFileSync('assets/data/products.json')
var productsData = JSON.parse(mydata);
console.log(productsData);

//Affiche mon fichier HTML 
app.get("/", function(req, res){
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile('index.html', function(err, data){
        if(err) throw err;
        res.end(data);
    });
});

app.post('/products', function(req, res) {
    console.log('inside function', productsData);
    let newProd = req.body
    productsData.push(newProd);
    console.log(productsData)
    fs.writeFile('assets/data/products.json', JSON.stringify(productsData, null, 4), (err) => {
        if (err) throw err;
        console.log('New product added successfully')
    })
    return res.redirect('/');
    });

app.get('/products', function (req, res) {
    fs.readFile('assets/data/products.json', (err,data)=>{
        if (err) throw err;
        let myproducts = JSON.parse(data);
        res.json(myproducts);
    })
});

app.patch('/products/:ref', function(req, res) {
    fs.readFile('assets/data/products.json', (err, data) => {
        if (err) throw err;
        let myproducts = JSON.parse(data);
        console.log(req.body)
        const refEdit = req.params.ref;  
        let selectedProduct = myproducts.find(product => product.ref == refEdit);
        selectedProduct.name = req.body.name
        selectedProduct.ref = req.body.ref
        selectedProduct.price = req.body.price
        selectedProduct.inv = req.body.inv
        selectedProduct.files = req.body.files
        selectedProduct.desc = req.body.desc
        console.log(myproducts)
        res.send(myproducts)
        fs.writeFile('assets/data/products.json', JSON.stringify(myproducts, null, 4), (err) => {
            if(err) throw err;
            console.log("-----\nLe produit dans la catégorie "+ selectedProduct.name+ " référencé '" + selectedProduct.ref + "' " + "a été édité avec sucès\n-----");
            });
    });
});

app.delete('/products/:ref', function(req, res) {
    fs.readFile('assets/data/products.json', (err, data) => {
        if (err) throw err;
        let myproducts = JSON.parse(data);
        const refDel = req.params.ref;  
        const found = myproducts.find(product => product.ref == refDel);
        myproducts.splice(myproducts.indexOf(found), 1);
        console.log(myproducts)
        res.send(myproducts)
        fs.writeFile('assets/data/products.json', JSON.stringify(myproducts, null, 4), (err) => {
            if(err) throw err;
            console.log("-----\nLe produit dans la catégorie "+ found.name+ " référencé '" + found.ref + "' " + "a été supprimé avec sucès\n-----");
            });
    });
});

app.listen(port, () => {
    console.log('\nServer running on http://localhost:' + port);
});
