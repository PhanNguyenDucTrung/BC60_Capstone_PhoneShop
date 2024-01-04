const api = new Api()
const getEle = id => document.getElementById(id)
const validation = new Validation()


//Hiện sp
function renderUI(data) {
    let content = ``
    for (let i = 0; i < data.length; i++) {
        const item = data[i]
        content += `
        <tr>
            <td style="font-size:1.1rem"><b>${i + 1}</b></td>
            <td style="font-size:1.2rem"><b>${item.name}</b></td>
            <td style="font-size:1.2rem"><b>${item.price}</b></td>
            <td><img style = "max-width: 100px" src="${item.img}" alt=""></td>
            <td class="text-left">
                <b>Screen:</b> ${item.screen} <br>
                <b>Camera Trước:</b> ${item.frontCamera} <br>
                <b>Camera sau:</b> ${item.backCamera} <br>
                <b>Mô tả:</b> ${item.desc}
            </td>
            <td style="font-size:1.2rem"><b>${item.type}</b></td>
            <td>
                <button id="btnEdit" onclick="handleEdit(${item.id})" class="btn btn-primary" data-toggle="modal" data-target="#modelId">Sửa</button>
                <button onclick = "DeleteProduct(${item.id})" class="btn btn-danger">Xoá</button>
            </td>
        </tr>
        `
    }
    getEle("tblDanhSachSP").innerHTML = content
}
// Lấy và hiện sp
async function fetchDisplayProduct() {
    try {
        const result = await api.fetchData()
        renderUI(result.data)
    } catch (error) {
        console.log("Lỗi", error);
    }
}
fetchDisplayProduct()
// Thực hiện validation
function HandleValidation(isAdd) {
    //Lấy dữ liệu
    const nameElement = getEle("AddNameProduct").value
    const priceElement = getEle("AddPrice").value
    const screenElement = getEle("AddScreen").value
    const BackCamElement = getEle("AddBackCam").value
    const FrontCamElement = getEle("AddFrontCam").value
    const imgElement = getEle("AddImg").value
    const typeElement = getEle("AddType").value
    const descElement = getEle("AddMoTa").value
    //Validation
    let isValid = true
    //check Name
    isValid &= validation.checkNull(nameElement, "spanTenSP", "Hãy nhập tên sản phẩm")
    //check Price 
    isValid &= validation.checkNull(priceElement, "spanPrice", "Hãy nhập giá sản phẩm")
        && validation.checkNeg(priceElement, "spanPrice", "Hãy nhập đúng giá sản phẩm")

    //check Screen
    isValid &= validation.checkNull(screenElement, "spanScreen", "Hãy nhập màn hình")
    //check Back Camera
    isValid &= validation.checkNull(BackCamElement, "spanBackCam", "Hãy nhập Camera sau")
    //Check Front Camera
    isValid &= validation.checkNull(FrontCamElement, "spanFrontCam", "Hãy nhập Camera trước")
    //Check Img
    isValid &= validation.checkNull(imgElement, "spanImg", "Hãy nhập hình ảnh")
    //Check type
    isValid &= validation.checkNull(typeElement, "spanType", "Hãy nhập hãng sản phẩm")
    //Check description
    isValid &= validation.checkNull(descElement, "spanDesc", "Hãy nhập mô tả")

    if (!isValid) return null
    // tạo đối tượng từ lớp đối tượng Product
    const productElement = new Product("",
        nameElement,
        priceElement,
        screenElement,
        BackCamElement,
        FrontCamElement,
        imgElement,
        typeElement,
        descElement)
    return productElement
}

