const { request } = require('http');
var soap = require('soap');
var app = require('express')();

var ejs = require('ejs');

var mango = require('mangopay');

var sSoap = 
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
);


app.use(require("express").urlencoded());

app.set("view engine", "ejs");

app.get('/',function(req,res){
    //res.sendFile(__dirname + "/aaVue/Client.html");
    res.render("client");
});

app.post("/result", function(req, res)
{
    var url = 'http://localhost:3000/wsdl?wsdl';
    var args = { poids: req.body.distance, distance: req.body.quantites };

    soap.createClient(url, function (err, client) {
        client.calculCoutLivraison(args, function (err, result, raw) {
            console.log(result);
            res.render("res", {prix: result.prixLivraison});
        });
    });
});