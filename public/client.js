start()

function start()
{
    var addCart = document.getElementsByClassName('object_ajout');
    for (var i = 0; i < addCart.length; i++)
    {
        var button = addCart[i];
        button.addEventListener('click', addToCart);
    }
}

function addToCart(event)
{
    var button = event.target;
    var object = button.parentElement.parentElement;
    var title = object.getElementsByClassName('object_name')[0].innerText;
    var price = object.getElementsByClassName('object_price')[0].innerText;
    var image = object.getElementsByClassName('object_image')[0].src;

    addObjectToCart(title, price, image);
    updateCartTotal();
}

function addObjectToCart(title, price, image)
{
    var row = document.createElement('div');
    row.classList.add('row');
    row.dataset.itemId = title;

    var cartObject = document.getElementsByClassName('cart_object')[0];
    var cartObjectNames = cartObject.getElementsByClassName('cart_object_name');

    console.log("salut");
    for (var i = 0; i < cartObjectNames.length; i++)
    {
        console.log(cartObjectNames[i].innerText);
        console.log(title);
        if (cartObjectNames[i].innerText == title)
        {
            alert("cet objet est déjà dans le panier!");
            return
        }
    }
    console.log("au revoir");

    var cartRowContents = `
        <div class="cart_object cart_column">
            <img class="cart_object_image" src="${image}" width="100" height="100">
            <span class="cart_object_title">${title}</span>
        </div>
        <span class="cart_price">${price}</span>
        <div class="cart_quantity cart_column">
            <input class="cart_quantity_input" type="number" value="1">
            <button class="btn btn_danger" type="button">SUPPRIMER</button>
        </div>
    `

    row.innerHTML = cartRowContents;
    cartObject.append(row);
    row.getElementsByClassName('btn_danger')[0].addEventListener('click', removeCartItem);
    row.getElementsByClassName('cart_quantity_input')[0].addEventListener('change', quantityChanged);
}

function removeCartItem()
{}

function quantityChanged(event)
{
    var input = event.target;
    
}

function updateCartTotal()
{
    var cartObjectContainer = document.getElementsByClassName('cart_object')[0];
    var cartRow = cartObjectContainer.getElementsByClassName('row');
    var total = 0;

    for (var i = 0; i < cartRow.length; i++)
    {
        var row = cartRow[i];
        var priceElement = row.getElementsByClassName('cart_price')[0];
        var quantityElement = row.getElementsByClassName('cart_quantity_input')[0];
        var price = parseFloat(priceElement.innerText.replace('€', ''));
        var quantity = quantityElement.value;
        total += (price * quantity);
    }
    total = Math.round(total);
    document.getElementsByClassName("cart_total_price")[0].innerText = total + '€';
}