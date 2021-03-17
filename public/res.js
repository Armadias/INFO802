start();

function start()
{
    document.getElementsByClassName('button_buy')[0].addEventListener('click', purchaseClicked)
}

var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'en',
    token: function(token) {
        console.log(token);

        var priceElement = document.getElementsByClassName('prixAPayer')[0];
        var price = parseFloat(priceElement.innerText.replace('€', '')) * 100;

        console.log(price);
        console.log("TOKENID" + token.id);
        
        fetch('/achat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                price: price
            })
        })/*.then(function(res) {
            return res.json()
        }).then(function(data) {
            alert(data.message)
            var priceElement = document.getElementsByClassName('prixAPayer')[0].innerText = "Achat Terminé, merci de votre confiance!";
        }).catch(function(error) {
            console.error(error)
        })*/
    }
});

function purchaseClicked() {
    var priceElement = document.getElementsByClassName('prixAPayer')[0];
    var price = parseFloat(priceElement.innerText.replace('€', '')) * 100;
    stripeHandler.open({
        amount: price
    });

    //window.alert(price);
}