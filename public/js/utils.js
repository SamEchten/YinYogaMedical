let cookie = $.cookie("user");
let allUsers;
let user;

$(async function () {
  roleCheck();
  getAndSetAllUsers();
  $(".userName").html(user.fullName);
});

// Error message : give the class "errorBox" to activate ->
$(".errorBox").on("click", function () {
  $(".errorBox").slideUp(300);
});

function errorText(errMessage) {
  $(".errorBox").html(errMessage);
  $(".errorBox").slideDown(200);
}

// Date Time formatter  ->
// Call the function with .time to get time 
// Call the function with .date to get the date
function dateFormat(data) {
  let json = {}
  const dateObj = new Date(data);

  // Get time ->
  const time = new Date(dateObj.getTime()- (2 * 60 * 60 * 1000)).toLocaleTimeString("en-GB");

  // Get date ->
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  newDate = day + "/" + month + "/" + year;

  json.date = newDate;
  json.time = time.toString().slice(0, -3);

  return json;

};

// returns the dcurrent week, in most cases the week is 1 week off so -1. ->
function getCurrentWeekNumber() {

  currentDate = new Date();
  startDate = new Date(currentDate.getFullYear(), 0, 1);
  var days = Math.floor((currentDate - startDate) /
    (24 * 60 * 60 * 1000));

  var weekNumber = Math.ceil((currentDate.getDay() + 1 + days - 1) / 7);
  return weekNumber;
}

// returns the first(01-1-2022) and last(07-1-2022) date from a specific week ->
function getfirstAndlastDatesOfTheWeek(year, week) {
  firstDay = new Date(year, 0, 1).getDay();
  var d = new Date("Jan 01, " + year + " 01:00:00");
  var w = d.getTime() - (3600000 * 24 * (firstDay - 1)) + 604800000 * (week)
  var firstDay = new Date(w);
  var lastDay = new Date(w + 518400000)

  return {
    firstDay: firstDay.toLocaleDateString("en-GB"),
    lastDay: lastDay.toLocaleDateString("en-GB")
  }
}

function createDateString(date, time) {
  let string = date + "T" + time + ":00.000Z"
  console.log(string)
  return string;
}

// Checks client role  ->
function roleCheck() {
  try {
    user = JSON.parse(cookie);
    if (user.isEmployee) {
      return true
    } else {
      return false
    }
  } catch (err) {

  }
}
// Checks if the session is full or not ->
function checkIfSessionIsValid(id, participates, maxAmountOfParticipants, amountOfParticipants, date) {
  let today = new Date;
  let sessionDay = new Date(date);
  const result = new Date(sessionDay.toISOString().slice(0, -1))

  if ((amountOfParticipants >= maxAmountOfParticipants && !participates) || today > result) { 
    if(!roleCheck()) {
      $("#" + id).css({ "opacity": 0.5,
      "pointer-events": "none"})
    }
  }
  
}

// Hide elements for none admins else show them ->
function showOrhideElements() {
  if (roleCheck()) {
    $(".hiding").css("display", "block");
    $(".subscribe").attr("disabled", true);
  }
}

// Call this function to create toast pop up in the bottom right corner ->
// @header -> title of the pop up
// @icon -> "success", "warning", "info"
// @text ->  message in the pop up
function toastPopUp(header, icon, message) {
  Swal.fire({
    title: header,
    icon: icon,
    text: message,
    target: '#custom-target',
    toast: true,
    position: 'bottom-right',
    showConfirmButton: false,
    timer: 3000
  });
}

// Gets all users from the platform ->
//  > returns : array
async function getAndSetAllUsers() {
  try {
    let res = await ApiCaller.getAllUsers();
    let json = await res.json();
    console.log(json)
    if(res.status == 200) {
      allUsers = json;
    }
  } catch (err) {
    console.log(err)
  }
}

// Admin adds a user to a session instead of subcribing him self ->
//  > returns a array with all elements found with filterValue in it.
function filterData(filterValue) {
  let filteredArray = [];
  for (user in allUsers) {
    let username = allUsers[user].fullName.toLowerCase();
    if (username.includes(filterValue.toLowerCase())) {
      filteredArray.push(allUsers[user]);
    }
  }
  return filteredArray;
}

