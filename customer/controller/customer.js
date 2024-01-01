const productsList = document.querySelector('.products-list');

const myCart = new Cart();
let products;

async function fetchAndDisplayProducts() {
    try {
        // const response = await fetch('../../products.json');
        const response = await fetch('https://65869ea2468ef171392e7a43.mockapi.io/api/products');
        products = await response.json();
        console.log(products);
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
const cart = [];

const addToCart = event => {
    // Prevent the default behavior of the anchor tag
    event.preventDefault();

    // Get the product ID from the data attribute
    const productId = event.target.dataset.productId;

    // Find the selected product in the products array
    const selectedProduct = products.find(product => product.id === productId);

    // Check if the product is already in the cart
    const existingCartItemIndex = myCart.timViTri(productId);

    if (existingCartItemIndex !== -1) {
        // If the product is already in the cart, update its quantity
        myCart.capNhatSoLuong(productId, myCart.cart[existingCartItemIndex].quantity + 1);
    } else {
        // If the product is not in the cart, create a new CartItem
        const newCartItem = new CartItem(selectedProduct, 1);
        myCart.themGH(newCartItem);
    }

    // Optional: Update the UI to reflect the change (e.g., show a notification)
    console.log('Product added to the cart.');
    console.log('Current Cart:', myCart.cart);
};
