function swalProductDetails(data){
  const currentdate = new Date();
  currentdate.setFullYear(currentdate.getFullYear() + data.validFor);
  let template = '';
  if (data.amountOfHours){
    template = `
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
    </div>`
  } else {
    template = `
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
        <div class="col-md-5">
          <h3 class="lbs">Geldig tot</h3>
          <p>${dateFormat(currentdate).date}<p>
        </div>
      </div>
    </div>`
  }
  
  return template;
}

function swalItemGiftUser() {
  Swal.fire({
    html: `
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="row">
                <div class="col-md-12">
                  <h2>Product cadeau doen</h2>
                  <hr>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <p>Zoek naar een gebruiker en klik vervolgens op het product cadeau doen.</p>
                </div>
              </div>
              <div class="row align-items-center">
                <div class="col-md-12 pb-3 p-0">
                  <input type="text" class="form-control inputStyle" id="searchUser" placeholder="Zoeken..">
                </div>
              </div>
              <div class="row userItemsRow">
                <div class="col-md userItem">
                  <h4 class='lead'>Zoek naar een gebruiker</h4>
                </div>
              </div>
            </div>  
          </div>
        </div> 
        `,
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: 'Terug'
  });
}

// Create userItem element in side add user to session
function createUserItem(fullName, email, phoneNumber, id) {
  let element = `
  <div class="row pb-2 slide-in-blurred-top">
    <div class="col-md-10 p-2 lead userFilterItem text-start">
      <h4><i class="bi bi-person pe-2"></i> ${fullName}</h4>
      <p class="p-1">
      <i class="bi bi-envelope pe-3"></i> ${email} <br>
      <i class="bi bi-telephone pe-3"></i> ${phoneNumber}<br>
      </p>
    </div>
    <div class="col-md-2">
      <div class="row h-100 align-items-center">
        <div class="col-md-12 cursor giftFreeSession">
          <i id=${id} class="bi bi-gift gift" data-toggle="tooltip" data-placement="top" title="Geef product cadeau"></i>
        </div>
      </div>
      
      
    </div>
  </div>`

  return element;
}

function swalItemAddProductCategory(){
  let template = `
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <button id="Strippenkaarten" class="btn btn-primary yinStyle categoryButton">Strippenkaarten</button>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <button id="Overige producten" class="btn btn-primary yinStyle categoryButton">Overige producten</button>
      </div>
    </div>
  </div>
  `;
  return template;
}

function swalGiftProduct() {
  let template = `
  <div class="container">
    <div class="row">
      <div class="col-md-12 text-start">
        <h2>Gegevens ontvanger</h2>
        <hr>
        <p>Vul hieronder de gegevens van de ontvanger in.</p>
        <h3 class="lead lbs"><b>Volledige naam:</b></h3>
        <input id="Name" class="swal2-input" type="text">
        <h3 class="lead lbs"><b>E-mailadres:</b></h3>
        <input id="giftEmail" class="swal2-input" type="email">
      </div>
    </div>
  </div>`;

  return template;
}

