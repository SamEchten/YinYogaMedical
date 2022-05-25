
// // Show all details per session ->
// function sessionDetails(data) {
//   Swal.fire(
//     {
//       html: `
//       <div class="alerttitle">
//         <h2>${data.title}<h2>
//         <hr/>
//       </div>
//       <div class="test">
//         <div class="row width">
//           <div class="col-md-7">          
//             <h3 class="lbs">Beschrijving</h3>
//             <p>${data.description}<p>
//           </div>
//           <div class="col-md-5">
//             <h3 class="lbs">Datum</h3> 
//             <p>${dateFormat(data.date).date}</p>
//           </div>
//         </div>
//         <div class="row width">
//           <div class="col-md-7">
//             <h3 class="lbs">Locatie</h3>
//             <p>${data.location}</p>
//           </div>
//           <div class="col-md-5">
//             <h3 class="lbs">Starttijd</h3>
//             <p>${dateFormat(data.date).time}<p>
//           </div>
//         </div>
//         <div class="row width">
//           <div class="col-md-7">
//             <h3 class="lbs">Docent</h3>
//             <p><i class="bi bi-person-circle icon"></i>${data.teacher}<p>
//           </div>
//           <div class="col-md-5">
//             <h3 class="lbs">Eindtijd</h3> 
//             <p>${dateFormat(addMinutes(new Date(data.date), data.duration)).time}</p>
//           </div>
//         </div>
//       </div>`,
//       customClass: 'sweetalert-seelesson',
//       confirmButtonColor: '#D5CA9B',
//       confirmButtonText: 'OK'
//     });
// }

$(async function () {
  const res = await (await ApiCaller.getAllSessions()).json();
  loadProducts();
});

// Loading product data  ->
async function loadProducts() {
  const res = await (await ApiCaller.getAllProducts()).json();
  for(r in res){
    let price = parseInt(res[r].price).toFixed(2).replace(".", ",");
    loadProductItem(res[r].id, res[r].productName, price);
  }
  showOrhideElements();
  clickEvents();
}

function loadProductItem(id, productName, price) {
  let itemLayout = `
    <div id="${id}" class="row ps-4 p-2 productItem align-items-center">
      <div class="col-md-8">
        <h4 id="title" class="text-left lead fw-bold productTitle">${productName}</h4>
        <p id="subtitle" class="productSubtitle">Geldig tot 09/05/2023</p>
      </div>
      <div class="col-md text-end">
        <h4 id="price" class="text-left lead fw-bold productPrice">€${price}</h4>
      </div>
      <div class="col-md-1">
        <div class="row">
          <div class="col-md-8 text-end">
            <i class="bi bi-pencil hiding editProduct icons"></i>
          </div>
          <div class="col-md-4 text-end">
            <i class="bi bi-trash3 hiding removeProduct icons"></i>
          </div>
        </div>
      </div>
      <div class="col-md text-end">
        <button type="submit" class="btn btn-primary yinStyle" onclick="buyProduct()" id="BuyNow">+ Koop nu</button>
      </div>
    </div>`

  $(itemLayout).appendTo("#category");
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
      // const sessionId = $(this).parent().parent().attr("id");
      // removeSession(sessionId);
      console.log("REMOVE PRODUCT");
    });
    $(".BuyNow").on("click", function () {
      // const sessionId = $(this).parent().parent().attr("id");
      // console.log(sessionId, user.userId);
      console.log("BUY PRODUCT");
      // subscribe functon with @id and @userId
    });
  }
}

// Remove a product as Admin
async function removeProduct(productId) {
  Swal.fire({
    title: 'Weet u zeker dat u dit product wilt verwijderen?',
    showCancelButton: true,
    confirmButtonColor: '#D5CA9B',
    confirmButtonText: 'Annuleer',
  }).then(async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      try {
        let res = await ApiCaller.removeProduct(productId);
        if (res.status == 200) {
          loadProducts();
        }
        Swal.fire({
          title: "Product verwijderd!",
          icon: 'success',
          showCloseButton: true,
          confirmButtonColor: '#D5CA9B'
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
      </div>
      <div class="col-md-6">
        <h3 class="lead"><b>Prijs:</b></h3>
        <p class="subtext">De prijs van het product.</p>
        <input id="productPrice" class="swal2-input half" type="number" step="0.5" min="0.5" value="0.5">
        <h3 class="lead"><b>Aantal uur:</b></h3>
        <p class="subtext">Aantal uren op het product.</p>
        <input id="productHours" class="swal2-input half" type="number" step="0.5" min="0.5" value="0.5">
      </div>
      <div class="alert alert-warning errorBox" role="alert"></div>
    </div>`,
    customClass: 'sweetalert-makeProduct',
    showCancelButton: true,
    confirmButtonText: 'Voeg les toe',
    confirmButtonColor: '#D5CA9B',
    closeOnConfirm: false,
    cancelButtonText: 'Cancel',
  });
});

// Add session call ->
async function addProduct() {
  let json = {
    "productName": $("#productName").val(),
    "price": $("#productPrice").val(),
    "discription": $("#productDescription").val(),
    "amountOfHours": $("#productHours").val()
  }
  try {
    let res = await ApiCaller.addProduct(json);
    let json = await res.json();
    console.log(json)
    if (res.status == 201) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
}

// TODO: Laat product zien welke gekocht wordt.
function buyProduct() {
  Swal.fire({
    html: `
    <h2>Product kopen</h2>
    <hr>
    <p>U wilt u het product (product) kopen. Klopt dit?</p>`,
    customClass: 'sweetalert-subscribe',
    showCancelButton: true,
    confirmButtonText: 'Koop product',
    confirmButtonColor: '#D5CA9B',
    cancelButtonText: 'Cancel',
  });
}




