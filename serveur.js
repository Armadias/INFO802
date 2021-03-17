const port = process.env.PORT || 3000;
const stripeSecretKey = "sk_test_51IW1AdCvIj2XouBnkV7AYb1BHGtAYtO6lQltPWm8gaAZzqfDUVULZ91NGjkJBvaKPomI0tXbdNwKEj6M5rihKasj00uTxSgumB"
const stripePublicKey = "pk_test_51IW1AdCvIj2XouBnBWDHdwfwwbaATovpnkLsZ2oqyHwfPPz9G3zDQONOmGN3nHv59Xo2UQpiQ5EHX5gzU5dFNTo800o0csnsKu"


const express = require('express')
const app = express();

const { request } = require('http');
const soap = require('soap');
const stripe = require("stripe")(stripeSecretKey);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen( port , function(){console.log(`serveur lancé sur le port :${port}`)});




app.use(require("express").urlencoded());

app.set("view engine", "ejs");

app.get('/',function(req,res){
    //res.sendFile(__dirname + "/aaVue/Client.html");
    res.render("client");
    console.log("client rendered!");
});

app.post("/result", function(req, res)
{
    var url = 'https://soapserviceinfo802mf.herokuapp.com/wsdl?wsdl';
    console.log(`url du service soap appelé: ${url}`);
    var args = { poids: req.body.distance, distance: req.body.quantites };

    soap.createClient(url, function (err, client) {
        console.log("Client:" + client);
        client.calculCoutLivraison(args, function (err, result, raw) {
            console.log(result);
            res.render("res",
             {
                 stripePublicKey : stripePublicKey,
                 prix: result.prixLivraison
             });
        });
    });
});




app.post('/achat', function(req, res)
{
    console.log(`req body : ${req.body}`);

    /*
        if (error) {
          res.status(500).end();
        } else {

          var prix = req.body.prix;
    
          stripe.charges.create({
            amount: total,
            source: req.body.stripeTokenId,
            currency: 'usd'
          }).then(function() {
            console.log('Charge Successful')
            res.json({ message: 'Successfully purchased items' })
          }).catch(function() {
            console.log('Charge Fail');
            res.status(500).end()
          });
        }*/
});
