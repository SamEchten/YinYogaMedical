let category = "";
let checkedToSchedule = false;

// Show all details per session ->
function productDetails(data) {
  let html = swalProductDetails(data);
  Swal.fire(
    {
      html: html,
      customClass: 'sweetalert-seeproduct',
      confirmButtonColor: '#D5CA9B',
      confirmButtonText: 'OK'
    });
}

$(async function () {
  const res = await (await ApiCaller.getAllSessions()).json();
  loadProducts();
});

// Loading product data  ->
async function loadProducts() {
  const res = await (await ApiCaller.getAllProducts()).json();
  for (r in res) {
    const row = res[r]
    const products = row.products;
    const category = '<h2 class="lbs categoryTitle lead">' + row.category + '</h2>';
    $(category).appendTo("#category")
    //set category to html
    for (i in products) {
      const product = products[i];
      let price = parseInt(product.price).toFixed(2).replace(".", ",");
      loadProductItem(product._id, product.productName, price, product.validFor);
    }
  }
  addEventHandlersSession();
  showOrhideElements();
  clickEvents();
}

async function reloadProducts() {
  $("#category").empty();
  loadProducts();
}

function loadProductItem(id, productName, price, validFor) {
  let html = loadSingleProductItem(id, productName, price, validFor);

  $(html).appendTo("#category");
}

function addEventHandlersSession() {
  $(".productnameTitle").on("click", async function () {
    try {
      const id = $(this).parent().attr('id');
      const res = await ApiCaller.getSingleProduct(id);
      const json = await res.json();
      productDetails(json);
    } catch (err) {
      console.log(err)
    }
  });
}

// Add eventlisteners for button that render in after dom has loaded ->
function clickEvents() {
  if (roleCheck()) {
    // Edit a session ->
    $(".editProduct").on("click", function () {
      const productId = $(this).parent().parent().parent().parent().attr("id");
      editProduct(productId);
    });
    // Remove a session ->
    $(".removeProduct").on("click", function () {
      const productId = $(this).parent().parent().parent().parent().attr("id");
      removeProduct(productId);
    });
    $(".addPeople").on("click", function () {
      const productId = $(this).parent().parent().parent().parent().attr("id");
      addPeople(productId);
    });
  }
  $(".BuyNow").on("click", function () {
    if (checkLogin()) {
      let product = $(this).parent().parent().children("#productNameText").children("h4").text();
      let id = $(this).parent().parent().attr("id");
      buyProduct(product, id);
    } else {
      location.href = "/login";
    }
  });
}

async function editProduct(productId) {
  try {
    let res = await ApiCaller.getSingleProduct(productId); // Get all the infomation from the session
    let json = await res.json();
    let html = swalItemEditProduct(json.category);

    Swal.fire({
      html: html,
      customClass: 'sweetalert-makeProduct',
      showCancelButton: true,
      confirmButtonText: 'Update les',
      confirmButtonColor: '#D5CA9B',
      cancelButtonText: 'Terug',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let jsonData = {
          "productName": $("#productName").val(),
          "price": $("#productPrice").val(),
          "discription": $("#productDescription").val(),
          "amountOfHours": $("#productHours").val(),
          "toSchedule": $("#toschedule").is(":checked"),
          "validFor": $("#productValid").val()
        }
        try {
          let resUpdate = await ApiCaller.updateProduct(jsonData, productId);
          let resJson = await resUpdate.json();
          if (resUpdate.status == 200) {
            Swal.fire({
              title: "Product " + $("#productName").val() + " is gewijzigd!",
              icon: 'success',
              text: "Er zal een Email gestuurd worden naar alle leden die dit product hebben gekocht!",
              showCloseButton: true,
              confirmButtonColor: '#D5CA9B'
            });

            reloadProducts();
          } else {
            Swal.fire({
              title: "Oops!",
              icon: 'warning',
              text: resJson.message,
              showCloseButton: true,
              confirmButtonColor: '#D5CA9B'
            });
          }
        } catch (err) {
          console.log(err);
        }

      } else {

      }
    });

    $("#productName").val(json.productName);
    $("#productDescription").val(json.discription);
    $("#productValid").val(json.validFor);
    $("#productPrice").val(json.price);
    $("#productHours").val(json.amountOfHours);
    if (json.toSchedule) {
      $("#toschedule").attr("checked", true);
    } else {
      $("#toschedule").attr("checked", false);
    }

  } catch (err) {
    console.log(err)
  }
}

