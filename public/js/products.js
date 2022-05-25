
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

function loadProductItem(id, productName, price) {
  let itemLayout = `
    <div id="${id}" class="row ps-4 p-2 productItem align-items-center">
      <div class="col-md-8">
        <h4 id="title" class="text-left lead fw-bold productTitle">Mantelzorgers strippenkaart</h4>
        <p id="subtitle" class="productSubtitle">Geldig tot 09/05/2023</p>
      </div>
      <div class="col-md text-end ">
        <h4 id="price" class="text-left lead fw-bold productPrice">€100,-</h4>
      </div>
      <div class="col-md text-end">
        <button type="submit" class="btn btn-primary yinStyle" onclick="buyProduct()" id="BuyNow">+ Koop nu</button>
      </div>
      <div class="col-md-1 text-end">
        <i class="bi bi-pencil hiding editSession icons"></i>
        <i class="bi bi-trash3 hiding removeSession icons"></i>
      </div>
    </div>`

  $(itemLayout).appendTo("#category");
  addEventHandlersSession();
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

// Remove a session as Admin
  // async function removeSession(sessionId) {
  //   Swal.fire({
  //     title: 'Weet u zeker dat u deze les wilt annuleren?',
  //     showCancelButton: true,
  //     confirmButtonColor: '#D5CA9B',
  //     confirmButtonText: 'Annuleer',
  //   }).then(async (result) => {
  //     /* Read more about isConfirmed, isDenied below */
  //     if (result.isConfirmed) {
  //       try {
  //         let res = await ApiCaller.removeSession(sessionId);
  //         if (res.status == 200) {
  //           loadAndSetFullAgenda();
  //         }
  //         Swal.fire({
  //           title: "Les geannuleerd!",
  //           icon: 'success',
  //           showCloseButton: true,
  //           confirmButtonColor: '#D5CA9B'
  //         });
  //       } catch (err) {
  //         console.log(err)
  //       }
  //     }
  //   });
  // }

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
        <div class="row width">
          <div class="col-md-6">
            <h3 class="lead"><b>Prijs:</b></h3>
            <p class="subtext">De prijs van het product.</p>
            <input id="productPrice" class="swal2-input half" type="number" step="0.5" min="0.5" value="0.5">
          </div>
          <div class="col-md-6">
            <h3 class="lead"><b>Aantal uur:</b></h3>
            <p class="subtext">Aantal uren op het product.</p>
            <input id="productHours" class="swal2-input half" type="number" step="0.5" min="0.5" value="0.5">
          </div>
        </div>
      </div>
      <div class="col-md-6 text-start">
        <h3 class="lead"><b>Categorie:</b></h3>
        <p class="radiobutton">
          <input id="strippenkaarten" type="radio" name="category" checked="true" value="Strippenkaarten">
          Strippenkaarten
        </p>
        <p class="radiobutton">
          <input id="cadeaubonnen" type="radio" name="category" value="Cadeaubonnen">
          Cadeaubonnen
        </p>
        <p class="radiobutton">
          <input id="abonnementen" type="radio" name="category" value="Abonnementen">
          Abonnementen
        </p>
        <h3 class="lead"><b>Hiermee te kopen:</b></h3>
        <p class="radiobutton">
          <input id="lessen" type="checkbox" name="buywith" value="Lessen">
          Lessen
        </p>
        <p class="radiobutton">
          <input id="massages" type="checkbox" name="buywith" value="Massages">
          Massages
        </p>
        <p class="radiobutton">
          <input id="videos" type="checkbox" name="buywith" value="Video's">
          Video's
        </p>
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




