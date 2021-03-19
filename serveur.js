//variables globales serveur
const port = process.env.PORT || 3000;

//variables globales rest api
const stripeSecretKey = "sk_test_51IW1AdCvIj2XouBnkV7AYb1BHGtAYtO6lQltPWm8gaAZzqfDUVULZ91NGjkJBvaKPomI0tXbdNwKEj6M5rihKasj00uTxSgumB"
const stripePublicKey = "pk_test_51IW1AdCvIj2XouBnBWDHdwfwwbaATovpnkLsZ2oqyHwfPPz9G3zDQONOmGN3nHv59Xo2UQpiQ5EHX5gzU5dFNTo800o0csnsKu"

//variables globales graphql
const { ApolloServer, gql } = require('apollo-server-express');

//import serveur général
const { request } = require('http');
const express = require('express');
const app = express();
const fetch = require('node-fetch');

//import soap
const soap = require('soap');

//import rest
const stripe = require("stripe")(stripeSecretKey);

//import graphql
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./graphqlinfo802mf-firebase-adminsdk-1lnu2-f94bbf0c81.json');

//init du serveur pour les 3 services
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require("express").urlencoded());

//lancement du serveur
app.listen( port , function(){console.log(`serveur lancé sur le port :${port}`)});

app.get('/',function(req,res){
  console.log("client rendered!");
  
  fetch("https://info802follietmartin.herokuapp.com/json?query={objects{nom, type, prix, quantites, image}}", 
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  .then(resultat => resultat.json())
  .then(function(json){
    res.render("client", {json : json.data})
  });
});

// appel Service Soap
app.post("/soap", function(req, res)
{
  var url = 'https://soapserviceinfo802mf.herokuapp.com/wsdl?wsdl';
  console.log(`url du service soap appelé: ${url}`);
  var args = { prix: req.body.price, distance: req.body.distance };

  soap.createClient(url, function (err, client) {
    client.calculCoutLivraison(args, function (err, result, raw) {
      console.log(`le prix total: ${result.prixLivraison}`);
      res.render("pagePaiment",
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
      res.json({ message: 'Achat confirmé!' })
      res.status(200).end()
    }).catch(function() {
      console.error('Charge Fail');
      res.status(500).end()
    });
  }
});

//Service Graphql avec firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://graphqlinfo802mf-default-rtdb.europe-west1.firebasedatabase.app/"
});

const typeDefs = gql`
type Objects {
  type: String
  nom: String
  prix: String
  quantites: String
  image: String
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
    
exports.graphql = functions.https.onRequest(app);
    
    
    
    