let category = "";
let checkedToSchedule = false;
let allProducts = [];

$(async function () {
  await getProducts();
  loadProducts();
});

//Gets all products from the server
const getProducts = async () => {
  let res = await ApiCaller.getAllProducts();
  allProducts = await res.json();
}

//View all products
const loadProducts = async () => {
  for (i in allProducts) {
    const row = allProducts[i];
    if (row.category == "Overige producten") {
      row.category = "overig";
    }
    await loadCategory(row);
  }

  const addProductBtn = $(".addProduct");
  addProductBtn.removeClass("hiding");
}

const loadCategory = async (row) => {
  const dom = $("#" + row.category);
  for (i in row.products) {
    const product = row.products[i];
    const view = await loadProduct(product);
    dom.append(view);
  }
}

const loadProduct = async (product) => {
  await updateUser();
  const template = $(loadSingleProductItem(product));
  const buyBtn = template.find(".BuyNow");
  const titleBtn = template.find(".productTitle");
  const midCol = template.find(".midCol");

  buyBtn.on("click", function () {
    if (checkLogin()) {
      buyProduct(product);
    } else {
      location.href = "/login";
    }
  });

  titleBtn.on("click", function () {
    productDetails(product);
  });

  const hasSub = hasProductSubscription(product);
  if (hasSub) {
    midCol.append(`<img height="15px"src="./static/check.png">`)
    buyBtn.addClass("disabled");
  }

  if (roleCheck()) {
    addAdminIcons(template, product._id);
  }

  return template;
}

const addAdminIcons = (template, productId) => {
  const icons = template.find(".icons");
  for (let i = 0; i < icons.length; i++) {
    const icon = $(icons[i]);
    icon.removeClass("hiding");

    if (icon.hasClass("editProduct")) {
      icon.on("click", function () {
        editProduct(productId);
      });
    } else if (icon.hasClass("removeProduct")) {
      icon.on("click", function () {
        removeProduct(productId);
      });
    } else if (icon.hasClass("addPeople")) {
      icon.on("click", function () {
        addPeople(productId);
      });
    }
  }
}

const hasProductSubscription = (product) => {
  for (i in user.subscriptions) {
    let subscription = user.subscriptions[i];
    if (subscription.description == product.productName) {
      return true;
    }
  }
  return false;
}

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

async function loadSingleProduct(product, category) {
  let price = product.price.replace(".", ",");
  loadProductItem(product, price, category);
}

async function reloadProducts() {
  $("#stripcards").empty();
  $("#subscriptions").empty();
  $("#otherProducts").empty();
  loadProducts();
}

function loadProductItem(product, price, category) {
  let html = loadSingleProductItem(product, price, category);

  $(html).appendTo("#" + category);
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
    console.log("is admin")
    // Add tooltips on icons
    createToolTip($(".editProduct"), "Wijzigen van product", "top");
    createToolTip($(".removeProduct"), "Verwijderen van product", "top");
    createToolTip($(".addPeople"), "Geef product cadeau", "top");
    $('[data-toggle="tooltip"]').tooltip();

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

// Edit a product as Admin
async function editProduct(productId) {
  try {
    let res = await ApiCaller.getSingleProduct(productId); // Get all the infomation from the product
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
          "description": $("#productDescription").val(),
          "amountOfHours": $("#productHours").val(),
          "toSchedule": $("#toschedule").is(":checked"),
          "validFor": $("#productValid").val()
        }
        try {
          let resUpdate = await ApiCaller.updateProduct(jsonData, productId);
          let resJson = await resUpdate.json();
          if (resUpdate.status == 200) {
            toastPopUp("Product " + $("#productName").val() + " is gewijzigd!", "success");
            reloadProducts();
          } else {
            toastPopUp("Er is iets misgegaan", "error");
          }
        } catch (err) {
          console.log(err);
        }

      } else {

      }
    });

    $("#productName").val(json.productName);
    $("#productDescription").val(json.description);
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

function addPeople(productId) {
  swalItemGiftUser();
  $(".userItem").empty();
  loopAndAddElements(filterData(""), productId);
  $("#searchUser").on("input", function () {
    let userArray = filterData($(this).val());

    if (userArray.length <= 0) {
      $(".userItem").empty();
      $(".userItem").append("<h4 class='lead'>Geen resultaat</h4>")
    } else {
      $(".userItem").empty();
      loopAndAddElements(userArray, productId);
    }
  });
}

function loopAndAddElements(userArray, productId) {
  for (item in userArray) {
    $(".userItem").append(createUserItem(userArray[item].fullName, userArray[item].email, userArray[item].phoneNumber, userArray[item].id));
    $('[data-toggle="tooltip"]').tooltip();
    $("#" + userArray[item].id).on("click", function () {
      let data = {
        "userId": $(this).attr("id")
      };
      giftProduct(data, productId);
      $('[data-toggle="tooltip"]').tooltip('hide');
    });
  }
}

async function giftProduct(data, productId) {
  try {
    let res = await ApiCaller.giftProduct(data, productId);
    let json = await res.json();
    if (res.status == 200) {
      location.href = json.purchaseInfo.checkOutUrl;
    } else {
      toastPopUp(json.message, "error");
    }
  } catch (err) {
  }
}

async function giftProductAsUser(data, productId) {
  try {
    let res = await ApiCaller.giftProduct(data, productId);
    let json = await res.json();
    if (res.status == 200) {
      // Redirects to mollie.
      location.href = json.redirectUrl;
    } else {
      toastPopUp("Er is iets misgegaan", "error");
    }
  } catch (err) {
  }
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
  });

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
      "description": $("#productDescription").val(),
      "amountOfHours": $("#productHours").val(),
      "toSchedule": false,
      "validFor": $("#productValid").val()
    }
  } else {
    json = {
      "category": category,
      "productName": $("#productName").val(),
      "price": $("#productPrice").val(),
      "description": $("#productDescription").val(),
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
  console.log(product);
  const id = product._id;

  const options = {
    html: html1,
    icon: "warning",
    customClass: {
      html: 'sweetalert-subscribe',
      denyButton: 'giftButton',
      cancelButton: 'cancelButton'
    },
    showCancelButton: true,
    confirmButtonText: 'Abonnement afsluiten',
    confirmButtonColor: '#D5CA9B',
    cancelButtonText: 'Cancel'
  };

  if (product.category != "Abonnementen") {
    options.icon = null;
    options.denyButton = 'giftButton';
    options.denyButtonText = '<i class="bi bi-gift"></i> &nbsp; Doe product cadeau';
    options.confirmButtonText = 'Product kopen';
    options.showDenyButton = true;
  }

  Swal.fire(options)
    .then(async (result) => {
      if (result.isConfirmed) {
        buyAProduct(user.id, id);
      } else if (result.isDenied) {
        Swal.fire({
          html: html2,
          customClass: 'sweetalert-gift',
          showCancelButton: true,
          confirmButtonText: 'Stuur cadeau',
          confirmButtonColor: '#D5CA9B',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            let tempdata = {
              "userId": user.userId,
              "email": $("#giftEmail").val()
            }
            giftProductAsUser(tempdata, id);
          }
        });
      }
    });
}

async function buyAProduct(data, productId) {
  try {
    data = { userId: data };
    let res = await ApiCaller.buyUserProduct(data, productId);
    let json = await res.json();
    if (res.status == 200) {
      // Redirects to mollie.
      location.href = json.purchaseInfo.checkOutUrl;
    } else {
      toastPopUp(json.purchaseInfo.message, "error");
    }
  } catch (err) {
  }
}




