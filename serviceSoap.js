const { request } = require('http');
var soap = require('soap');
var app = require('express')();

var sSoap = 
{
    servicesCoutLivraison: 
    {
        prixLivraison: 
        {
            
            calculCoutLivraison: function (args)
            {
                let prixParKm = 2;
                
                let prixTmp = args.price || 0;
                let distance = args.distance || 0;
                
                let prixKm = prixParKm * distance;
                
                let prix = prixTmp + (prixKm * 0.9);
                
                return {
                    prixLivraison: prix
                };
            }
        }
    }
};

var xml = require("fs").readFileSync("serviceSoap.wsdl", "utf8");

let port = process.env.PORT || 3000;

app.listen( port , function()
{
    soap.listen(app, '/wsdl', sSoap, xml, function () {
        console.log(`Serveur lancé sur le port ${port}`);
    });
}
);
