let schedule;
let daysOfWeek = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"];
let weekNumb = getCurrentWeekNumber() -1;
let numberOfHoursSession;

// Render lesrooster from apiCaller and format it on date ->
//  > Document.getready! first render. 
$(async function () {
  setWeekData(weekNumb);
  loader(true);
  const res = await (await ApiCaller.getAllSessions()).json();
  console.log(res);
  loader(false);
  schedule = res;
  loadAgenda(weekNumb);
  scrollDownToCurrDay();

});

// Loading agenda data per week ->
async function loadAgenda(weekNumber) {
  loader(true);
  const res = await (await ApiCaller.getAllSessions()).json();
  loader(false);
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
  addEventHandlersSession();
}
// Loads agenda items and sets the week dates on top of the agenda ->
function loadAndSetFullAgenda() {
  setWeekData(weekNumb);
  loadAgenda(weekNumb);
  updateNav();
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
console.log(user)
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
  let subCol = $("#" + id).children(".subscribeCol"); // subscribe col per ID, button is being pushed into this column

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
  let html = templateLoadSessionDetails(data);
  let check = false;
  Swal.fire(
    {
      html: html,
      customClass: 'sweetalert-seelesson',
      confirmButtonColor: '#D5CA9B',
      confirmButtonText: 'OK'
    });
  //handle the dropdown effect
  $(".dropDownUsers").on("click", function () {
    if (check) {
      $(".sessionUsers").slideUp("slow");
      check = false;
    } else {
      $(".sessionUsers").slideDown("slow");
      check = true;
    }
  });
  //load all participants into correct div
  if (roleCheck()) {
    if (data.participants.length <= 0) {
      $(".sessionUsers").append(`<p class="lead "> Geen inschrijvingen</p>`)
    }
    $(".sessionUsers").empty();
    showAllParticipants(data.participants);
  } else {
    $(".usersPerSessionRow").addClass("d-none");
  }
}

async function showAllParticipants(data) {
  $(".sessionUsers").empty();
  if (data.length <= 0) {
    $(".sessionUsers").append(`<p class="lead"></i>Nog geen aanmeldingen <i class="bi bi-emoji-frown"></p>`);
  } else {
    for (users in data) {
      // @TODO : CREATE API CALL FOR EVERY USER ID AND PUT THE INFO IN OF THE USER IN THE CONTAINER AND APPEND IT 
      try {
        let res = await ApiCaller.getUserInfo(data[users].userId);
        let json = await res.json();
        if (res.status == 200) {
          $(".sessionUsers").append(`<p class="lead userSessionDetails"><i class="bi bi-person"></i> ${json.fullName}</p>`);

          //Add coming With participants
          for (i in data[users].comingWith) {
            const participant = data[users].comingWith[i];
            $(".sessionUsers").append(`<p class="lead userSessionDetails ms-3"><i class="bi bi-arrow-return-right"></i> ${participant.name}</p>`);
          }
        } else {
          toastPopUp(json.message);
        }
      } catch (err) {

      }
    }
  }

  $(".sessionUsers").addClass("hideScrollbar");
}
// Loads all session items and puts them into the right day ->
function loadSessionItem(id, title, teacher, participates, maxAmountOfParticipants, amountOfParticipants, date, day) {
  let itemLayout = templateLoadSession(id, date, title, teacher, amountOfParticipants, maxAmountOfParticipants);

  $(itemLayout).appendTo("#" + day);

  if (roleCheck()) {
    $("#" + id).children().children().children(".participantsColor").css("color", checkSessionSize(amountOfParticipants, maxAmountOfParticipants));
  }

  checkIfSessionIsValid(id, participates, maxAmountOfParticipants, amountOfParticipants, date);
}

