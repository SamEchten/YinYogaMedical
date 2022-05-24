let schedule;
let daysOfWeek = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"];
let weekNumb = getCurrentWeekNumber();

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
        <h4 id="title" class="text-left lead fw-bold productTitle">${productName}</h4>
        <p id="subtitle" class="productSubtitle">Geldig tot 09/05/2023</p>
      </div>
      <div class="col-md-2 text-end ">
        <h4 id="price" class="text-left lead fw-bold productPrice">€${price}</h4>
      </div>
      <div class="col-md-2 text-end">
        <button type="submit" class="btn btn-primary yinStyle" onclick="buyProduct()" id="BuyNow">+ Koop nu</button>
      </div>
    </div>`

  $(itemLayout).appendTo("#category");
  addEventHandlersSession();
}

// Add eventlisteners for button that render in after dom has loaded ->
function clickEvents() {
  if (roleCheck()) {
    // Edit a session ->
    $(".editSession").on("click", function () {
      console.log("EDIT PRODUCT");
    });
    // Remove a session ->
    $(".removeSession").on("click", function () {
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

// loading prev and next week ->
$(".prevWeek").on("click", function () {
  weekNumb--;
  if (weekNumb < 1) {
    weekNumb = 52;
    loadAndSetFullAgenda();
  } else {
    loadAndSetFullAgenda();
  }
});

$(".addProduct").on("click", async function () {
  let error = false;
  Swal.fire({
    html: `
    <h2>Voeg nieuw product toe</h2>
    <hr>
    <div class="row width">
      <div class="col-md-6">
        <h3 class="lead"><b>Productnaam:</b></h3>
        <input id="productName" class="swal2-input" type="text">
        <h3 class="lead"><b>Beschrijving:</b></h3>
        <textarea id="productDescription" class="swal2-input"></textarea>
      </div>
      <div class="col-md-6">
        <h3 class="lead"><b>Aantal uur:</b></h3>
        <p class="subtext">Aantal uren op het product.</p>
        <div class="row">
          <div class="col-md-4">
            <input id="lessonTime" class="swal2-input" type="number" step="0.5" min="0.5" placeholder="0,5">
          </div>
        </div>
        <h3 class="lead"><b>Prijs:</b></h3>
        <p class="subtext">De prijs van het product.</p>
        <div class="row">
          <div class="col-md-4">
            <input id="lessonPrice" class="swal2-input" type="number" step="0.5" min="0.5" placeholder="0,5">
          </div>
        </div>
      </div>
      <div class="alert alert-warning errorBox" role="alert"></div>
    </div>`,
    customClass: 'sweetalert-makeProduct',
    showCancelButton: true,
    confirmButtonText: 'Voeg les toe',
    confirmButtonColor: '#D5CA9B',
    closeOnConfirm: false,
    cancelButtonText: 'Cancel',
    preConfirm: async () => {
      let add = await addSession();
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
          showCloseButton: true,
          confirmButtonColor: '#D5CA9B'
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

// Add session call ->
async function addSession() {
  let json = {
    "productName": $("#productName").val(),
    "discription": $("#productDescription").val(),
    "price": $("#productPrice").val(),
    "duration": $("#lessonDuration").val(),
    "participants": [],
    "teacher": "Natascha",
    "description": $("#lessonDescription").val(),
    "maxAmountOfParticipants": $("#maxPeople").val(),
    "weekly": false
  }
  try {
    let res = await ApiCaller.addSession(json);
    console.log(res.status)
    if (res.status == 201) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
}

// TODO: Laat les zien waarvoor er ingeschreven wordt.
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

// Loads inputfields.
function nrOfPeopleChanged() {
  let val = document.getElementById('nrOfPeople').value;
  let title = document.getElementById('extraPeopleTitle');
  let temporary = '';
  if (val > 1) {
    for (let i = 0; i < val - 1; i++) {
      temporary += `
      <div class="row width">
        <div class="col-md-6"><input id='name${val}' class='swal2-input' type='text' placeholder='Naam'></div>
        <div class="col-md-6"><input id='emailaddress${val}' class='swal2-input' type='text' placeholder='E-mailadres'></div> 
      </div>`;
    }
    title.innerHTML = 'Vul hieronder de naam en het e-mailadres in van de personen die u meeneemt.';
    document.getElementById('inputfields').innerHTML = temporary;
  }
  else {
    title.innerHTML = '';
    document.getElementById('inputfields').innerHTML = '';
  }
}

function setWeekData(week) {
  let fDay = getfirstAndlastDatesOfTheWeek(2022, week).firstDay;
  let lDay = getfirstAndlastDatesOfTheWeek(2022, week).lastDay;

  $(".week").html(fDay + " - " + lDay)
}





