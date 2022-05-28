
// Show all details per session ->
function productDetails(data) {
  const currentdate = new Date();
  currentdate.setFullYear(currentdate.getFullYear() + data.validFor);

  Swal.fire(
    {
      html: `
      <div class="alerttitle">
        <h2>${data.productName}<h2>
        <hr/>
      </div>
      <div class="test">
        <div class="row width">
          <div class="col-md-7">          
            <h3 class="lbs">Beschrijving</h3>
            <p>${data.discription}<p>
          </div>
          <div class="col-md-5">
            <h3 class="lbs">Prijs</h3> 
            <p>€${data.price},-</p>
          </div>
        </div>
        <div class="row width">
          <div class="col-md-7">
            <h3 class="lbs">Aantal uur</h3>
            <p>${data.amountOfHours}</p>
          </div>
          <div class="col-md-5">
            <h3 class="lbs">Geldig tot</h3>
            <p>${dateFormat(currentdate).date}<p>
          </div>
        </div>
      </div>`,
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
    let price = parseInt(res[r].price).toFixed(2).replace(".", ",");
    loadProductItem(res[r]._id, res[r].productName, price, res[r].validFor);
  }
  addEventHandlersSession();
  showOrhideElements();
  clickEvents();
}

async function reloadProducts() {
  $("#category").empty();
  const res = await (await ApiCaller.getAllProducts()).json();
  for (r in res) {
    let price = parseInt(res[r].price).toFixed(2).replace(".", ",");
    loadProductItem(res[r]._id, res[r].productName, price, res[r].validFor);
  }
  addEventHandlersSession();
  showOrhideElements();
  clickEvents();
}

function loadProductItem(id, productName, price, validFor) {
  let date = new Date();
  date.setFullYear(date.getFullYear() + validFor);
  let itemLayout = `
    <div id="${id}" class="row productItem align-items-center">
      <div class="col-md-8 productnameTitle" id="productNameText">
        <h4 id="title" class="text-left lead fw-bold productTitle">${productName}</h4>
        <p id="subtitle" class="productSubtitle">Geldig tot ${dateFormat(date).date}</p>
      </div>
      <div class="col-md text-md-end">
        <h4 id="price" class="lead fw-bold productPrice">€${price}</h4>
      </div>
      <div class="col-md-1">
        <div class="row">
          <div class="col-md-8 col-2 text-md-end text-start">
            <i class="bi bi-pencil hiding editProduct icons"></i>
          </div>
          <div class="col-md-4 col-10 text-md-end text-start">
            <i class="bi bi-trash3 hiding removeProduct icons"></i>
          </div>
        </div>
      </div>
      <div class="col-md text-end">
        <button type="submit" class="btn btn-primary yinStyle BuyNow">+ Koop nu</button>
      </div>
    </div>`

  $(itemLayout).appendTo("#category");
}

function addEventHandlersSession() {
  $(".productnameTitle").on("click", async function () {
    try {
      const id = $(this).parent().attr('id');
      console.log(id)
      const res = await ApiCaller.getSingleProduct(id);
      const json = await res.json();
      console.log(json)
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
      console.log("EDIT PRODUCT");
    });
    // Remove a session ->
    $(".removeProduct").on("click", function () {
      const productId = $(this).parent().parent().parent().parent().attr("id");
      removeProduct(productId);
    });
    $(".BuyNow").on("click", function () {
      let product = $(this).parent().parent().children("#productNameText").children("h4").text();
      let id = $(this).parent().parent().attr("id");
      buyProduct(product, id);
    });
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
        }
        Swal.fire({
          title: "Product verwijderd!",
          icon: 'success',
          showCloseButton: false,
          showConfirmButton: false,
          timer: 1000
        });
      } catch (err) {
        console.log(err)
      }
    }
  });
}

$(".addProduct").on("click", async function () {
  let error = false;
  Swal.fire({
    html: `
    <h2>Voeg nieuw product toe</h2>
    <hr>
    <div class="row width">
      <div class="col-md-6">
        <h3 class="lead"><b>Productnaam:</b></h3>
        <input id="productName" class="swal2-input" type="text" placeholder="Productnaam">
        <h3 class="lead"><b>Beschrijving:</b></h3>
        <textarea id="productDescription" class="swal2-input" placeholder="Productbeschrijving"></textarea>
        <h3 class="lead"><b>Aantal jaar geldig:</b></h3>
        <input id="productValid" class="swal2-input half" type="number" step="1" min="1" value="1">
      </div>
      <div class="col-md-6">
        <h3 class="lead"><b>Prijs:</b></h3>
        <p class="subtext">De prijs van het product.</p>
        <input id="productPrice" class="swal2-input half" type="number" step="1" min="1" value="1">
        <h3 class="lead"><b>Aantal uur:</b></h3>
        <p class="subtext">Aantal uren op het product.</p>
        <input id="productHours" class="swal2-input half" type="number" step="0.5" min="0.5" value="0.5">
      </div>
      <div class="alert alert-warning errorBox" role="alert"></div>
    </div>`,
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
  }).then((result) => {
    if (result.isConfirmed) {
      if (error) {
        Swal.fire({
          title: "Product aangemaakt!",
          icon: 'success',
          showCloseButton: false,
          showConfirmButton: false,
          timer: 1000
        });
      } else {
        Swal.fire({
          title: "Velden niet correct ingevuld",
          icon: 'warning',
          showCloseButton: true,
          confirmButtonColor: '#D5CA9B'
        });
      }
    }
  });
});

// Add product call ->
async function addProduct() {
  let json = {
    "productName": $("#productName").val(),
    "price": $("#productPrice").val(),
    "discription": $("#productDescription").val(),
    "amountOfHours": $("#productHours").val(),
    "toSchedule": false,
    "validFor": $("#productValid").val()
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
function buyProduct(product, id) {

  // if () {
    Swal.fire({
      html: `
      <h2>Product kopen</h2>
      <hr>
      <p>U wilt u het product <b>${product}</b> kopen. Klopt dit?</p>`,
      customClass: 'sweetalert-subscribe',
      showCancelButton: true,
      confirmButtonText: 'Koop product',
      confirmButtonColor: '#D5CA9B',
      cancelButtonText: 'Cancel',
    })
      // .then(async (result) => {
      //       if (result.isConfirmed)
      //       {
      //         let sessionId = $(this).parent().parent().attr("id");
      //         let jsonData = {
      //           "userId": user.userId,
      //           "comingWith": sessionUserObject()
      //         }
      //         console.log(sessionId)
      //         console.log(jsonData)
      //         try
      //         {
      //           let res = await ApiCaller.addUserToSession(jsonData, sessionId);
      //           let jsonRes = await res.json();
      //           if (res.status == 200)
      //           {
      //             Swal.fire({
      //               title: `U heeft zich ingeschreven voor ${lesson} .`,
      //               icon: 'success',
      //               text: `Wat leuk dat u zich hebt ingeschreven voor ${lesson}! Tot snel! `,
      //               showCloseButton: true,
      //               confirmButtonColor: '#D5CA9B'
      //             });
      //           } else
      //           {
      //             Swal.fire({
      //               title: `Oops!`,
      //               icon: 'warning',
      //               text: jsonRes.message,
      //               showCloseButton: true,
      //               confirmButtonColor: '#D5CA9B'
      //             });
      //           }
      //         } catch (err)
      //         {
      //           console.log(err);
      //         }
      //       }
      //     })
      ;
  // } else {

  // }
}




