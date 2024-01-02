class Cart {
    constructor() {
        this.cart = [];
    }

    addOrUpdateCartItem(product) {
        const existingCartItem = this.cart.find(cartItem => cartItem.product.id === product.id);

        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            const newCartItem = new CartItem(product, 1);
            this.cart.push(newCartItem);
        }
    }

    removeCartItem(productId) {
        const index = this.cart.findIndex(cartItem => cartItem.product.id === productId);
        if (index !== -1) {
            this.cart.splice(index, 1);
        }
    }

    updateCartItemQuantity(productId, quantity) {
        const index = this.cart.findIndex(cartItem => cartItem.product.id === productId);
        if (index !== -1) {
            this.cart[index].quantity += quantity;
        }
    }

    clearCart() {
        myCart.cart = [];
        // Save the updated cart to local storage
        saveCartToLocalStorage();
        // Update the cart UI
        updateCartItemsList();
    }
}
