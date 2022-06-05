let allVideos;
let videoIndex = 0;

$(async function () {
  await setAllVideosObject();
  await displayVideos(videoIndex);
  $(".page").text(videoIndex / 2);

  });
  
// load next videos on arrow click ->
$(".nextPage").on("click", async function () {
  if (videoIndex < allVideos.length / 4) {
    await displayVideos(videoIndex);
    $(".page").text(videoIndex / 2);
  }
});

// load previous videos on arrow click ->
$(".prevPage").on("click", async function() {
  if(videoIndex > 2) {
    await displayVideos(videoIndex - 4);
    $(".page").text(videoIndex / 2);
  }
});

$(".addVideo").on("click", function() {
    addVideo();
});
// Add a video as admin 
function addVideo () {
  let html = addVideoTemplate();
  if(roleCheck()) {
      Swal.fire({
          title: 'Video toevoegen',
          text: "Voeg hier een video of podcast toe met daarbij een thumbnail.",
          html: html,
          showCancelButton: false,
          showConfirmButton: false,
          
        });

      $("#submitVid").on("submit", async function(e) {
        e.preventDefault();

        const res = await ApiCaller.uploadVideo(new FormData($("#submitVid").get(0)));
        const json = await res.json();

        if(res.status == 200) {
          toastPopUp(json.message, "success");
          await displayVideos(videoIndex);
        } else {
          errorText(json.message);
        }
      });
  }
}

// Append the videos to the correct DOM elements
async function displayVideos (i) {
  $(".vidBot").empty();
  $(".vidTop").empty();
  videoIndex = 0;
  let videos = await loadVideos(i);
  if(videos == false){
    $(".vidTop").html(`<div class="col-md text-center"><h2 class="lead">Geen video's beschikbaar</h2></div>`);
  } else {
    for(index in videos) {
      for(item in videos[index]) {
        let video = videos[index][item];
        let element = videoTemplate(video.title, video.description, video.id);
        if(index == 0) {
          $(".vidTop").last().append(element);
          addEventHandlers(video.bought, video.id);
          //$("#"+ video.id).append(`<img src="static/${video.thumbnailPath}" width="100%" height="100%">`);
        } else {
          $(".vidBot").last().append(element);
          addEventHandlers(video.bought, video.id);
          //$("#"+ video.id).append(`<img src="static/${video.thumbnailPath}" width="100%" height="100%">`);
        }
      }
    } 
    //add event handlers for admin action : edit ->
    adminActions();
    }
}

// load items into the correct row 
// param: videoIndex -> the page you want to be on
async function loadVideos (index){
  // await api call get all videos
  await setAllVideosObject();
  if(allVideos.length == 0) {
      return false;
    } else {
      let array = sortVideoArray(allVideos, 4);
      let videos = [array[index], array[index + 1]];
      videoIndex = index + 2;
      return videos;
  }
}

// Sorts array into 4 chunks each
function sortVideoArray(array, chunkSize) {
  const res = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;

}
function adminActions() {
  if(roleCheck()) {
    showAdminItems();// show admin items ->

    // Edit video as ADMIN ->
    $(".editVideo").on("click", function() {
      let html = editVideoDetails();
      let id = $(this).parent().parent().parent().parent().parent().children(".videoIdRow").children().attr("id");
      Swal.fire({
          confirmButtonText: "Wijzig video",
          html: html,
          confirmButtonColor: '#D5CA9B',
          showCancelButton: "true",
          cancenlButtonText: "Terug"
        });
      }); 
    // Remove video as ADMIN ->
    $(".removeVideo").on("click", function() {
      let id = $(this).parent().parent().parent().parent().parent().children(".videoIdRow").children().attr("id");
      Swal.fire({
          title: "Weet u zeker dat u deze video wilt verwijderen",
          text: "Bij het permanent verwijderen van deze video zal de video ook van de server verwijderd worden.",
          icon: "warning" ,
          confirmButtonColor: '#D5CA9B',
          showCancelButton: "true",
          confirmButtonText: "Verwijder video",
          cancelButtonText: "Terug"
        }).then(async (result) => {
          if(result.isConfirmed) {
            let res = await ApiCaller.deleteVideo(id);
            let json = await res.json();
            if(res.status == 200) {
              toastPopUp(json.message, "success");
              await displayVideos(videoIndex);
            } else {
              toastPopUp(json.message, "warning");
            }
          } else {
            toastPopUp("Video niet verwijderd", "info")
          }
        });
      }); 

  }
}
function showAdminItems() {
  $(".editVideo").css("display", "block");
  $(".removeVideo").css("display", "block");
}

function addEventHandlers(bought, id) {
    if(bought) { // click event user that bought video || user.subscription == "videoAccess"
      $("#" + id).addClass("bought");
      $("#" + id).children().remove();
      $("#" + id).parent().parent().find(".videoInfo").children("h4").append(`<i class="bi bi-unlock unlockIcon"></i>`);
      $("#" + id).on("click", function() {
        userActionBought(id);
      });
    } else if(roleCheck()) { // click event admin
      $("#" + id).addClass("bought");
      $("#" + id).children().remove();
      $("#" + id).on("click", function() {
        userActionBought(id);
      });
    } else if(user == undefined) {
      $("#" + id).on("click", function() {
        nonUserAction(id);
      }) 
    } else {
      $("#" + id).on("click", function() {
        userActionBuy(id);
      });
    }
}

async function setAllVideosObject() {
  let res =  await ApiCaller.getAllVideos();
  let json = await res.json();
  allVideos = json;

}

function nonUserAction(id) {
  //toastPopUp("log eerst in voordat u de video koopt", "info");
  Swal.fire({
    title: 'Inloggen',
    text: "Log in om de video te kopen of te bekijken met een van onze abonnementen!",
    icon: "info",
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText : "Login"
    
  }).then((result) => {
    if(result.isConfirmed) {
      location.href = "/login";
    }
  });
}

function userActionBought(id) {
  toastPopUp("Go to the video page","success")
}

// ! FEATURE NOT IMPLEMENTED !
function userActionBuy(id) {
  toastPopUp("GO to buy page","success")
  location.href = "/products";
}


