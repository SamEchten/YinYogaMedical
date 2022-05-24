let schedule;
let daysOfWeek = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"];
let weekNumb = getCurrentWeekNumber();

// Render lesrooster from apiCaller and format it on date ->
$(async function () {
  setWeekData(weekNumb);
  
  const res = await (await ApiCaller.getAllSessions()).json();
  schedule = res;
  loadAgenda(weekNumb);
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
          let { id, title, teacher, date } = sessionData;
          loadSessionItem(id, title, teacher, dateFormat(date).time, dateFormat(date).date, day);
        }
      } else {
        clearAgenda(day);
        $("#" + day).append("<h4 class='lead p-3'>Geen lessen</h4>")
      }
    }
  } else {
    fullClear();
  }
  showOrhideElements();
  clickEvents();
}
// Loads agenda items and sets the week dates on top of the agenda ->
function loadAndSetFullAgenda() {
  setWeekData(weekNumb);
  loadAgenda(weekNumb);
}

// Clear one day
function clearAgenda(day) {
  $("#" + day).empty();
}

// Clear all days
function fullClear() {
  for (day in daysOfWeek) {
    console.log(day)
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
  return new Date(date.getTime() + minutes*60000);
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

function loadSessionItem(id, title, teacher, time, date, day) {
  let itemLayout = `
    <div id="${id}" class="row ps-4 p-2 agendaItem align-items-center">
      <div class="col-md-2">
        <h4 id="time" class="text-left lead fw-bold rbs"><i class="bi bi-clock pe-3"></i>${time}</h4>
      </div>
      <div class="col-md-2 sessionDetails">
        <h4 id="title" class="text-left lead"><i class="bi bi-info-circle pe-3"></i>${title}</h4>
      </div>
      <div class="col-md-2">
        <h4 id="teacher" class="text-left lead "><i class="bi bi-person pe-3"></i>${teacher}</h4>
      </div>
      <div class="col-md-2 text-end">
        <i class="bi bi-pencil hiding editSession"></i>
      </div>
      <div class="col-md-2 text-start ">
        <i class="bi bi-x-lg hiding removeSession"></i>
      </div>
      <div class="col-md-2 text-end">
        <button type="submit" class="btn btn-primary yinStyle" id="subscribe">Inschrijven</button>
      </div>
    </div>`

  $(itemLayout).appendTo("#" + day);
  addEventHandlersSession();
  subscribeToSession();
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
function clickEvents() {
  if(roleCheck()) { 
    // Edit a session ->
    $(".editSession").on("click", function () {
      console.log("EDIT SESSION");
    });
    // Remove a session ->
    $(".removeSession").on("click", function() {
      const sessionId = $(this).parent().parent().attr("id");
      removeSession(sessionId);
    });
    $(".subscribe").on("click", function() {
      const sessionId = $(this).parent().parent().attr("id");
      console.log(sessionId, user.userId);
      // subscribe functon with @id and @userId
    });
  }
  
}

// Remove a session as Admin
async function removeSession(sessionId) {
      Swal.fire({
        title: 'Weet u zeker dat u deze les wilt annuleren?',
        showCancelButton: true,
        confirmButtonColor: '#D5CA9B',
        confirmButtonText: 'Annuleer',
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          try { 
            let res = await ApiCaller.removeSession(sessionId);
            if(res.status == 200) {
              loadAndSetFullAgenda(); 
            }
            Swal.fire({
              title : "Les geannuleerd!",
              icon: 'success',
              showCloseButton: true,
              confirmButtonColor: '#D5CA9B'
            });
          } catch(err) { 
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
$(".week").on("click", function ()  {
  weekNumb = getCurrentWeekNumber();
  loadAndSetFullAgenda();
});

$(".addLesson").on("click", async function () {
  let error = false;
  Swal.fire({
    html:`
    <h2>Voeg nieuwe les toe</h2>
    <hr>
    <div class="row width">
      <div class="col-md-6">
        <h3 class="lead lbs"><b>Lesnaam:</b></h3>
        <input id="lessonName" class="swal2-input" type="text">
        <h3 class="lead lbs"><b>Beschrijving:</b></h3>
        <textarea id="lessonDescription" class="swal2-input"></textarea>
        <h3 class="lead lbs"><b>Locatie:</b></h3>
        <input id="lessonLocation" class="swal2-input" type="text">
        <h3 class="lead lbs"><b>Yogadocent:</b></h3>
        <p>
          <input id="lessonTeacher" type="radio" checked="true" value="Natascha Puper">
          Natascha Puper
        </p>
      </div>
      <div class="col-md-6">
        <h3 class="lead lbs"><b>Dag:</b></h3>
        <div class="row">
          <div class="col-md-4">
          <input id="lessonDay" class="swal2-input" type="date">
          </div>
        </div>
        <h3 class="lead lbs"><b>Starttijd:</b></h3>
        <div class="row">
          <div class="col-md-4">
            <input id="lessonTime" class="swal2-input" type="time">
          </div>
        </div>
        <h3 class="lead"><b>Duur:</b></h3>
        <p class="subtext">De duur van de les in minuten.</p>
        <div class="row">
          <div class="col-md-4">
            <input id="lessonDuration" class="swal2-input" type="number" step="30" min="30">
          </div>
        </div>
        <h3 class="lead"><b>Aantal deelnemers:</b></h3>
        <p class="subtext">Het maximale aantal deelnemers dat mee kan doen.</p>
        <div class="row">
          <div class="col-md-4">
            <input id="maxPeople" class="swal2-input" type="number" step="1" min="1">
          </div>
        </div>
      </div>
      <div class="alert alert-warning errorBox" role="alert"></div>
    </div>`,
    customClass: 'sweetalert-makeLesson',
    showCancelButton: true,
    confirmButtonText: 'Voeg les toe',
    confirmButtonColor: '#D5CA9B',
    closeOnConfirm: false,
    cancelButtonText: 'Cancel',
    preConfirm: async () => {
      let add = await addSession();
        if(add) {
          error = true;
        }
    }
  }).then((result) => {
      if(result.isConfirmed) {
        if(error) { 
          Swal.fire({
            title : "Les aangemaakt!",
            icon: 'success',
            showCloseButton: true,
            confirmButtonColor: '#D5CA9B'
          });
        }else {
          Swal.fire({
            title : "Velden niet correct ingevuld",
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
    "title": $("#lessonName").val(),
    "location": "Emmen",
    "date": createDateString($("#lessonDay").val(), $("#lessonTime").val()),
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
    if(res.status == 201) { 
      return true;
    } else { 
      return false;
    }
  } catch(err) {
    console.log(err);
  }
}

// TODO: Laat les zien waarvoor er ingeschreven wordt. ->
function subscribeToSession() {
  $("#subscribe").on("click", function() {
    if(typeof user == 'undefined') {
      console.log("user not logged in");
      location.href ="/login";
    } else {
      let lesson = $(this).parent().parent().children(".sessionDetails").children("h4").text();
      console.log(lesson)
      Swal.fire({
        html:`
        <h2>Inschrijven</h2>
        <hr>
        <p>U wilt u inschrijven voor <b>${lesson}</b>.</p>
        <p><b> Hoeveel personen wilt u inschrijven?</b></p>
        <div class="row width">
          <div class="col-md-3">
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
      }).then(async (result)  => {
        if(result.isConfirmed) {
          let sessionId = $(this).parent().parent().attr("id");
          let jsonData = {
            "userId" : user.userId,
            "comingWith" : sessionUserObject()
          }
          console.log(sessionId)
          console.log(jsonData)
          try {
            let res = await ApiCaller.addUserToSession(jsonData, sessionId);
            let jsonRes = await res.json();
            if(res.status == 200)
            {
              Swal.fire({
                title : `U heeft zich ingeschreven voor ${lesson} .`,
                icon: 'success',
                text: `Wat leuk dat u zich hebt ingeschreven voor ${lesson}! Tot snel! `,
                showCloseButton: true,
                confirmButtonColor: '#D5CA9B'
              }); 
            } else {
              Swal.fire({
                title : `Oops!`,
                icon: 'warning',
                text: jsonRes.message,
                showCloseButton: true,
                confirmButtonColor: '#D5CA9B'
              });
            }
          } catch(err) {
            console.log(err);
          }
        }
      });
    }  
  });
}

// Gets all input fields of extra participants when enrolling for a session ->
function sessionUserObject() {
  let val = $("#nrOfPeople").val() -2; //amount to loop
  let array = [];
  let json = {};

  if(val < 0) {
    return array;
  } else {
    for(let i = 0; i <= val; i++) {
    
      json["name"] = $(".name" +  i).val();
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





