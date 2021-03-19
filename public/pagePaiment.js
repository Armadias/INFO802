start();

function start()
{
    document.getElementsByClassName('button_buy')[0].addEventListener('click', purchaseClicked)
}

var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'fr',
    currency: 'eur',
    token: function(token) {
        var priceElement = document.getElementsByClassName('price_pay')[0];
        var price = parseFloat(priceElement.innerText.replace('€', '')) * 100;

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
        }
        ).then(function(res) {
            return res.json()
        }).then(function(data) {
            document.getElementsByClassName('price_text')[0].innerText ="Achat Terminé, merci de votre confiance!";
            document.getElementsByClassName('button_buy')[0].disabled = true;
            alert(data.message)
        }).catch(function(error) {
            console.error(error)
        })
    }
});

function purchaseClicked() {
    var priceElement = document.getElementsByClassName('price_pay')[0];
    var price = parseFloat(priceElement.innerText.replace('€', '')) * 100;
    stripeHandler.open({
        amount: price
    });
}