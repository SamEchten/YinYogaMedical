
let schedule;
let daysOfWeek =["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag","zondag"];
let weekNumb = getCurrentWeekNumber() -1;

// Render lesrooster from apiCaller and format it on date ->
$(async function() {
  setWeekData(weekNumb);
  const res = await (await ApiCaller.getAllSessions()).json();
  schedule = res;
  loadAgenda(weekNumb);
}); 


function checkIncomingSchedule()
{
  
  if(schedule == undefined)
  {
    return true;
  }
  return false;
}

// Loading agenda data per week ->
function loadAgenda(weekNumber)
{
  let week = schedule[weekNumber];
  if(week != undefined)
  {
    //clearAgenda(daysOfWeek);
    for(day in week)
    {
      if(week[day].length > 0)
      {
        let dayData = week[day];
        clearAgenda(day)
        for(session in dayData)
        {
          let sessionData = dayData[session];
          let {id, title, teacher, date} = sessionData;
          loadSessionItem(id, title, teacher, dateFormat(date).time, dateFormat(date).date, day);
        }
      } else 
      {
        clearAgenda(day);
        $("#" + day).append("<h4 class='lead p-3'>Geen lessen</h4>")
      }
    }
  } else
  {
    clearAgenda(daysOfWeek);
    $("#" + day).append("<h4 class='lead p-3'>Geen lessen</h4>")
  } 
}
// Clear agenda ->
function clearAgenda(daysOfWeek)
{

  $("#" + day).empty();
  
}

function getCurrentWeekNumber()
{
  currentDate = new Date();
    startDate = new Date(currentDate.getFullYear(), 0, 1);
    var days = Math.floor((currentDate - startDate) /
        (24 * 60 * 60 * 1000));
          
    var weekNumber = Math.ceil((currentDate.getDay() + 1 + days) / 7);
  return weekNumber;
}

// gets all day of the week and returns it in a array ->
function getAllDaysOfWeek(data)
{
  let days = [];
  for(week in schedule)
  {
    for(day in schedule[week])
    {
      if(!days.includes(day))
      {
        days.push(day);
      }
    }
  }
  return days;
}

// Show all details per session ->
function sessionDetails(data)
{ 
  Swal.fire(
    {
      html: `<h1 class="lead"> ${data.title}<h1>
      <hr>
      <p class="lead">Locatie: ${data.location}<p>
      <p class="lead">Docent: ${data.teacher}<p>
      <p class="lead">Datum: <b>${dateFormat(data.date).date}<b><p>`,
      confirmButtonColor: '#D5CA9B'
    });
}

function loadSessionItem(id, title, teacher, time, date, day)
{
    let itemLayout = `
    <div id="${id}"class="row ps-4 p-2 agendaItem align-items-center">
      <div class="col-md-2">
        <h4 id="time" class="text-left lead rbs"><i class="bi bi-clock pe-3"></i>${time}</h4>
      </div>
      <div class="col-md-2">
        <h4 id="title" class="text-left lead"><i class="bi bi-info-circle pe-3"></i>${title}</h4>
      </div>
      <div class="col-md-2">
        <h4 id="teacher" class="text-left lead "><i class="bi bi-person pe-3"></i>${teacher}</h4>
      </div>
      <div class="col-md-6 text-end">
        <button type="submit" class="btn btn-primary yinStyle" id="subscribe">Inschrijven</button>
      </div>
    </div>`

    $(itemLayout).appendTo("#" + day);
    addEventHandlersSession(id);
}

function addEventHandlersSession(id)
{
  $("#" + id).on("click", async function()
  {
    try
    {
      const res = await ApiCaller.getSingleSession(id);
      const json = await res.json();
      sessionDetails(json);
    }catch(err)
    {
      console.log(err)
    }
  });
}

// loading prev and next week 
$(".prevWeek").on("click", function()
{
  weekNumb--;
  setWeekData(weekNumb);
  loadAgenda(weekNumb);
});

$(".nextWeek").on("click", function()
{
  weekNumb++;
  setWeekData(weekNumb);
  loadAgenda(weekNumb);
});

$('#subscribe').on("click", function(){
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
function nrOfPeopleChanged(){
  let val = document.getElementById('nrOfPeople').value;
  let title = document.getElementById('extraPeopleTitle');
  let temporary = '';
  if(val > 1){
    for(let i = 0; i < val-1; i++){
      temporary +=
      "<input id='name"+val+"' class='swal2-input' type='text' placeholder='Naam'>"+
      "<input id='emailaddress"+val+"' class='swal2-input' type='text' placeholder='E-mailadres'>";
    }  
    title.innerHTML = 'Vul hieronder de naam en het e-mailadres in van de personen die u meeneemt.';
    document.getElementById('inputfields').innerHTML = temporary;
    }
  else
  {
    title.innerHTML = '';
    document.getElementById('inputfields').innerHTML = '';
  }
}

function setWeekData(week)
{
  let fDay = getfirstAndlastDatesOfTheWeek(2022, week).firstDay;
  let lDay = getfirstAndlastDatesOfTheWeek(2022, week).lastDay;

  $(".week").html(fDay +" - " + lDay)
}




