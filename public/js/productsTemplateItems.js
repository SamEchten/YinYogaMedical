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
        <button id="Abonnementen" class="btn btn-primary yinStyle categoryButton">Abonnementen</button>
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
        <input id="Name" class="swal2-input" type="email">
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

function loadSingleProductItem(id, productName, price, validFor){
  let date = new Date();
  date.setFullYear(date.getFullYear() + validFor);
  let template = `
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
  return template;
}

function swalBuyProductCheck(product){
  let template = `
  <h2>Product kopen</h2>
  <hr>
  <p>U wilt u het product <b>${product}</b> kopen. Klopt dit?</p>`
  return template;
}