function addEventHandlersSession() {
  $(".sessionDetails").on("click", async function () {
    try {
      loader(true);
      const id = $(this).parent().attr('id');
      const res = await ApiCaller.getSingleSession(id);
      const json = await res.json();
      loader(false);
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

    // Add tooltips on icons
    createToolTip($(".editSession"), "Wijzigen van een les", "top");
    createToolTip($(".removeSession"), "Verwijderen van een les", "top");
    createToolTip($(".addUser"), "Voeg gebruikers toe aan de les", "top");
    $('[data-toggle="tooltip"]').tooltip();
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
  //loading in the swal templates from agendaSwalItems.js
  swalItemAddUser();

  // show all users at the begin of loading the pop up
  $(".userItemCol").empty();
  loopAndAddElements(filterData(""), sessionId);

  $("#searchUser").on("input", function () {
    let userArray = filterData($(this).val());

    if (userArray.length <= 0) {
      $(".userItemCol").empty();
      $(".userItemCol").append("<h4 class='lead'>Geen resultaat</h4>")
    } else {
      $(".userItemCol").empty();
      loopAndAddElements(userArray, sessionId);
    }
  });
}

function loopAndAddElements(userArray, sessionId) {
  for (item in userArray) {
    $(".userItemCol").append(createUserItem(userArray[item].fullName, userArray[item].email, userArray[item].phoneNumber, userArray[item].id));
    $('[data-toggle="tooltip"]').tooltip();
    $("#" + userArray[item].id).on("click", function () {
      addUserToSessionAsAdmin(sessionId, this.id);
      $('[data-toggle="tooltip"]').tooltip('hide');
    });
    $("#_" + userArray[item].id).on("click", function () {
      removeUserFromSessionAsAdmin(sessionId, this.id.substring(1));
    });
  }
}
// subcribe a user to a session as admin ->
async function addUserToSessionAsAdmin(sessionId, userId) {
  let data = { userId }
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
  }
}
// Remove a user from a session as admin ->
async function removeUserFromSessionAsAdmin(sessionId, userId) {
  $('[data-toggle="tooltip"]').tooltip('hide');
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
        let res = await ApiCaller.unsubscribeFormSession(data, sessionId)
        let json = await res.json();

        if (res.status == 200) {
          toastPopUp(json.message, "success")
          loadAndSetFullAgenda(weekNumb);
        } else {
          toastPopUp(json.message, "error");
        }
      } catch (err) {
      }
    }
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
      <div class="row h-33 align-items-center">
        <div class="col-md-12  cursor addAsAdmin">
          <i id=${id} class="bi bi-person-plus " data-toggle="tooltip" data-placement="top" title="Gebruiker toevoegen aan de les"></i>
        </div>
      </div>
      <div class="row h-33 align-items-center">
        <div class="col-md-12  cursor removeAsAdmin">
          <i id="_${id}"class="bi bi-person-dash " data-toggle="tooltip" data-placement="top" title="Gebruiker verwijderen uit de les"></i>
        </div> 
      </div>
      <div class="row h-33 align-items-center">
        <div class="col-md-12 cursor giftFreeSession">
          <i class="bi bi-gift gift"></i>
        </div>
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
    let html = swalItemEditSession();

    Swal.fire({
      html: html,
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
          "teacher": "Natascha",
          "description": $("#lessonDescription").val(),
          "maxAmountOfParticipants": $("#maxPeople").val(),
          "weekly": false
        }
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
    $("#lessonDescription").val(json.description);
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
          $("#" + sessionId).addClass("slide-out-top");
          $("#" + sessionId).slideUp(500);

          //loadAndSetFullAgenda();
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
  let sessionArray = [];
  let html = swalItemAddSession();

  Swal.fire({
    html: html,
    customClass: 'sweetalert-makeLesson',
    confirmButtonColor: '#D5CA9B',
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: 'Voeg les toe',
    cancelButtonText: 'Terug',
    allowOutsideClick: false

  }).then(async (result) => {
    if (result.isConfirmed) {
      if (sessionArray.length > 0) {
        for (item in sessionArray) {
          addSession(sessionArray[item]);
        }
      } else {
        let json = {
          title: $("#lessonName").val(),
          location: $("#lessonLocation").val(),
          date: createDateString($("#lessonDay").val(), $("#lessonTime").val()),
          duration: $("#lessonDuration").val(),
          participants: [],
          teacher: "Natascha",
          description: $("#lessonDescription").val(),
          maxAmountOfParticipants: $("#maxPeople").val(),
          weekly: false,
          private: $(".lessonPrive").is(":checked")

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
    $(".allSessionItems").slideDown(200);
    checkStatus = true;

    let json = { title, location, date, duration, participants, teacher, description, maxAmountOfParticipants, weekly }

    if (title == "" || location == "" || date == "" || duration == "" || teacher == "" || description == "" || maxAmountOfParticipants == "") {
      errorText("Vul alle velden in voordat u de les toevoegd.")
    } else {
      sessionArray.push(json);
      drawItems(sessionArray);
    }
  });
});
// add a session as admin ->
async function addSession(sessionArray) {
  try {
    let res = await ApiCaller.addSession(sessionArray);
    let json = await res.json();
    if (res.status == 201) {
      toastPopUp("Les(sen) toegevoegd!", "success");
      loadAndSetFullAgenda(weekNumb);
    } else {
      toastPopUp(json.message, "error");
    }
  } catch (err) {
    console.log(err)
  }
}

function drawItems(sessionArray) {
  const sessionItems = $(".allSessionItems");
  sessionItems.empty();

  for (jsonIndex in sessionArray) {
    const json = sessionArray[jsonIndex];
    const item = $(`<p id="${jsonIndex}" class="lbs itemsSession slide-in-blurred-top"><b>${json.title}</b><br> ${dateFormat(json.date).date}</p>`);
    item.on("click", function () {
      //Remove json object from array ->
      sessionArray.splice(this.id, 1);
      //Update session Items ->
      drawItems(sessionArray);
    });
    sessionItems.append(item);
  }
}

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
        let data = { "userId": user.id }
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
    let lesson = $(this).parent().parent().children(".sessionDetails").children("h4").text();
    let saldo = user.saldo;
    let html = swalItemSubscribeToSession(lesson);
    let sessionId = $(this).parent().parent().attr("id");
    if (typeof user == 'undefined') {
      location.href = "/login";
    } else {
      Swal.fire({
        html: html,
        customClass: 'sweetalert-subscribe',
        showCancelButton: true,
        confirmButtonText: 'Schrijf mij in',
        confirmButtonColor: '#D5CA9B',
        cancelButtonText: 'Cancel',
      }).then(async (result) => {
        if (result.isConfirmed) {

          let jsonData = {
            "userId": user.id,
            "comingWith": sessionUserObject()
          }
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

      $(document).ready(async function(){
        let duration = await ApiCaller.getSingleSession(sessionId)
        let jsonDur = await duration.json();
        if (duration.status == 200) {
          numberOfHoursSession = jsonDur.duration / 60;
          $('#saldo').text(user.saldo);
          $('#sessionCost').text(numberOfHoursSession);
          if (user.saldo < numberOfHoursSession) {
            $('#saldoText').css("color", "red");
            $(".swal2-confirm").attr('disabled', 'disabled');
            $("#nrOfPeople").attr('disabled', 'disabled');
          }
          else {
            $('#saldoText').css("color", "green");
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
  let val = $("#nrOfPeople").val()
  //let val = document.getElementById('nrOfPeople').value;
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
  let hours = numberOfHoursSession * val
  $('#sessionCost').text(hours);


  if (user.saldo < hours) {
    $('#saldoText').css("color", "red");
    $(".swal2-confirm").attr('disabled', 'disabled');
  }
  else {
    $('#saldoText').css("color", "green");
    $(".swal2-confirm").removeAttr("disabled");
  }
}

function setWeekData(week) {
  let fDay = getfirstAndlastDatesOfTheWeek(2022, week).firstDay;
  let lDay = getfirstAndlastDatesOfTheWeek(2022, week).lastDay;

  $(".week").html(fDay + " - " + lDay)
}
