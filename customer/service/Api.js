class Api {
    async fetchProducts() {
        try {
            const response = await fetch('https://65869ea2468ef171392e7a43.mockapi.io/api/products');
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }
}
