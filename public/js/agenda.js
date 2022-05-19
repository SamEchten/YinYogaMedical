let schedule;

// Render lesrooster from apiCaller and format it on date ->
$(async function() {
  const res = await (await ApiCaller.getAllSessions()).json();
  schedule = res;
  loadAgenda(20);
}); 

$('#subscribe').on("click", function(){
  Swal.fire({
    html: 
    `<h2>Inschrijven</h2>
    <p>U wilt u inschrijven voor (les).</p>
    <p><b> Hoeveel personen wilt u inschrijven?</b></p>
    <input id="swal-input1" class="swal2-input" align="left" type="number" min="0">
    <p><b>Vul hieronder de naam en het e-mailadres van deze personen in.</b></p>
    <p><input id="swal-input2" class="swal2-input" type="text" placeholder="Naam">
    <input id="swal-input2" class="swal2-input" type="text" placeholder="E-mailadres"></p>`,
    customClass: 'sweetalert-subscribe',
    showCancelButton: true,
    confirmButtonText: 'Schrijf mij in',
    confirmButtonColor: '#D5CA9B',
    cancelButtonText: 'Cancel',
  });
});

// Loading agenda data per week ->
function loadAgenda(weekNumber)
{
    let week = schedule[weekNumber]
    for(day in week)
    {
      let dayData = week[day];
      for(session in dayData)
      {
        let sessionData = dayData[session];
        let {id, title, teacher, date} = sessionData;
        loadSessionItem(id, title, teacher, dateFormat(date).time, day);
      }
    }
    
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
    }
    
  )
}

function loadSessionItem(id, title, teacher, date, day)
{
    let itemLayout = `
    <div id="${id}"class="row ps-4 p-2 agendaItem align-items-center">
      <div class="col-md-2">
        <h4 id="time" class="text-left lead rbs"><i class="bi bi-clock pe-3"></i>${date}</h4>
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


