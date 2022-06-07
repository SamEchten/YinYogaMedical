let cookie = $.cookie("user");
let allUsers;
let user;

$(async function () {
  await updateUser(cookie.userId);
  getAndSetAllUsers();
  setUserItemsNav();
  updateNav();
  showWelcomMessage();
  $(".contentRow").prepend(`<div class="loader"></div>`);
});

// Update users saldo 
async function updateNav() {
  await updateUser(user.id);
  if (user) {
    setUserItemsNav();
  }
}

async function updateUser(userId) {
  console.log(userId);
  let res = await ApiCaller.getUserInfo(userId);
  user = await res.json();
}

function showWelcomMessage() {
  const firstPageLoad = sessionStorage.getItem("firstPageLoad");
  if (firstPageLoad == null) {
    if (user) {
      toastPopUp("Welkom " + user.fullName, "info");
    } else {
      toastPopUp("Welkom bij Natascha Puper", "info");
    }
  }
  sessionStorage.setItem("firstPageLoad", true);
}

function setUserItemsNav() {
  let username = $(".userNameNav");
  let saldo = $(".userSaldo");
  let subscriptionNav = $(".userSubscription");
  let switchNav = $(".navSwitch")
  let authNav = $(".authNav");

  //Clear nav dropdown box
  subscriptionNav.html("");
  saldo.html("");

  if (user) {
    console.log(user);
    username.html(`<i class="bi bi-person-square"></i>  ` + user.fullName);
    saldo.append(`<i class="bi bi-clock"></i>  ` + user.saldo + " uur");
    for (i in user.subscriptions) {
      let subscription = user.subscriptions[i];
      if (subscription) {
        if (subscription == "Video") {
          subscriptionNav.append(`<div class='row'><div class='col-md-3'><i class="bi bi-camera-video"></i></div  <div class='col-md-9'>` + subscription + `</div></div>`);
        } else if (subscription == "Podcast") {
          subscriptionNav.append(`<div class='row'><div class='col-md-3'><i class="bi bi-mic"></i></div  <div class='col-md-9'>` + subscription + `</div></div>`);
        } else {
          subscriptionNav.append(`<div class='row'><div class='col-md-3'><i class="bi bi-camera-video"></i> <i class="bi bi-mic"></i></div>  <div class='col-md-9'>` + subscription + `</div></div>`);
        }
      }
    }
  } else {
    username.remove();
    saldo.remove();
    authNav.remove();
    switchNav.after(`<a class="dropdown-item" href="/login"><i class="bi bi-box-arrow-in-right"></i> Inloggen</a>`);
    switchNav.remove();
  }
}
function createToolTip(item, title, position) {
  item.attr({
    "data-toggle": "tooltip",
    "data-placement": position,
    "title": title
  })
  // data-toggle="tooltip" data-placement="top" title="Tooltip on top"
}
// Error message : give the class "errorBox" to activate ->
// $(".errorBox").on("click", function () {
//   $(".errorBox").slideUp(300);
// });

function errorText(errMessage) {
  $(".errorBox").html(errMessage);
  $(".errorBox").slideDown(400);
  setTimeout(function () {
    $(".errorBox").slideUp(400);
  }, 3000)
}
// Show loader 
function loader(state) {
  if (state) {
    $(".loader").css("display", "block");
  } else {
    $(".loader").css("display", "none");
  }
}
function checkLogin() {
  if (cookie) {
    return true;
  } else {
    return false;
  }
}

// Date Time formatter  ->
// Call the function with .time to get time 
// Call the function with .date to get the date
function dateFormat(data) {
  let json = {}
  const dateObj = new Date(data);

  // Get time ->
  const time = new Date(dateObj.getTime() - (2 * 60 * 60 * 1000)).toLocaleTimeString("en-GB");

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

  var weekNumber = Math.ceil((currentDate.getDay() + days) / 7);
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
    if (!roleCheck()) {
      $("#" + id).addClass("showOrHide");
    }
  }

}

// Hide elements for none admins else show them ->
function showOrhideElements() {
  if (roleCheck()) {
    $(".hiding").css("display", "block");
    $(".subscribe").attr("disabled", true);
    $(".BuyNow").attr("disabled", true);
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
    position: 'top-right',
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
    if (res.status == 200) {
      allUsers = json;
    }
  } catch (err) {
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

function checkSessionSize(amountOfParticipants, maxAmountOfParticipants) {
  let threshold = maxAmountOfParticipants / 2;
  if (amountOfParticipants == maxAmountOfParticipants) {
    return "red";
  } else if (amountOfParticipants < threshold) {
    return "green";
  } else if (amountOfParticipants >= threshold) {
    return "orange";
  }
}
