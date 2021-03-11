var soap = require('soap');
var url = 'http://localhost:3000/wsdl?wsdl';
var args = { poids: 50, distance: 150 };
soap.createClient(url, function (err, client) {
    client.calculCoutLivraison(args, function (err, result, raw) {
        console.log(result);
    });
});