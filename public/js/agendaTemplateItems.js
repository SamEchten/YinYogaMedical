// !!!! PLEASE ONLY WRITE HTML AND SWAL POP UP IN THIS FILE !!!!
// !!!! PLEASE ONLY WRITE HTML AND SWAL POP UP IN THIS FILE !!!!
// !!!! PLEASE ONLY WRITE HTML AND SWAL POP UP IN THIS FILE !!!!

// Container for adding/removing a user to a session as admin ->
function swalItemAddUser() {
  Swal.fire({
    html: `
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="row">
                <div class="col-md-12">
                  <h2>Gebruiker toevoegen</h2>
                  <hr>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <p>Zoek naar een gebruiker en klik vervolgens op toevoegen aan les.</p>
                </div>
              </div>
              <div class="row align-items-center">
                <div class="col-md-12 pb-3 p-0">
                  <input type="text" class="form-control inputStyle" id="searchUser" placeholder="Zoeken..">
                </div>
              </div>
              <div class="row userItemsRow">
                <div class="col-md userItemCol">
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

// Edit a session as admin and update the items ->
function swalItemEditSession() {
  let template = `
    <div class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <h2>Wijzig les</h2>
            <hr>
          </div>
        </div>
      <div class="row">
        <div class="col-md-6">
          <div class="row h-25 pb-4">
            <div class="col-md-12">
              <h3 class="lead lbs"><b>Lesnaam:</b></h3>
              <input id="lessonName" class="form-control" type="text">
            </div>
          </div>
          <div class="row h-25 pb-4">
            <div class="col-md-12">
              <h3 class="lead lbs"><b>Beschrijving:</b></h3>
              <textarea id="lessonDescription" class="form-control"></textarea>
            </div>
          </div>
          <div class="row h-25 pb-4">
            <div class="col-md-12">
              <h3 class="lead lbs"><b>Locatie:</b></h3>
              <input id="lessonLocation" class="form-control" type="text">
            </div>
          </div>
          <div class="row h-25 pb-4">
            <div class="col-md-12">
              <h3 class="lead lbs"><b>Yogadocent:</b></h3>
              <p>
                <input id="lessonTeacher" type="radio" checked="true" value="Natascha Puper">
                Natascha Puper
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="row h-25 pb-4">
            <div class="col-md-12">
              <div class="row">
                <div class="col-md-12">
                  <h3 class="lead lbs"><b>Dag:</b></h3>
                </div>
              </div>
              <div class="row align-items-center pb-5">
                <div class="col-md-12">
                  <input id="lessonDay" class="form-control" type="date">
                </div>
              </div>
            </div>
          </div>
          <div class="row h-25 pb-4">
            <div class="col-md-12">
              <h3 class="lead lbs"><b>Starttijd:</b></h3>
              <input id="lessonTime" class="form-control" type="time">
            </div>
          </div>
          <div class="row h-25 pb-4">
            <div class="col-md-12">
              <h3 class="lead lbs"><b>Duur:</b></h3>
              <input id="lessonDuration" class="form-control" type="number" step="30" min="30">
            </div>
          </div>
          <div class="row h-25 pb-4">
            <div class="col-md-12">
              <h3 class="lead lbs"><b>Aantal deelnemers:</b></h3>
              <input id="maxPeople" class="form-control" type="number" step="1" min="1">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`
  return template;
}

// Add a session to the agenda template ->
function swalItemAddSession() {
  let today = new Date().toISOString().split("T");
  let template = `
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-12">
              <h2>Voeg nieuwe les toe</h2>
              <p>Plan hier uw les, navigeer naar het plus icoontje aan de rechter kant van het datum veld, zo kunt u meerdere lessen tegelijk plannen.</p>
              <hr>
            </div>
          </div>
        <div class="row">
          <div class="col-md-6">
            <div class="row pb-5">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Lesnaam:</b></h3>
                <input id="lessonName" class="form-control inputStyle" placeholder="Lesnaam..." type="text">
              </div>
            </div>
            <div class="row pb-5">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Beschrijving:</b></h3>
                <textarea id="lessonDescription" class="form-control inputStyle" placeholder="Beschrijving..."></textarea>
              </div>
            </div>
            <div class="row pb-5">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Locatie:</b></h3>
                <input id="lessonLocation" class="form-control inputStyle" placeholder="Locatie..." type="text">
              </div>
            </div>
            <div class="row pb-5">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Yogadocent:</b></h3>
                <p>
                  <input id="lessonTeacher" type="radio" checked="true" value="Natascha Puper">
                  Natascha Puper
                </p>
              </div>
            </div>
            <div class="row pb-5">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md  test">
                    <h3 class="lead lbs"><b>Prive les</b></h3>
                    <small id="emailHelp" class="form-text text-muted">Bij het inplannen van een privé les moet u zelf de persoon nog toevoegen aan de les.</small>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md text-start">
                    <input class="form-check-input p-2 lessonPrive" type="checkbox" id="flexCheckDefault">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-12">
                    <h3 class="lead lbs"><b>Dag:</b></h3>
                  </div>
                </div>
                <div class="row align-items-center pb-2">
                  <div class="col-md-10">
                    <input id="lessonDay" value="${today[0]}"class="form-control inputStyle" type="date">
                  </div>
                  <div class="col-md-1">
                    <i class="bi bi-plus-square-dotted addSessionToArray"></i>
                  </div>
                  <div class="col-md-1">
                    
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-8 text-center">
                    <p class="lead">Toegevoegde dagen <i class="bi bi-chevron-down seeAddedSessions"></i></p>
                  </div>
                  <div class="col-md-4 text-center">
                    
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12 allSessionItems text-center">
                  </div>
                </div>
              </div>
            </div>
            <div class="row pb-5">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Starttijd:</b></h3>
                <input id="lessonTime" class="form-control inputStyle" type="time">
              </div>
            </div>
            <div class="row  pb-5">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Duur:</b></h3>
                <input id="lessonDuration" class="form-control inputStyle" placeholder="Lengte van een les..." type="number" step="30" min="30">
              </div>
            </div>
            <div class="row pb-5">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Aantal deelnemers:</b></h3>
                <input id="maxPeople" class="form-control inputStyle" placeholder="Aantal deelnemers..." type="number" step="1" min="1">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="alert alert-warning close errorBox" role="alert">
      </div>
    </div>
      `
  return template;
}

// User subscibes to a session ->

function swalItemSubscribeToSession(lesson) {
  let template = `
    <h2>Inschrijven</h2>
    <hr>
    <p>U wilt u inschrijven voor <b>${lesson}</b>.</p>
    <p><b> Hoeveel personen wilt u inschrijven?</b></p>
    <div class="row width">
      <div class="col-md-12 text-start">
        <input id="nrOfPeople" value="1" class="swal2-input" onchange="nrOfPeopleChanged()" align="left" type="number" min="1">
        <p id="saldoText">Uw saldo is <b id="saldo"></b> uur. Deze les kost <b id="sessionCost"></b> uur.</p>
        <div class="alert alert-primary" role="alert">
          <label for="lname"><i class="bi bi-info-circle pe-2"></i><small>De duur van de les zal worden afgeschreven van uw saldo, ook die van de mensen die u mee neemt.</small></label>
        </div>
      </div>
    </div>
    <p><b id="extraPeopleTitle"></b></p>
    <div id="allInputs">

    </div>`

  return template;
}

//Loading session items for to add to the agenda ->

function templateLoadSession(sessionData) {
  let template =
    `
    <div id="${sessionData.id}" class="row ps-4 p-2 agendaItem swing-in-top-fwd align-items-center">
      <div class="col-md-2">
        <h4 id="time" class="text-left lead fw-bold rbs"><i class="bi bi-clock pe-3"></i>${dateFormat(sessionData.date).time}</h4>
      </div>
      <div class="col-md-2 sessionDetails">
        <h4 id="title" class="text-left lead"><i class="bi bi-info-circle pe-3"></i>${sessionData.title}</h4>
      </div>
      <div class="col-md-2">
        <h4 id="teacher" class="text-left lead "><i class="bi bi-person pe-3"></i>${sessionData.teacher}</h4>
      </div>
      <div class="col-md-4 settings">
        <div class="row adminItems">
          <div class="col-md-3 participantsColor text-start">
            ${sessionData.amountOfParticipants} / ${sessionData.maxAmountOfParticipants}
          </div>
          <div class="col-md-3 participate text-start">
          
          </div>
        </div>       
      </div>
      <div class="col-md-2 subscribeCol text-end ">
        
      </div>
    </div>`

  return template;
}
function templateCanceldSession(sessionData) {
  let template =
    `
    <div id="${sessionData.id}" class="row ps-4 p-2 agendaItem canceled swing-in-top-fwd align-items-center">
      <div class="col-md-2">
        <h4 id="time" class="text-left lead fw-bold rbs"><i class="bi bi-clock pe-3"></i>${dateFormat(sessionData.date).time}</h4>
      </div>
      <div class="col-md-10 text-start sessionDetails">
        <h4 class="m-0">Geannuleerd <h4>
      </div>
           
    </div>
    </div>`

  return template;
}

// Load Session details for when a user clicks on a session info button ->
function templateLoadSessionDetails(data) {
  let template = `
      <div class="alerttitle">
        <h2>${data.title}<h2>
        <hr/>
      </div>
      <div class="test">
        <div class="row width">
          <div class="col-md-7">          
            <h3 class="lbs">Beschrijving</h3>
            <p>${data.description}<p>
          </div>
          <div class="col-md-5">
            <h3 class="lbs">Datum</h3> 
            <p>${dateFormat(data.date).date}</p>
          </div>
        </div>
        <div class="row width">
          <div class="col-md-7">
            <h3 class="lbs">Locatie</h3>
            <p>${data.location}</p>
          </div>
          <div class="col-md-5">
            <h3 class="lbs">Starttijd</h3>
            <p>${dateFormat(data.date).time}<p>
          </div>
        </div>
        <div class="row width">
          <div class="col-md-7">
            <h3 class="lbs">Docent</h3>
            <p><i class="bi bi-person-circle icon"></i>${data.teacher}<p>
          </div>
          <div class="col-md-5">
            <h3 class="lbs">Eindtijd</h3> 
            <p>${dateFormat(addMinutes(new Date(data.date), data.duration)).time}</p>
          </div>
        </div>
        <div class="row w-100 usersPerSessionRow ">
          <h3>Ingeschreven leden <i class="bi bi-chevron-down dropDownUsers"></i><h3>
          <div class="col-md-12 sessionUsers hideScrollbar">

          </div>
        </div>
      </div>`

  return template;
}