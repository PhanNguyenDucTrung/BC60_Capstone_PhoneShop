class Api {
  //Method
  fetchData() {
    return axios({
      url: "https://65869ea2468ef171392e7a43.mockapi.io/api/products",
      method: "GET",
    })
  };
  PushData(product) {
    return axios({
      url: "https://65869ea2468ef171392e7a43.mockapi.io/api/products",
      method: "POST",
      data: product,
    });
  };
  getProductById(id) {
    return axios({
      url: `https://65869ea2468ef171392e7a43.mockapi.io/api/products/${id}`,
      method: "GET",
    })
  }
  updateData(product) {
    return axios({
      url: `https://65869ea2468ef171392e7a43.mockapi.io/api/products/${product.id}`,
      method: "PUT",
      data: product
    })
  }
  DeleteData(id) {
    return axios({
      url: `https://65869ea2468ef171392e7a43.mockapi.io/api/products/${id}`,
      method: "DELETE",
    })
  }
}
