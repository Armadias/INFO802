const port = process.env.PORT || 3000;
const stripeSecretKey = "sk_test_51IW1AdCvIj2XouBnkV7AYb1BHGtAYtO6lQltPWm8gaAZzqfDUVULZ91NGjkJBvaKPomI0tXbdNwKEj6M5rihKasj00uTxSgumB"
const stripePublicKey = "pk_test_51IW1AdCvIj2XouBnBWDHdwfwwbaATovpnkLsZ2oqyHwfPPz9G3zDQONOmGN3nHv59Xo2UQpiQ5EHX5gzU5dFNTo800o0csnsKu"

const { request } = require('http');
const bodyParser = require('body-parser')
const express = require('express')
const app = express();
const soap = require('soap');
const stripe = require("stripe")(stripeSecretKey);

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require("express").urlencoded());

app.listen( port , function(){console.log(`serveur lancé sur le port :${port}`)});

app.get('/',function(req,res){
    res.render("client");
    console.log("client rendered!");
});

// appel Service Soap
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


//Service Rest api avec stripe

app.post('/achat', function(req, res)
{
    console.log(`req body : ${JSON.stringify(req.body)}`);


        if (req.body == null) {
          res.status(500).end();
          console.log("erreur");
        } else {
          stripe.charges.create({
            amount: req.body.price,
            source: req.body.stripeTokenId,
            currency: 'eur'
          }).then(function() {
            console.log('Charge Successful')
            res.json({ message: 'Successfully purchased items' })
            res.status(200).end()
          }).catch(function() {
            console.error('Charge Fail');
            res.status(500).end()
          });
        }
});

//Service Graphql avec firebase

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { ApolloServer, gql } = require('apollo-server-express');

const serviceAccount = require('./graphqlinfo802mf-firebase-adminsdk-1lnu2-f94bbf0c81.json');

admin.initializeApp({
  credential: admin.dredential.cert(serviceAccount),
  databaseUrl: "https://graphqlinfo802mf-default-rtdb.europe-west1.firebasedatabase.app"
});

const typeDefs = gql`
  type Objects {
    type: String
    nom: String
    prix: String
    quantites: String
  }
  
  type Query{
    objects: [Objects]
  }
`

const resolvers = {
  Query: {
    objects: () => {
      return admin
      .database()
      .ref("objects")
      .once("value")
      .then(snap => snap
      .val())
      .then(val => Object
        .keys(val)
        .map (key => val[key]));
    },
  },
};

const server = new ApolloServer({typeDefs, resolvers});

server.applyMiddleware({ app, path: "/json", cors: true});

exportsgraphql = functions.https.onRequest(app);