// Edit a product ->
function swalItemEditProduct(category){
  let template = '';
  if (category == "Strippenkaarten"){
     template = `
    <h2>Wijzig strippenkaart</h2>
    <hr>
    <div class="row width">
      <div class="col-md-6">
        <h3 class="lead lbs"><b>Productnaam:</b></h3>
        <input id="productName" class="swal2-input" type="text" placeholder="Productnaam">
        <h3 class="lead lbs"><b>Beschrijving:</b></h3>
        <textarea id="productDescription" class="swal2-input" placeholder="Productbeschrijving"></textarea>
        <h3 class="lead lbs"><b>Aantal jaar geldig:</b></h3>
        <input id="productValid" class="swal2-input half" type="number" step="1" min="1" value="1">
      </div>
      <div class="col-md-6">
        <h3 class="lead lbs"><b>Prijs:</b></h3>
        <input id="productPrice" class="swal2-input half" type="number" step="1" min="1" value="1">
        <h3 class="lead lbs"><b>Aantal uur:</b></h3>
        <p class="subtext">Aantal uren op het product.</p>
        <input id="productHours" class="swal2-input half" type="number" step="0.5" min="0.5" value="0.5">
      </div>
      <div class="alert alert-warning errorBox" role="alert"></div>
    </div>`;
  } else if(category == "Abonnementen") {
    template = `
    <h2>Wijzig abonnement</h2>
    <hr>
    <div class="row width">
      <div class="col-md-6">
        <h3 class="lead lbs"><b>Productnaam:</b></h3>
        <input id="productName" class="swal2-input" type="text" placeholder="Productnaam">
        <h3 class="lead lbs"><b>Beschrijving:</b></h3>
        <textarea id="productDescription" class="swal2-input" placeholder="Productbeschrijving"></textarea>
        </div>
      <div class="col-md-6">
        <h3 class="lead lbs"><b>Prijs:</b></h3>
        <input id="productPrice" class="swal2-input half" type="number" step="1" min="1" value="1">
        <h3 class="lead lbs"><b>Aantal jaar geldig:</b></h3>
        <input id="productValid" class="swal2-input half" type="number" step="1" min="1" value="1">
      </div>
      <div class="alert alert-warning errorBox" role="alert"></div>
    </div>`;
  } else {
    template = `
    <h2>Wijzig product</h2>
    <hr>
    <div class="row width">
      <div class="col-md-6">
        <h3 class="lead lbs"><b>Productnaam:</b></h3>
        <input id="productName" class="swal2-input" type="text" placeholder="Productnaam">
        <h3 class="lead lbs"><b>Beschrijving:</b></h3>
        <textarea id="productDescription" class="swal2-input" placeholder="Productbeschrijving"></textarea>
        <h3 class="lead lbs"><b>Aantal jaar geldig:</b></h3>
        <input id="productValid" class="swal2-input half" type="number" step="1" min="1" value="1">
      </div>
      <div class="col-md-6">
        <h3 class="lead lbs"><b>Prijs:</b></h3>
        <input id="productPrice" class="swal2-input half" type="number" step="1" min="1" value="1">
        <h3 class="lead lbs"><b>Inplannen:</b></h3>
        <div class="row">
          <div class="col-md-12 text-start">
            <input id="toschedule" type="checkbox" name="plan" onclick="checkToSchedule()"/>
            <label for="plan" class="subtext">Dit product moet worden ingepland.</label>
          </div>
        </div>
      </div>
      <div class="alert alert-warning errorBox" role="alert"></div>
    </div>`;
  }
   
  return template;
}

