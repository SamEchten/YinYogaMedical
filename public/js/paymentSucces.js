$(async function () {
    $(".thanksMessage").text(user.fullName + " bedankt voor uw aankoop!");
    let url = window.location.pathname;
    await setSuccesPaymentValues()
    console.log(url)
  
});

async function getBoughtProduct () {
    let productId = location.href.split("/").slice(-1)[0];
    let res = await ApiCaller.getSingleProduct(productId);
    let json = await res.json();
    console.log(json);
    return json;
};

async function setSuccesPaymentValues () {
    let product = await getBoughtProduct();
    let name = $(".productName");
    let price = $(".productPrice");
    let productDes = $(".boughtProductDes");

    

}

// title of product
// description of product
// full Name