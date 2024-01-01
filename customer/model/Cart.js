class Cart {
    constructor() {
        this.cart = [];
    }

    addToCart(product) {
        const existingCartItem = this.cart.find(cartItem => cartItem.product.id === product.id);

        if (existingCartItem) {
            // If product already in cart, increase quantity by 1
            existingCartItem.quantity += 1;
        } else {
            // If product not in cart, add new CartItem with quantity 1
            const newCartItem = new CartItem(product, 1);
            this.cart.push(newCartItem);
        }
    }

    timViTri = id => {
        return this.cart.findIndex(cartItem => cartItem.product.id === id);
    };

    xoaGH = id => {
        const index = this.timViTri(id);
        if (index !== -1) {
            this.cart.splice(index, 1);
        }
    };

    capNhatSoLuong = (id, sl) => {
        const index = this.timViTri(id);
        if (index !== -1) {
            this.cart[index].quantity += sl;
        }
    };
}
