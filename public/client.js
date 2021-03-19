start()


function start()
{
    document.getElementsByClassName('btn_deliveries')[0].disabled = true;

    var removeCartObjectButtons = document.getElementsByClassName('btn_danger');
    for (var i =0; i < removeCartObjectButtons.length; i++)
    {
        var button = removeCartObjectButtons[i];
        button.addEventListener('click', removeCartObject);
    }
    var quantityInputs = document.getElementsByClassName('cart_quantity_input');
    for (var i =0; i< quantityInputs.length; i++)
    {
        var input = quantityInputs[i];
        input.addEventListener('click', quantityChanged);
    }
    
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
    var max = parseInt(object.getElementsByClassName('object_quantity')[0].innerText);
        
    addObjectToCart(title, price, image, max);
    updateCartTotal();
}

function addObjectToCart(title, price, image, max)
{
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart_row');
    cartRow.dataset.itemId = title;
    var cartObjects = document.getElementsByClassName('cart_objects')[0];
    var cartObjectNames = cartObjects.getElementsByClassName('cart_object_name');
    for (var i = 0; i < cartObjectNames.length; i++) {
        if (cartObjectNames[i].innerText == title) {
            alert('Cet objet est déjà dans le panier!');
            return;
        }
    }
    
    var cartRowContents = `
    <div class="cart_object cart_column">
    <img class="cart_object-image" src="${image}" width="100" height="100">
    <span class="cart_object_name">${title}</span>
    </div>
    <span class="cart_price cart_column">${price}</span>
    <div class="cart_quantity cart_column">
    <input class="cart_quantity_input" type="number" value="1" min="1" max="${max}">
    <button class="btn btn_danger" type="button">SUPPRIMER</button>
    </div>`;
    cartRow.innerHTML = cartRowContents;
    cartObjects.append(cartRow);
    cartRow.getElementsByClassName('btn_danger')[0].addEventListener('click', removeCartObject);
    cartRow.getElementsByClassName('cart_quantity_input')[0].addEventListener('change', quantityChanged);
}

function removeCartObject(event)
{
    var onClick = event.target;
    onClick.parentElement.parentElement.remove();
    updateCartTotal();
}

function quantityChanged(event)
{
    var input = event.target;
    if (isNaN(input.value) || input.value <=0 )
    {
        input.value = 1;
    }
    updateCartTotal();
}

function updateCartTotal()
{
    var cartObjectContainer = document.getElementsByClassName('cart_objects')[0];
    var cartRow = cartObjectContainer.getElementsByClassName('cart_row');
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
    document.getElementsByClassName("price")[0].value = total;
    
    if (total <= 0)
    document.getElementsByClassName('btn_deliveries')[0].disabled = true;
    else
        document.getElementsByClassName('btn_deliveries')[0].disabled = false;
}