//UI Add product
getEle("btnAddProduct").onclick = function () {
    //update title => header model
    document.getElementsByClassName("modal-title")[0].innerHTML = "Add product"
    //add button "Add Product" => footer model
    const btnAdd = `<button onclick ="handleAddProduct()" class = "btn btn-success">Add</button>`
    document.getElementsByClassName("modal-footer")[0].innerHTML = btnAdd
    getEle("AddNameProduct").value = ""
    getEle("AddPrice").value = ""
    getEle("AddScreen").value = ""
    getEle("AddBackCam").value = ""
    getEle("AddFrontCam").value = ""
    getEle("AddImg").value = ""
    getEle("AddType").value = ""
    getEle("AddMoTa").value = ""
}
//Thêm sản phẩm
async function handleAddProduct() {
    const product = HandleValidation(true)
    if (!product) return
    await api.PushData(product)
    try {
        alert("Add Success!");
        //re-fetch data
        fetchDisplayProduct()
        //close modal
        document.getElementsByClassName("close")[0].click();
    } catch (error) {
        console.log(error);
    }
}
//  hiện thông tin cập nhật edit
async function handleEdit(id) {
    // Custom UI
    document.getElementsByClassName("modal-title")[0].innerHTML = "Sửa thông tin sản phẩm"
    const btnEdit = `<button onclick ="HandleUpdate(${id})" class = "btn btn-success">Update</button>`
    document.getElementsByClassName("modal-footer")[0].innerHTML = btnEdit

    const product = await api.getProductById(id)
    try {
        const productItem = product.data
        getEle("AddNameProduct").value = productItem.name
        getEle("AddPrice").value = productItem.price
        getEle("AddScreen").value = productItem.screen
        getEle("AddBackCam").value = productItem.backCamera
        getEle("AddFrontCam").value = productItem.frontCamera
        getEle("AddImg").value = productItem.img
        getEle("AddType").value = productItem.type
        getEle("AddMoTa").value = productItem.desc
    } catch (error) {
        console.log(error);
    }
}
//Cập nhật lên server
async function HandleUpdate(id) {
    const nameElement = getEle("AddNameProduct").value
    const priceElement = getEle("AddPrice").value
    const screenElement = getEle("AddScreen").value
    const BackCamElement = getEle("AddBackCam").value
    const FrontCamElement = getEle("AddFrontCam").value
    const imgElement = getEle("AddImg").value
    const typeElement = getEle("AddType").value
    const descElement = getEle("AddMoTa").value

    const product = new Product(
        id,
        nameElement,
        priceElement,
        screenElement,
        BackCamElement,
        FrontCamElement,
        imgElement,
        typeElement,
        descElement
    )
    await api.updateData(product)
    try {
        alert("Cập nhật thành công")
        fetchDisplayProduct()
        document.getElementsByClassName("close")[0].click()
    } catch (error) {
        console.log(error);
    }
}
//Xoá sản phẩm
async function DeleteProduct(id) {
    await api.DeleteData(id)
    try {
        alert("Xoá thành công")
        fetchDisplayProduct()
    } catch (error) {
        console.log(error);
    }
}

//Tìm tên
document.getElementById("txtFindName").addEventListener("keyup", listenerBar)
async function listenerBar() {
    // Dữ liệu server
    const result = await api.fetchData()
    const dataArr = result.data
    //Mảng chứa kết quả trùng
    let finalResult = []
    //tên cần tìm
    let nameRequest = getEle("txtFindName").value
    for (let i = 0; i < dataArr.length; i++) {
        const product = dataArr[i].name
        //Chuyển về chữ thường
        const TenSP = product.toLowerCase()
        const TenTimKiem = nameRequest.toLowerCase()
        //So sánh
        const KqSoSanh = TenSP.indexOf(TenTimKiem)
        if (KqSoSanh !== -1) {
            finalResult.push(dataArr[i])
        }
    }

    if (finalResult.length === 0) {
        getEle("tblDanhSachSP").innerHTML = '<h5>Không tìm thấy sản phẩm :(</h5>'
    } else {
        renderUI(finalResult)
    }
    return finalResult

}

//Sắp xếp lớn đến nhỏ
async function SortLargeToSmall() {
    let ProductAreShow = await listenerBar()
    //Lấy dữ liệu sau sắp xếp theo tên hoặc từ server
    let product = []
    if (ProductAreShow !== 0) {
        product = ProductAreShow
    } else {
        const result = await api.fetchData()
        product = result.data
    }
    //SO sánh
    for (let i = 0; i < product.length; i++) {
        for (let j = i + 1; j < product.length; j++) {
            if (product[i].price < product[j].price) {
                [product[i], product[j]] = [product[j], product[i]]
            }
        }
    }
    renderUI(product)
}
async function SortSmallToLarge() {

    let ProductAreShow = await listenerBar()
    //Lấy dữ liệu sau sắp xếp theo tên hoặc từ server
    let product = []
    if (ProductAreShow !== 0) {
        product = ProductAreShow
    } else {
        const result = await api.fetchData()
        product = result.data
    }
    //So sánh
    for (let i = 0; i < product.length; i++) {
        for (let j = i + 1; j < product.length; j++) {
            if (product[i].price > product[j].price) {
                [product[i], product[j]] = [product[j], product[i]]
            }
        }
    }
    renderUI(product)
}