// Remove a product as Admin
async function removeProduct(productId) {
  Swal.fire({
    title: 'Weet u zeker dat u dit product wilt verwijderen?',
    showCancelButton: true,
    confirmButtonColor: '#D5CA9B',
    confirmButtonText: 'verwijder',
  }).then(async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      try {
        let res = await ApiCaller.removeProduct(productId);
        if (res.status == 200) {
          reloadProducts();
          toastPopUp("Product verwijderd!", "success");
        }
      } catch (err) {
        console.log(err)
      }
    }
  });
}

function addPeople(productId){
  console.log("add people");
}

function checkToSchedule() {
  if ($(this).attr('checked') == false) {
    checkedToSchedule = false;
  }
  else {
    checkedToSchedule = true;
  }
}

$(".addProduct").on("click", async function () {
  let error = false;
  let html2 = swalItemAddProductCategory();
  Swal.fire({
    html: html2,
    customClass: 'sweetalert-makeProductCategories',
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: 'Cancel'
  })
  $(".categoryButton").on("click", function () {
    setCategory(this.id);
    let html1 = swalItemAddProduct(category);
    Swal.fire({
      html: html1,
      customClass: 'sweetalert-makeProduct',
      showCancelButton: true,
      confirmButtonText: 'Voeg product toe',
      confirmButtonColor: '#D5CA9B',
      cancelButtonText: 'Cancel',
      preConfirm: async () => {
        let add = await addProduct();
        if (add) {
          error = true;
        }
      }
    })
      .then((result) => {
        if (result.isConfirmed) {
          if (error) {
            toastPopUp("Product toegevoegd!", "success");
          } else {
            toastPopUp("Velden niet correct ingevuld.", "warning");
          }
        }
      });
  })
});

function setCategory(categoryTemp) {
  category = categoryTemp;
  swal.clickConfirm();
}

// Add product call ->
async function addProduct() {
  let json = {};
  if (category == "Strippenkaarten") {
    json = {
      "category": category,
      "productName": $("#productName").val(),
      "price": $("#productPrice").val(),
      "discription": $("#productDescription").val(),
      "amountOfHours": $("#productHours").val(),
      "toSchedule": false,
      "validFor": $("#productValid").val()
    }
  } else if (category == "Abonnementen") {
    json = {
      "category": category,
      "productName": $("#productName").val(),
      "price": $("#productPrice").val(),
      "discription": $("#productDescription").val(),
      "amountOfHours": '',
      "toSchedule": false,
      "validFor": $("#productValid").val()
    }
  } else {
    json = {
      "category": category,
      "productName": $("#productName").val(),
      "price": $("#productPrice").val(),
      "discription": $("#productDescription").val(),
      "amountOfHours": '',
      "toSchedule": checkedToSchedule,
      "validFor": $("#productValid").val()
    }
  }
  try {
    let res = await ApiCaller.addProduct(json);
    if (res.status == 200 || res.status == 201) {
      reloadProducts();
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
}

// buy product
function buyProduct(product) {
  let html1 = swalBuyProductCheck(product);
  let html2 = swalGiftProduct();
  Swal.fire({
    html: html1,
    customClass: {
      html: 'sweetalert-subscribe',
      denyButton: 'giftButton',
      confirmButton: 'buyButton',
      cancelButton: 'cancelButton'
    },
    showCancelButton: true,
    showDenyButton: true,
    denyButtonText: `<i class="bi bi-gift"></i> &nbsp; Doe product cadeau`,
    confirmButtonText: 'Koop product',
    confirmButtonColor: '#D5CA9B',
    cancelButtonText: 'Cancel'
  })
    .then(async (result) => {
      if (result.isConfirmed) {
        console.log('redirect to mollie');
        // TODO: Redirect to mollie
      } else if(result.isDenied) {
        Swal.fire({
          html: html2,
          customClass: 'sweetalert-gift',
          showCancelButton: true,
          confirmButtonText: 'Stuur cadeau',
          confirmButtonColor: '#D5CA9B',
          cancelButtonText: 'Cancel'
        }).then(()=> {
          console.log('redirect to mollie');
          // TODO: Redirect to mollie
        });
      }
    });
}




