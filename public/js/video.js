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
  if(isAdmin()) {
      Swal.fire({
          title: 'Video toevoegen',
          text: "Voeg hier een video of podcast toe met daarbij een thumbnail.",
          html: html,
          showCancelButton: false,
          showConfirmButton: false,
          
        });
      $("#media").on("change", function() {
        let size = Math.round(this.files[0].size / 1024 / 1024);
        if(size > 500) {
          $("#fileSize").text("Bestandsgrootte : " + size + " MB");
          $("#fileSize").addClass("failedColor").removeClass("text-muted");
        } else {
          $("#fileSize").text("Bestandsgrootte : " + size + " MB");
          
          $("#fileSize").addClass("successColor").removeClass("text-muted");
        }
        
      });
      $("#submitVid").on("submit", async function(e) {
        e.preventDefault();
        $("#submitVideo").addClass("disabled");
        loader(true);
        const res = await ApiCaller.uploadVideo(new FormData($("#submitVid").get(0)));
        const json = await res.json();
        loader(false);
        $("#submitVideo").removeClass("disabled");
        if(res.status == 200) {
          toastPopUp(json.message, "success");
          displayVideos(0);
        } else {
          errorText(json.message);
        }
      });
  }
}

// Append the videos to the correct DOM elements
async function displayVideos (i) {
  loader(true);
  $(".page").text(videoIndex);
  $(".vidBot").empty();
  $(".vidTop").empty();
  let videos = await loadVideos(i);
  console.log(videos)
  if(videos == false){
    $(".vidTop").html(`<div class="col-md text-center"><h2 class="lead">Geen video's beschikbaar</h2></div>`);
    if(isAdmin()) {
      $(".addVideo").css("display", "block");
    }
    loader(false);
  } else {
    for(index in videos) {
      for(item in videos[index]) {
        let video = videos[index][item];
        let element = videoTemplate(video.title, video.description, video.id);
        if(index == 0) {
          $(".vidTop").last().append(element);
          addEventHandlers(video.bought, video.id);
          $("#"+ video.id).css("background-image", "url(/static/"+ video.thumbnailPath + ")");
        } else {
          $(".vidBot").last().append(element);
          addEventHandlers(video.bought, video.id);
          $("#"+ video.id).css("background-image", "url(/static/"+ video.thumbnailPath + ")");
        }
      }
    } 
    //add event handlers for admin action : edit ->
    adminActions();
    loader(false);
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
  if(isAdmin()) {
    showAdminItems();// show admin items ->

    // Edit video as ADMIN ->
    $(".editVideo").on("click", async function() {
      let html = editVideoDetails();
      let id = $(this).parent().parent().parent().parent().parent().children(".videoIdRow").children().attr("id");
      let res = await ApiCaller.getSingleVideo(id);
      let json = await res.json();
      
      Swal.fire({
          confirmButtonText: "Wijzig video",
          html: html,
          confirmButtonColor: '#D5CA9B',
          showCancelButton: "true",
          cancenlButtonText: "Terug",
          preConfirm: async() => {
              let body = {title: $("#videoTitle").val(),description: $("#videoDescription").val()}
              let resUpdate = await ApiCaller.updateVideo(id, body);
              let jsonUpdate = await resUpdate.json();
              if(resUpdate.status = 200){
                toastPopUp("Video gewijziged", "success");
                displayVideos(0)
              } else {
                toastPopUp(jsonUpdate.message);
              }
            } 
        });

        if(res.status == 200) {
          $("#videoTitle").val(json.title);
          $("#videoDescription").val(json.description);
        }
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
              displayVideos(0);
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
  $(".addVideo").css("display", "block");
}

function addEventHandlers(bought, id) {
  if(user){
    if(user.subscriptions.length > 0) { 
      // click event user that bought video || user.subscription == "videoAccess"
      if(user.subscriptions[0].description == "Video") {
        $("#" + id).addClass("bought");
        $("#" + id).children().remove();
        $("#" + id).parent().parent().find(".videoInfo").children("h4").append(`<i class="bi bi-unlock unlockIcon"></i>`);
        $("#" + id).on("click", function() {
          userActionBought(id);
        });
      }
    } else if(isAdmin()) { // click event admin
      $("#" + id).addClass("bought");
      $("#" + id).children().remove();
      $("#" + id).on("click", function() {
        userActionBought(id);
      }); 
    } else {
      $("#" + id).on("click", function() {
        userActionBuy(id);
      });
    }
  } else {
      $("#" + id).on("click", function() {
        nonUserAction(id);
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
  location.href = "videos/" + id; 
}

// ! FEATURE NOT IMPLEMENTED !
function userActionBuy(id) {
  toastPopUp("GO to buy page","success")
  location.href = "/products";
}


