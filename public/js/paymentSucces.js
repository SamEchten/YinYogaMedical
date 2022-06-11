$(async function () {
    $(".thanksMessage").text(user.fullName + " bedankt voor uw aankoop!");
    let url = window.location.pathname;
    console.log(url)
  
});

async function getBoughtProduct () {
    let res = await ApiCaller.getSingleProduct();
    let json = await res.json();
};

// title of product
// description of product
// full Name