// Add a product ->
function swalItemAddProduct(category){
  let template = '';
  if (category == "Strippenkaarten"){
     template = `
    <h2>Voeg nieuwe strippenkaart toe</h2>
    <hr>
    <div class="row width">
      <div class="col-md-6">
        <h3 class="lead lbs"><b>Productnaam:</b></h3>
        <input id="productName" class="swal2-input" type="text" placeholder="Productnaam">
        <h3 class="lead lbs"><b>Beschrijving:</b></h3>
        <textarea id="productDescription" class="swal2-input" placeholder="Productbeschrijving"></textarea>
        <h3 class="lead lbs"><b>Aantal jaar geldig:</b></h3>
        <input id="productValid" class="swal2-input half" type="number" step="1" min="1" value="1">
      </div>
      <div class="col-md-6">
        <h3 class="lead lbs"><b>Prijs:</b></h3>
        <input id="productPrice" class="swal2-input half" type="number" step="1" min="1" value="1">
        <h3 class="lead lbs"><b>Aantal uur:</b></h3>
        <p class="subtext">Aantal uren op het product.</p>
        <input id="productHours" class="swal2-input half" type="number" step="0.5" min="0.5" value="0.5">
      </div>
      <div class="alert alert-warning errorBox" role="alert"></div>
    </div>`;
  } else if(category == "Abonnementen") {
    template = `
    <h2>Voeg nieuw abonnement toe</h2>
    <hr>
    <div class="row width">
      <div class="col-md-6">
        <h3 class="lead lbs"><b>Productnaam:</b></h3>
        <input id="productName" class="swal2-input" type="text" placeholder="Productnaam">
        <h3 class="lead lbs"><b>Beschrijving:</b></h3>
        <textarea id="productDescription" class="swal2-input" placeholder="Productbeschrijving"></textarea>
        </div>
      <div class="col-md-6">
        <h3 class="lead lbs"><b>Prijs:</b></h3>
        <input id="productPrice" class="swal2-input half" type="number" step="1" min="1" value="1">
        <h3 class="lead lbs"><b>Aantal jaar geldig:</b></h3>
        <input id="productValid" class="swal2-input half" type="number" step="1" min="1" value="1">
      </div>
      <div class="alert alert-warning errorBox" role="alert"></div>
    </div>`;
  } else {
    template = `
    <h2>Voeg nieuw product toe</h2>
    <hr>
    <div class="row width">
      <div class="col-md-6">
        <h3 class="lead lbs"><b>Productnaam:</b></h3>
        <input id="productName" class="swal2-input" type="text" placeholder="Productnaam">
        <h3 class="lead lbs"><b>Beschrijving:</b></h3>
        <textarea id="productDescription" class="swal2-input" placeholder="Productbeschrijving"></textarea>
        <h3 class="lead lbs"><b>Aantal jaar geldig:</b></h3>
        <input id="productValid" class="swal2-input half" type="number" step="1" min="1" value="1">
      </div>
      <div class="col-md-6">
        <h3 class="lead lbs"><b>Prijs:</b></h3>
        <input id="productPrice" class="swal2-input half" type="number" step="1" min="1" value="1">
        <h3 class="lead lbs"><b>Inplannen:</b></h3>
        <div class="row">
          <div class="col-md-12 text-start">
            <input id="toschedule" type="checkbox" name="plan" onclick="checkToSchedule()"/>
            <label for="plan" class="subtext">Dit product moet worden ingepland.</label>
          </div>
        </div>
      </div>
      <div class="alert alert-warning errorBox" role="alert"></div>
    </div>`;
  }
   
  return template;
}

function loadSingleProductItem(id, productName, price, validFor, category){
  let date = new Date();
  date.setFullYear(date.getFullYear() + validFor);
  console.log(category);
  let template = '';
  if(category == "subscriptions"){
    template = `
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
          <div class="col-md-4 col-2 text-md-end text-start">
            <i class="bi bi-pencil hiding editProduct icons"></i>
          </div>
          <div class="col-md-4 col-2 text-md-end text-start"></div>
          <div class="col-md-4 col-8 text-md-end text-start">
            <i class="bi bi-person-check hiding addPeople icons"></i>
          </div>
        </div>
      </div>
      <div class="col-md text-end">
        <button type="submit" class="btn btn-primary yinStyle BuyNow">+ Koop nu</button>
      </div>
    </div>`
  } else {
    template = `
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
          <div class="col-md-4 col-2 text-md-end text-start">
            <i class="bi bi-pencil hiding editProduct icons"></i>
          </div>
          <div class="col-md-4 col-2 text-md-end text-start">
            <i class="bi bi-trash3 hiding removeProduct icons"></i>
          </div>
          <div class="col-md-4 col-8 text-md-end text-start">
          <i class="bi bi-person-check hiding addPeople icons"></i>
          </div>
        </div>
      </div>
      <div class="col-md text-end">
        <button type="submit" class="btn btn-primary yinStyle BuyNow">+ Koop nu</button>
      </div>
    </div>`
  }
  return template;
}

function swalBuyProductCheck(product){
  let template = `
  <h2>Product kopen</h2>
  <hr>
  <p>U wilt u het product <b>${product}</b> kopen. Klopt dit?</p>`
  return template;
}