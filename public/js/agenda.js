let schedule;
let daysOfWeek = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"];
let weekNumb = getCurrentWeekNumber() - 1;

// Render lesrooster from apiCaller and format it on date ->
//  > Document.getready! first render. 
$(async function () {
  setWeekData(weekNumb);
  const res = await (await ApiCaller.getAllSessions()).json();
  schedule = res;
  loadAgenda(weekNumb);
  scrollDownToCurrDay();
  toastPopUp("Welkom " + user.fullName, "info");

});

// Loading agenda data per week ->
async function loadAgenda(weekNumber) {
  const res = await (await ApiCaller.getAllSessions()).json();
  schedule = res;
  showOrhideElements();
  let week = schedule[weekNumber];
  if (week != undefined) {
    for (day in week) {
      if (week[day].length > 0) {
        let dayData = week[day];
        clearAgenda(day)
        for (session in dayData) {
          let sessionData = dayData[session];
          let { id, title, teacher, maxAmountOfParticipants, amountOfParticipants, date } = sessionData;
          loadSessionItem(id, title, teacher, sessionData.participates, maxAmountOfParticipants, amountOfParticipants, date, day);
          addSubscribedItems(id, sessionData.participates);
        }
      } else {
        clearAgenda(day);
        $("#" + day).append("<h4 class='lead p-3'>Geen lessen</h4>");
      }
    }
  } else {
    fullClear();
  }
  // Loading in all event handlers and other functions that run after the agenda has been FULLY loaded! ->
  showOrhideElements(); // Hiding elements for non admin users ->
  unsubcribeSession(); // loading in event handler for UNSUB button ->
  subscribeToSession();// loading in event handler for SUB button ->
  clickEvents();
}
// Loads agenda items and sets the week dates on top of the agenda ->
function loadAndSetFullAgenda() {
  setWeekData(weekNumb);
  loadAgenda(weekNumb);
}
// scrolls down to the current day in the agenda
function scrollDownToCurrDay() {
  let today = new Date();
  $(".contentRow").animate({
    scrollTop: $(".d" + today.getDay()).offset().top
  }, 1500);
}
// Clear one day
function clearAgenda(day) {
  $("#" + day).empty();
}

// Clear all days
function fullClear() {
  for (day in daysOfWeek) {
    $("#" + daysOfWeek[day]).empty();
    $("#" + daysOfWeek[day]).append("<h4 class='lead p-3'>Geen lessen</h4>")
  }
}

