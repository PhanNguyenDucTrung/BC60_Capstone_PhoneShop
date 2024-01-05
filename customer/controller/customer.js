const productsList = document.querySelector('.products-list');

/////////////////////////////////////////////////////////
// Local Storage
const saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(myCart.cart));
};

const loadCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
};

const api = new Api();
const myCart = new Cart();
myCart.cart = loadCartFromLocalStorage();
let products;

async function fetchAndDisplayProducts() {
    try {
        products = await api.fetchProducts();
        renderUI(products);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
fetchAndDisplayProducts();

const renderUI = products => {
    let content = '';
    products.forEach(product => {
        const { id, name, price, screen, backCamera, frontCamera, img, desc } = product;
        content += `
            <div class="product-card-container">
              <div class="product-card">
                <img src="${img}" alt="${name}" class="product-image">
                <div class="product-info">
                  <h3>${name}</h3>
                  <p>${screen}</p>
                  <p>${backCamera}</p>
                  <p>${frontCamera}</p>
                  <p class="desc">${desc}</p> 
                  <p class="price">Giá: ${price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                  <a href="#" class="buy-btn" data-product-id="${id}">Add To Cart</a>
                </div>
              </div>
            </div>`;
    });

    productsList.innerHTML = content;

    const addToCartButtons = document.querySelectorAll('.buy-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
};

const filterProducts = () => {
    const type = document.querySelector('#product-type').value.toLowerCase();

    const filteredProducts =
        type === 'all' ? products : products.filter(product => product.type.toLowerCase() === type);

    renderUI(filteredProducts);
};

document.querySelector('#product-type').addEventListener('change', filterProducts);

///////////////////////////////////////////////////////
// Add to cart
function addToCart(event) {
    event.preventDefault();

    const productId = event.target.dataset.productId;

    const selectedProduct = products.find(product => product.id === productId);

    myCart.addOrUpdateCartItem(selectedProduct);
    saveCartToLocalStorage();

    updateCartItemsList();
}

/////////////////////////////////////////////////////////
// Cart Popup
const cartIcon = document.getElementById('cart-icon');
const cartPopup = document.getElementById('cart-popup');
const cartItemsList = document.getElementById('cart-items-list');

const updateCartItemsList = () => {
    let content = '';
    let totalPrice = 0;

    myCart.cart.forEach(cartItem => {
        const { product, quantity } = cartItem;
        const { id, name, img, price } = product;

        const itemPrice = price * quantity;
        totalPrice += itemPrice;

        content += `
            <li class="cart-item">
                <img src="${img}" alt="${name}">
                <div class="cart-item-info">
                    <h3>${name}</h3>
                    <p class="quantity">Quantity: ${quantity}</p>
                    <p class="quantity">Price: ${price}</p>
                    <div class="quantity-buttons">
                        <button class="quantity-btn" data-action="decrease" data-product-id="${id}">-</button>
                        <button class="quantity-btn" data-action="increase" data-product-id="${id}">+</button>
                        <button class="remove-btn" data-product-id="${id}">Remove</button>
                    </div>
                </div>
            </li>
        `;
    });

    cartItemsList.innerHTML = content;

    document.querySelectorAll('.remove-btn').forEach(removeButton => {
        removeButton.addEventListener('click', event => {
            const productId = event.target.dataset.productId;
            myCart.removeCartItem(productId);
            saveCartToLocalStorage();
            updateCartItemsList();
        });
    });

    // Display total price
    const totalElement = document.createElement('div');
    totalElement.classList.add('total-price');
    totalElement.innerHTML = `<p>Total: ${totalPrice.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    })}</p>`;
    cartItemsList.appendChild(totalElement);
};

document.getElementById('cart-items-list').addEventListener('click', event => {
    event.stopPropagation();
    const target = event.target;
    const action = target.dataset.action;
    const productId = target.dataset.productId;

    if (action && productId) {
        if (action === 'increase') {
            myCart.updateCartItemQuantity(productId, 1);
        } else if (action === 'decrease') {
            const currentQuantity = myCart.cart.find(cartItem => cartItem.product.id === productId)?.quantity || 0;
            if (currentQuantity > 1) {
                myCart.updateCartItemQuantity(productId, -1);
            } else {
                myCart.removeCartItem(productId);
            }
        }

        saveCartToLocalStorage();
        updateCartItemsList();
    }
});

function toggleCartPopup() {
    const currentRightValue = parseFloat(getComputedStyle(cartPopup).right);

    if (currentRightValue === 0) {
        cartPopup.style.right = '-400px';
    } else {
        cartPopup.style.right = '0';
    }
}

cartIcon.addEventListener('click', event => {
    event.stopPropagation();
    toggleCartPopup();
    updateCartItemsList();
});

window.addEventListener('click', event => {
    const cartPopup = document.getElementById('cart-popup');
    if (event.target !== cartIcon && !cartPopup.contains(event.target)) {
        cartPopup.style.right = '-400px';
    }
});

/////////////////////////////////////////////////////////
// Clear cart
const clearCartButton = document.getElementById('checkout-cart-button');

clearCartButton.addEventListener('click', () => {
    myCart.clearCart();
});
