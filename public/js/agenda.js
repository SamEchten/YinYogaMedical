let schedule;
let userRole = "user";
let daysOfWeek = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"];
let weekNumb = getCurrentWeekNumber() - 1;

// Render lesrooster from apiCaller and format it on date ->
$(async function () {
  setWeekData(weekNumb);
  const res = await (await ApiCaller.getAllSessions()).json();
  schedule = res;
  loadAgenda(weekNumb);
});

// Loading agenda data per week ->
function loadAgenda(weekNumber) {
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
  } else
  {
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
  for(day in daysOfWeek) {
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

// Show all details per session ->
function sessionDetails(data) {
  
  Swal.fire(
    {
      html: `<h2>${data.title}<h2>
      <hr>
      <div class="test">
        <h1 class="lead"><b>Locatie:</b></h1>
        <p>${data.location}</p>
        <h1 class="lead"><b>Beschrijving:</b></h1>
        <p>${data.description}<p>
        <h1 class="lead"><b>Docent:</b></h1>
        <p>${data.teacher}<p>
        <h1 class="lead"><b>Datum:</b></h1> 
        <p>${dateFormat(data.date).date}</p>
      </div>
        `,
      customClass: 'sweetalert-seeLesson',
      confirmButtonColor: '#D5CA9B',
      confirmButtonText: 'OK'
    });
}

function loadSessionItem(id, title, teacher, time, date, day) {
  let itemLayout = `
    <div class="row ps-4 p-2 agendaItem align-items-center">
      <div class="col-md-2">
        <h4 id="time" class="text-left lead rbs"><i class="bi bi-clock pe-3"></i>${time}</h4>
      </div>
      <div id="${id}" class="col-md-2">
        <h4 id="title" class="text-left lead"><i class="bi bi-info-circle pe-3"></i>${title}</h4>
      </div>
      <div class="col-md-2">
        <h4 id="teacher" class="text-left lead "><i class="bi bi-person pe-3"></i>${teacher}</h4>
      </div>
      <div class="col-md-2 text-end">
        <i class="bi bi-pencil hiding editSession"></i>
      </div>
      <div class="col-md-2 text-start ">
        <i class="bi bi-trash3 hiding removeSession"></i>
      </div>
      <div class="col-md-2 text-end">
        <button type="submit" class="btn btn-primary yinStyle" id="subscribe">Inschrijven</button>
      </div>
    </div>`

  $(itemLayout).appendTo("#" + day);
  addEventHandlersSession(id);
}

function addEventHandlersSession(id) {
  $("#" + id).on("click", async function () {
    try {
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
  // Edit a session ->
  $(".editSession").on("click", function() {
    console.log("EDIT SESSION");
  });
  // Remove a session ->
  $(".removeSession").on("click", function() {
    console.log("REMOVE SESSION");
  });
}

// loading prev and next week ->
$(".prevWeek").on("click", function () {
  weekNumb--;
  if(weekNumb < 1) {
    weekNumb = 52;
    loadAndSetFullAgenda();
  } else {
    loadAndSetFullAgenda();
  }
});

$(".nextWeek").on("click", function () {
  weekNumb++;
  if(weekNumb > 52) {
    weekNumb = 1;
    loadAndSetFullAgenda();
  } else {
    loadAndSetFullAgenda();
  }
});

// Go to current week ->
$(".week").on("click", function ()  {
  weekNumb = getCurrentWeekNumber() - 1;
  loadAndSetFullAgenda();
});

$(".addLesson").on("click", function() {
  Swal.fire({
    html: 
    `<h2>Voeg nieuwe les toe</h2>
    <p><b>Lesnaam:</b></p>
    <input id="lessonname" class="swal2-input" type="text">
    <p><b>Beschrijving:</b></p>
    <textarea id="lessondescription" class="swal2-input"></textarea>
    <p><b>Yogadocent:</b></p>
    <p><input id="lessondocent" type="radio" checked="true" value="Natascha Puper">
    Natascha Puper</p>
    <p><b>Dag:</b></p>
    <input id="lessonday" class="swal2-input" type="date">
    <p><b>Starttijd:</b></p>
    <input id="lessontime" class="swal2-input" type="time">
    <p><b>Duur:</b></p>
    <input id="lessonduration" class="swal2-input" type="number" step="0.5" min="0.5" max="8">`,
    customClass: 'sweetalert-makeLesson',
    showCancelButton: true,
    confirmButtonText: 'Voeg les toe',
    confirmButtonColor: '#D5CA9B',
    cancelButtonText: 'Cancel',
  });
});

$('#subscribe').on("click", function() {
  Swal.fire({
    html:
      `<h2>Inschrijven</h2>
    <p>U wilt u inschrijven voor (les).</p>
    <p><b> Hoeveel personen wilt u inschrijven?</b></p>
    <input id="nrOfPeople" class="swal2-input" onchange="nrOfPeopleChanged()" align="left" type="number" min="0">
    <p><b id="extraPeopleTitle"></b></p>
    <p id="inputfields"></p>`,
    customClass: 'sweetalert-subscribe',
    showCancelButton: true,
    confirmButtonText: 'Schrijf mij in',
    confirmButtonColor: '#D5CA9B',
    cancelButtonText: 'Cancel',
  });
});

// Loads inputfields.
function nrOfPeopleChanged() {
  let val = document.getElementById('nrOfPeople').value;
  let title = document.getElementById('extraPeopleTitle');
  let temporary = '';
  if (val > 1) {
    for (let i = 0; i < val - 1; i++) {
      temporary +=
        "<input id='name" + val + "' class='swal2-input' type='text' placeholder='Naam'>" +
        "<input id='emailaddress" + val + "' class='swal2-input' type='text' placeholder='E-mailadres'>";
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




