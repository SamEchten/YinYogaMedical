
let json = [
  {
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },
  {
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },
  {
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },
  {
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },{
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },{
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },{
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },{
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },
  {
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },
  {
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },{
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },{
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },{
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },
  {
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  },
  {
    "thumbnail" : "public/images/yoga.png",
    "title" : "Het eigen wijze lichaam",
    "description" : "dit is een mooie video" ,
  }
]
let videoIndex = 0;

$(async function () {
    displayVideos(videoIndex)
  });
  
$(".nextPage").on("click", function () {
  if (videoIndex < json.length / 4) {
    displayVideos(videoIndex)
  }
  
});
$(".prevPage").on("click", function() {
  if(videoIndex > 2) {
    displayVideos(videoIndex - 4)
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
            html: html,
            showCancelButton: true,
            text: "",
            confirmButtonColor: '#D5CA9B',
            confirmButtonText: 'Toevoegen',
            cancelButtonText: 'Terug'
          })
          $("test").on("click", function( ) {
            document.forms['sumbitVideo'].submit();
          })
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
      let element = videoTemplate(video.title, video.description);
      if(index == 0) {
        $(".videoRowTop").last().append(element);
      } else {
        $(".videoRowBottom").last().append(element);
      }
    }
  } 
}

// load items into the correct row 
// param: videoIndex -> the page you want to be on
function loadVideos (index) {
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