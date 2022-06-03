let json = [
  {
    "id" : "23452354234",
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "videodit is een mooie video" ,
  },
  {
    "id" : "23452354222",
    "thumbnail" : "public/images/bikini.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },
  {
    "id" : "2345232343444",
    "thumbnail" : "public/images/epic.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },
  {
    "id" : "234521512414234",
    "thumbnail" : "public/images/PLOT.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },{
    "id" : "234521231234354234",
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },{
    "id" : "234513212312354234",
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },{
    "id" : "2345235423567567",
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },{
    "id" : "267773452354234",
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },
  {
    "id" : "2377722452354234",
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
    
  },
  {
    "id" : "2345235467884",
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },{
    "id" : "2345907890",
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },{
    "id" : "234524354234",
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },{
    "id" : "234523511114234",
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },
  {
    "id" : "234523542311234",
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" 
  },
  {
    "id" : "234523542345466677",
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  }
]
let videoIndex = 0;

$(async function () {
  displayVideos(videoIndex)
  $(".page").text(videoIndex / 2);
  });
  
// load next videos on arrow click ->
$(".nextPage").on("click", function () {
  if (videoIndex < json.length / 4) {
    displayVideos(videoIndex)
    $(".page").text(videoIndex / 2);
  }
  
});

// load previous videos on arrow click ->
$(".prevPage").on("click", function() {
  if(videoIndex > 2) {
    displayVideos(videoIndex - 4);
    $(".page").text(videoIndex / 2);
  }
});

$(".addVideo").on("click", function() {
    addVideo();
});

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
          } else {
            errorText(json.message);
          }
        });
    }
}

// Append the videos to the correct DOM elements
function displayVideos (i) {
  $(".videoRowTop").empty();
  $(".videoRowBottom").empty();

  let videos = loadVideos(i);

  for(index in videos) {
    for(item in videos[index]) {
      let video = videos[index][item];
      let element = videoTemplate(video.title, video.description, video.id);
      if(index == 0) {
        $(".videoRowTop").last().append(element);
        addEventHandlers(video.bought, video.id);
        //$("#"+ video.id).css("background-image", "url(" + video.thumbnail+ ")");
      } else {
        $(".videoRowBottom").last().append(element);
        addEventHandlers(video.bought, video.id);
        //$("#"+ video.id).css("background-image", "url(" + video.thumbnail+ ")");
      }
    }
  } 
  adminActions(); //add event handlers for admin action : edit ->
}

// load items into the correct row 
// param: videoIndex -> the page you want to be on
function loadVideos (index) {
  // await api call get all videos
  let array = sortVideoArray(json, 4);
  let videos = [array[index], array[index + 1]];
  videoIndex = index + 2;
  console.log(videos)
  return videos;
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
    $(".editVideo").on("click", function() {
     let id = $(this).parent().parent().parent().parent().parent().children(".videoIdRow").children().attr("id");
     Swal.fire({
        title: "you want to edit this video",
        text: id,
        showCancelButton: "true",
        icon: "info"
      });
    }); 

  }
}
function showAdminItems() {
  $(".editVideo").css("display", "block");
  $(".removeVideo").css("display", "block");
}

function addEventHandlers(bought, id) {
    if(bought || user.subscription == "videoAccess") { // click event user that bought video
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

function nonUserAction(id) {
  toastPopUp("log eerst in voordat u de video koopt", "info");
}

function userActionBought(id) {
  toastPopUp("Go to the video page","success")
}

function userActionBuy(id) {
  toastPopUp("GO to buy page","success")
}