// gets all day of the week and returns it in a array ->
function getAllDaysOfWeek(data) {
  let days = [];
  for (week in schedule) {
    for (day in schedule[week]) {
      if (!days.includes(day)) {
        days.push(day);
      }
    }
  }
  return days;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

//  Check if user is participates in the session and let client see status ->
function addSubscribedItems(id, participates) {
  let subcribeBtn = `<button type="submit" class="btn btn-primary yinStyle subscribe"><i class="bi bi-arrow-bar-right"></i> Inschrijven</button>`;
  let unsubscribeBtn = `<button type="submit" class="btn btn-danger unSubStyle unsubscribe"><i class="bi bi-arrow-bar-left"></i> Uitschrijven</button>`;
  let subCol = $("#" + id).children(".subscribeCol"); // subcribe col per ID, button is being pushed into this column

  if (participates == undefined) {
    subCol.empty();
    subCol.append(subcribeBtn);
  } else {
    subCol.empty();
    subCol.append(unsubscribeBtn)
    //unsubcribeSession();
    let element = $("#" + id).children(".settings").children(".row").children(".participate");
    element.append(`<img height="15px"src="./static/check.png">`);
  }
}

// Show all details per session ->
function sessionDetails(data) {
  Swal.fire(
    {
      html: `
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
      </div>`,
      customClass: 'sweetalert-seelesson',
      confirmButtonColor: '#D5CA9B',
      confirmButtonText: 'OK'
    });
}
// Loads all session items and puts them into the right day ->
function loadSessionItem(id, title, teacher, participates, maxAmountOfParticipants, amountOfParticipants, date, day) {
  let itemLayout = `
    <div id="${id}" class="row ps-4 p-2 agendaItem align-items-center">
      <div class="col-md-2">
        <h4 id="time" class="text-left lead fw-bold rbs"><i class="bi bi-clock pe-3"></i>${dateFormat(date).time}</h4>
      </div>
      <div class="col-md-2 sessionDetails">
        <h4 id="title" class="text-left lead"><i class="bi bi-info-circle pe-3"></i>${title}</h4>
      </div>
      <div class="col-md-2">
        <h4 id="teacher" class="text-left lead "><i class="bi bi-person pe-3"></i>${teacher}</h4>
      </div>
      <div class="col-md-4 settings">
        <div class="row">
          <div class="col-md-3 text-start">
            ${amountOfParticipants} / ${maxAmountOfParticipants}
          </div>
          <div class="col-md-2 text-end">
            <i class="bi bi-pencil hiding editSession"></i>
          </div>
          <div class="col-md-2 text-center">
            <i class="bi bi-x-lg hiding removeSession"></i>
          </div>
          <div class="col-md-2 text-start">
            <i class="bi bi-person-plus hiding addUser"></i>
          </div>
          <div class="col-md-3 participate text-start">
          
          </div>
        </div>       
      </div>
      <div class="col-md-2 subscribeCol text-end ">
        
      </div>
    </div>`

  $(itemLayout).appendTo("#" + day);
  addEventHandlersSession();
  checkIfSessionIsValid(id, participates, maxAmountOfParticipants, amountOfParticipants, date);
}

function addEventHandlersSession() {
  $(".sessionDetails").on("click", async function () {
    try {
      const id = $(this).parent().attr('id');
      const res = await ApiCaller.getSingleSession(id);
      const json = await res.json();
      sessionDetails(json);
    } catch (err) {
      console.log(err)
    }
  });

}

// Add eventlisteners for button that render in after dom has loaded ->
//  > Edit session : Admin can edit a session
//  > Remove session : Admin can delete/cancel a session
function clickEvents() {
  if (roleCheck()) {
    // Edit a session ->
    $(".editSession").on("click", function () {
      const sessionId = $(this).parent().parent().parent().parent().attr("id");
      editSession(sessionId);
    });
    // Remove a session ->
    $(".removeSession").on("click", function () {
      const sessionId = $(this).parent().parent().parent().parent().attr("id");
      removeSession(sessionId);
    });
    $(".addUser").on("click", function () {
      const sessionId = $(this).parent().parent().parent().parent().attr("id");
      addUser(sessionId);
    });
  }

}

function addUser(sessionId) {
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
            <div class="col-md-12 pb-3">
              <input type="text" class="form-control" id="searchUser" placeholder="Zoeken..">
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

  $("#searchUser").on("input", function () {
    let userArray = filterData($(this).val());
    console.log(userArray)
    if (userArray.length <= 0) {
      $(".userItemCol").empty();
      $(".userItemCol").append("<h4 class='lead'>Geen resultaat</h4>")
    } else {
      $(".userItemCol").empty();
      for (item in userArray) {
        $(".userItemCol").append(createUserItem(userArray[item].fullName, userArray[item].email, userArray[item].phoneNumber, userArray[item].id));
        $("#" + userArray[item].id).on("click", function () {
          addUserToSessionAsAdmin(sessionId, this.id);
        });
        $("." + userArray[item].id).on("click", function () {
          removeUserFromSessionAsAdmin(sessionId, $(this).prop("className"))
        });
      }
    }
  });
}
// subcribe a user to a session as admin ->
async function addUserToSessionAsAdmin(sessionId, userId) {
  let data = { userId }
  console.log(data)
  try {
    let res = await ApiCaller.addUserToSession(data, sessionId);
    let json = await res.json();
    if (res.status == 200) {
      toastPopUp(json.message, "success");
      loadAndSetFullAgenda(weekNumb);
    } else {
      toastPopUp(json.message, "error");
    }
  } catch (err) {
    console.log(err);
  }
}
// Remove a user from a session as admin ->
async function removeUserFromSessionAsAdmin(sessionId, userId) {
  let data = { userId };
  swal.fire({
    title: "Weet u zeker dat u deze gebruiker wilt verwijderen uit de les?",
    text: "Deze gebruiker zal een email ontvangen met daarin de wijziging.",
    icon: "info",
    showConfirmButton: true,
    confirmButtonText: "Verwijderen",
    confirmButtonColor: "#D5CA9B"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        console.log(data)
        console.log(sessionId)
        let res = await ApiCaller.unsubscribeFormSession(data, sessionId)
        let json = await res.json();

        if (res.status == 200) {
          toastPopUp(json.message, "success")
          loadAndSetFullAgenda(weekNumb);
        } else {
          toastPopUp(json.message, "error");
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
}
// Create userItem element 
function createUserItem(fullName, email, phoneNumber, id) {
  let element = `
  <div class="row pb-2">
    <div class="col-md-12 p-2 lead userFilterItem text-start">
      <h4><i class="bi bi-person pe-2"></i> ${fullName}</h4>
      <p class="p-1">
      <i class="bi bi-envelope pe-3"></i> ${email} <br>
      <i class="bi bi-telephone pe-3"></i> ${phoneNumber}<br>
      </p>
      <div class="${id}">
        <i id=${id} class="bi bi-person-plus float-end"></i>
        <i class="bi bi-person-dash pe-2 removeAsAdmin float-end"></i>
      </div>
    </div>
  </div>`

  return element;
}

// Edit session as admin ->
async function editSession(sessionId) {
  try {
    let res = await ApiCaller.getSingleSession(sessionId); // Get all the infomation from the session
    let json = await res.json();
    let date = new Date(json.date);

    Swal.fire({
      html: `
      <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-12">
              <h2>Voeg nieuwe les toe</h2>
              <hr>
            </div>
          </div>
        <div class="row">
          <div class="col-md-6">
            <div class="row">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Lesnaam:</b></h3>
                <input id="lessonName" class="form-control" type="text">
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Beschrijving:</b></h3>
                <textarea id="lessonDescription" class="form-control"></textarea>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Locatie:</b></h3>
                <input id="lessonLocation" class="form-control" type="text">
              </div>
            </div>
            <div class="row">
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
            <div class="row">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-12">
                    <h3 class="lead lbs"><b>Dag:</b></h3>
                  </div>
                </div>
                <div class="row align-items-center pb-3">
                  <div class="col-md-12">
                    <input id="lessonDay" class="form-control" type="date">
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Starttijd:</b></h3>
                <input id="lessonTime" class="form-control" type="time">
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Duur:</b></h3>
                <input id="lessonDuration" class="form-control" type="number" step="30" min="30">
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Aantal deelnemers:</b></h3>
                <input id="maxPeople" class="form-control" type="number" step="1" min="1">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
      customClass: 'sweetalert-makeLesson',
      showCancelButton: true,
      confirmButtonText: 'Update les',
      confirmButtonColor: '#D5CA9B',
      cancelButtonText: 'Terug',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let jsonData = {
          "title": $("#lessonName").val(),
          "location": $("#lessonLocation").val(),
          "date": createDateString($("#lessonDay").val(), $("#lessonTime").val()),
          "duration": $("#lessonDuration").val(),
          "participants": [],
          "teacher": "Natascha",
          "description": $("#lessonDescription").val(),
          "maxAmountOfParticipants": $("#maxPeople").val(),
          "weekly": false
        }
        console.log(jsonData)

        try {
          let resUpdate = await ApiCaller.updateSession(jsonData, sessionId);
          let resJson = await resUpdate.json();
          if (resUpdate.status == 200) {
            loadAndSetFullAgenda(weekNumb);
            Swal.fire({
              title: "Les " + $("#lessonName").val() + " is gewijzigd!",
              icon: 'success',
              text: "Er zal een Email gestuurd worden naar alle leden die ingeschreven staan voor deze les!",
              showCloseButton: true,
              confirmButtonColor: '#D5CA9B'
            });
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

    $("#lessonName").val(json.title);
    $("#lessionDescription").val(json.description);
    $("#lessonLocation").val(json.location);
    $("#lessonDay").val(date.toISOString().split("T")[0]);
    $("#lessonDuration").val(json.duration);
    $("#maxPeople").val(json.maxAmountOfParticipants);
    $("#lessonTime").val(dateFormat(json.date).time);
  } catch (err) {
    console.log(err)
  }
}

// Remove a session as Admin
async function removeSession(sessionId) {
  Swal.fire({
    title: 'Weet u zeker dat u deze les wilt verwijderen?',
    icon: 'info',
    showCancelButton: true,
    text: "Bij het verwijderen van een les uit het rooster zullen alle ingeschreven personen een e-mail ontvangen.",
    confirmButtonColor: '#D5CA9B',
    confirmButtonText: 'Verwijder',
    cancelButtonText: 'Terug'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        let res = await ApiCaller.removeSession(sessionId);
        if (res.status == 200) {
          loadAndSetFullAgenda();
          toastPopUp("Les geannuleerd", "success");
        }
      } catch (err) {
        console.log(err)
      }
    }
  });
}

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

$(".nextWeek").on("click", function () {
  weekNumb++;
  if (weekNumb > 52) {
    weekNumb = 1;
    loadAndSetFullAgenda();
  } else {
    loadAndSetFullAgenda();
  }
});

// Go to current week ->
$(".week").on("click", function () {
  weekNumb = getCurrentWeekNumber();
  loadAndSetFullAgenda();
});

$(".addLesson").on("click", async function () {
  let error = false;
  let today = new Date().toISOString().split("T");
  let sessionArray = [];

  Swal.fire({
    html: `
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-12">
              <h2>Voeg nieuwe les toe</h2>
              <hr>
            </div>
          </div>
        <div class="row">
          <div class="col-md-6">
            <div class="row pb-3">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Lesnaam:</b></h3>
                <input id="lessonName" class="form-control" type="text">
              </div>
            </div>
            <div class="row pb-3">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Beschrijving:</b></h3>
                <textarea id="lessonDescription" class="form-control"></textarea>
              </div>
            </div>
            <div class="row pb-3">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Locatie:</b></h3>
                <input id="lessonLocation" class="form-control" type="text">
              </div>
            </div>
            <div class="row pb-3">
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
            <div class="row">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-12">
                    <h3 class="lead lbs"><b>Dag:</b></h3>
                  </div>
                </div>
                <div class="row align-items-center pb-3">
                  <div class="col-md-10">
                    <input id="lessonDay" value="${today[0]}"class="form-control" type="date">
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
            <div class="row pb-3">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Starttijd:</b></h3>
                <input id="lessonTime" class="form-control" type="time">
              </div>
            </div>
            <div class="row  pb-3">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Duur:</b></h3>
                <input id="lessonDuration" class="form-control" type="number" step="30" min="30">
              </div>
            </div>
            <div class="row pb-3">
              <div class="col-md-12">
                <h3 class="lead lbs"><b>Aantal deelnemers:</b></h3>
                <input id="maxPeople" class="form-control" type="number" step="1" min="1">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="alert alert-warning close errorBox" role="alert">
      </div>
    </div>
      `,
    customClass: 'sweetalert-makeLesson',
    confirmButtonColor: '#D5CA9B',
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: 'Voeg les toe',
    cancelButtonText: 'Terug',

  }).then(async (result) => {
    if (result.isConfirmed) {
      console.log(sessionArray.length)
      if(sessionArray.length > 0) {
        for(item in sessionArray) {
          addSession(sessionArray[item]);
        }
      } else { 
        let json =  {
          title: $("#lessonName").val() ,
          location: $("#lessonLocation").val(),
          date: createDateString($("#lessonDay").val(), $("#lessonTime").val()),
          duration: $("#lessonDuration").val(),
          participants: [],
          teacher: "Natascha",
          description: $("#lessonDescription").val(),
          maxAmountOfParticipants: $("#maxPeople").val(),
          weekly: false
        }
        addSession(json);
      }
    }
  });

  // Display all session added at the moment ->
  let checkStatus = false;
  $(".seeAddedSessions").on("click", function () {
    if (checkStatus == false) {
      $(".allSessionItems").slideDown(200)
      checkStatus = true;
    } else {
      $(".allSessionItems").slideUp(200);
      checkStatus = false;
    }
  });

  $(".addSessionToArray").on("click", function () {
    let title = $("#lessonName").val();
    let location = $("#lessonLocation").val();
    let date = createDateString($("#lessonDay").val(), $("#lessonTime").val());
    let duration = $("#lessonDuration").val();
    let participants = [];
    let teacher = "Natascha";
    let description = $("#lessonDescription").val();
    let maxAmountOfParticipants = $("#maxPeople").val();
    let weekly = false;

    let json = { title, location, date, duration, participants, teacher, description, maxAmountOfParticipants, weekly }

    if (title == "" || location == "" || date == "" || duration == "" || teacher == "" || description == "" || maxAmountOfParticipants == "") {
      errorText("Vul all velden in voordat u de les toevoegd.")
    } else {
      sessionArray.push(json);
      drawItems(sessionArray, $("#lessonDay").val());
    }
  });
});
// add a session as admin ->
async function addSession(sessionArray) {
  try {
    let res = await ApiCaller.addSession(sessionArray);
    let json = await res.json();
    if(res.status == 201) {
      toastPopUp("Les(sen) toegevoegd!", "success");
    } else {
      toastPopUp(json.message, "error");
    }
  } catch(err){
    console.log(err)
  }
}

function drawItems(sessionArray) {
  const sessionItems = $(".allSessionItems");
  sessionItems.empty();

  for (jsonIndex in sessionArray) {
    const json = sessionArray[jsonIndex];
    const item = $(`<p id="${jsonIndex}" class="lbs itemsSession"><b>${json.title}</b><br> ${dateFormat(json.date).date}</p>`);
    item.on("click", function () {
      //Remove json object from array ->
      sessionArray.splice(this.id, 1);
      //Update session Items ->
      drawItems(sessionArray);
    });
    sessionItems.append(item);
  }
}

// Add session call ->
// async function addSession(data) {
//   try {
//     let res = await ApiCaller.addSession(json);
//     let json = await res.json();
//     if (res.status == 201) {
//       toastPopUp(json.message, "success");
//     } else {
//       Swal.fire({
//         title: "Oops",
//         icon: 'success',
//         text: json.message,
//         showCloseButton: true,
//         confirmButtonColor: '#D5CA9B'
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }
// Unsubscribe form a session ->
function unsubcribeSession() {
  $(".unsubscribe").on("click", function () {
    let sessionId = $(this).parent().parent().attr("id");

    Swal.fire({
      title: 'Weet u zeker dat u zich wilt uitschrijven voor deze les?',
      icon: 'info',
      showCancelButton: true,
      text: "Na het uitschrijven ontvangt u het aantal uren die waren afgeschreven direct weer in uw account.",
      confirmButtonColor: '#D5CA9B',
      confirmButtonText: 'Uitschrijven',
      cancelButtonText: 'Terug'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let data = { "userId": user.userId }
        try {
          let res = await ApiCaller.unsubscribeFormSession(data, sessionId);
          let json = await res.json();
          if (res.status == 200) {
            loadAndSetFullAgenda(weekNumb);
            Swal.fire({
              title: json.message,
              icon: 'success',
              text: "Tot de volgende keer!",
              showConfirmButton: false,
              timer: 2000
            });
          } else {
            Swal.fire({
              title: "Oops!",
              icon: 'warning',
              text: json.message,
              showConfirmButton: false,
              timer: 2000
            });
          }
        } catch (err) {
          console.log(err)
        }
      }
    });
  });
}
// subcribe to lesson ->
function subscribeToSession() {
  $(".subscribe").on("click", function () {
    if (typeof user == 'undefined') {
      console.log("user not logged in");
      location.href = "/login";
    } else {
      let lesson = $(this).parent().parent().children(".sessionDetails").children("h4").text();
      console.log(lesson)
      Swal.fire({
        html: `
        <h2>Inschrijven</h2>
        <hr>
        <p>U wilt u inschrijven voor <b>${lesson}</b>.</p>
        <p><b> Hoeveel personen wilt u inschrijven?</b></p>
        <div class="row width">
          <div class="col-md-12 text-start">
            <input id="nrOfPeople" class="swal2-input" onchange="nrOfPeopleChanged()" align="left" type="number" min="0">
          </div>
        </div>
        <p><b id="extraPeopleTitle"></b></p>
        <div id="allInputs">

        </div>`,
        customClass: 'sweetalert-subscribe',
        showCancelButton: true,
        confirmButtonText: 'Schrijf mij in',
        confirmButtonColor: '#D5CA9B',
        cancelButtonText: 'Cancel',
      }).then(async (result) => {
        if (result.isConfirmed) {
          let sessionId = $(this).parent().parent().attr("id");
          let jsonData = {
            "userId": user.userId,
            "comingWith": sessionUserObject()
          }
          console.log(sessionId)
          console.log(jsonData)
          try {
            let res = await ApiCaller.addUserToSession(jsonData, sessionId);
            let jsonRes = await res.json();
            if (res.status == 200) {
              loadAndSetFullAgenda(weekNumb);
              Swal.fire({
                title: `U heeft zich ingeschreven voor ${lesson} .`,
                icon: 'success',
                text: `Wat leuk dat u zich heeft ingeschreven voor ${lesson}! Tot snel! `,
                showCloseButton: true,
                confirmButtonColor: '#D5CA9B'
              });
            } else {
              Swal.fire({
                title: `Oops!`,
                icon: 'warning',
                text: jsonRes.message,
                showCloseButton: true,
                confirmButtonColor: '#D5CA9B'
              });
            }
          } catch (err) {
            console.log(err);
          }
        }
      });
    }
  });
}

// Gets all input fields of extra participants when enrolling for a session ->
function sessionUserObject() {
  let val = $("#nrOfPeople").val() - 2; //amount to loop
  let array = [];
  let json = {};

  if (val < 0) {
    return array;
  } else {
    for (let i = 0; i <= val; i++) {

      json["name"] = $(".name" + i).val();
      json["email"] = $(".emailAddress" + i).val()
      array.push(json)
      json = {};
    }
    return array;
  }
}

// Loads inputfields. ->
function nrOfPeopleChanged() {
  let val = document.getElementById('nrOfPeople').value;
  let title = document.getElementById('extraPeopleTitle');
  let temporary = '';
  if (val > 1) {
    for (let i = 0; i < val - 1; i++) {
      temporary += `
      <div class="row extraPerson width">
        <div class="col-md-6">
          <input class='swal2-input name${i}' type='text' placeholder='Naam'>
        </div>
        <div class="col-md-6">
          <input class='swal2-input emailAddress${i}' type='text' placeholder='E-mailadres'>
        </div> 
      </div>`;

    }
    title.innerHTML = 'Vul hieronder de naam en het e-mailadres in van de personen die u meeneemt.';
    document.getElementById('allInputs').innerHTML = temporary;
  }
  else {
    title.innerHTML = '';
    document.getElementById('allInputs').innerHTML = '';
  }
}

function setWeekData(week) {
  let fDay = getfirstAndlastDatesOfTheWeek(2022, week).firstDay;
  let lDay = getfirstAndlastDatesOfTheWeek(2022, week).lastDay;

  $(".week").html(fDay + " - " + lDay)
}
