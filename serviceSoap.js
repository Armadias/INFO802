const port = process.env.PORT || 3000;

const { request } = require('http');
const soap = require('soap');
const app = require('express')();

var sSoap = 
{
    //nom du service
    servicesCoutLivraison: 
    {
        //nom du port
        prixLivraison: 
        {
            //nom de la fonction
            calculCoutLivraison: function (args)
            {
                let prixParKm = 2;
                
                let prixTmp = args.prix || 0;
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

//récupération du fichier wsdl
var xml = require("fs").readFileSync("serviceSoap.wsdl", "utf8");


app.set('view engine', 'ejs');

app.listen( port , function()
{
    //mise à l'écoute du service soap pour une requête future
    soap.listen(app, '/wsdl', sSoap, xml, function () {
        console.log(`Service SOAP à l'écoute sur le port: ${port}`);
    });
}
);

app.get("/", function(req,res)
{
    res.render("index");
})
