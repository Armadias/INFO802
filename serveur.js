const { request } = require('http');
var soap = require('soap');
var app = require('express')();

var ejs = require('ejs');

var api = require("request");

/*var sSoap = 
{
    servicesCoutLivraison: 
    {
        prixLivraison: 
        {
            
            calculCoutLivraison: function (args)
            {
                let prixParKg = 1;
                let prixParKm = 2;
                
                let poids = args.poids || 0;
                let distance = args.distance || 0;
                
                let prixPoids = prixParKg * poids;
                let prixKm = prixParKm * distance;
                
                let prix = (prixPoids * 0.5) + (prixKm * 0.9);
                
                return {
                    prixLivraison: prix
                };
            }
        }
    }
};

var xml = require("fs").readFileSync("serveur.wsdl", "utf8");

let port = process.env.PORT || 3000;

app.listen( port , function()
{
    soap.listen(app, '/wsdl', sSoap, xml, function () {
        console.log(`Serveur lancé sur le port ${port}`);
    });
}
);*/



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
    console.log(url);
    var args = { poids: req.body.distance, distance: req.body.quantites };

    soap.createClient(url, function (err, client) {
        console.log("Client:" + client);
        client.calculCoutLivraison(args, function (err, result, raw) {
            console.log(result);
            res.render("res", {prix: result.prixLivraison});
        });
    });
});



app.post("/payez", function(req, res)
{
    api.post(`http://localhost:${port}/paiment`, 
    {
        form: 
        {
            carteBleue : req.body.cb,
            prix : req.body.prix
        }
    }, function(error, response, body)
    {
        if (error)
        {
            console.log(error);
            res.send(error);
        }
        
        if (response.statusCode == 200)
        {
            paimentacc = JSON.parse(body);
            res.render("payment_accepte", {message : paimentacc.message});
            console.log(paimentacc);
        }
        else if ( response.statusCode == 400)
        {
            res.send("ERROR 400");
            console.log(body);
        }
    }
    );
});

// api rest
app.post("/paiment", function(req, res)
{
    if (req.body.carteBleue)
    {
        res.status(200).send(
            {
                status : 200,
                message : "vous avez payé " + req.body.prix + "€"
            }
        );
    }
    else
    {
        res.status(400).send(
            {
                status : 400,
                message : "la carte bleue n'existe pas ou est invalide"
            }
        );
    }
});