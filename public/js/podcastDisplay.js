$(async function () {
    baseUrl = window.location.pathname;
    var id = baseUrl.substring(baseUrl.lastIndexOf('/') + 1);
    setvideoPlayer(id);
    await loadSuggestedVideos();
});

async function getVideoInfo(id){
    try {
        let res = await ApiCaller.getSinglePodcast(id);
        let json = await res.json();
        return json;
    } catch(err) {
        console.log(err);
    }
}

async function setvideoPlayer(id) {
    let baseUrl = "https://localhost:80/api/podcast/stream/"
    let json = await getVideoInfo(id);
    let videoSrc = baseUrl + json.podcastPath + "/" + user.id;
    let vidElement = $(`<source src='${videoSrc}'>`);
    $("#videoPlayer").append(vidElement);
    //$("#videoPlayer").attr("poster", "/static/" + json.thumbnailPath);
    $(".videoTitle").text(json.title);
    $(".videoDescription").text(json.description)
}

async function loadSuggestedVideos () {
    let allVideos = await getAllVideos();
    let randomVid = shuffleArray(allVideos);
    if(randomVid.length >= 3) {
        for(let i = 0; i < 17; i++){
            let randomVideo = randomVid[i];
            if(randomVideo == undefined){

            }else {
                displaySuggestedVideos(randomVideo);
            }
        }
    } else {
        for(items in randomVid) {
            console.log("less than 3 vids");
        }
    }
    console.log(allVideos.length)
}


function displaySuggestedVideos (data) {
    let id = data.id;
    let title = data.title;
    let description = data.description;
    let thumbnailPath = data.thumbnailPath;
    let videoPath = data.videoPath;

    let element = getSuggestedVidElement(id, title);

    $(".suggestedVideos").append(element);
    $(`#${id}`).find(".smallThumbnailItem").css("background-image", "url(/static/"+ thumbnailPath + ")");
    suggestedVideosEventHandlers(id)

}

function suggestedVideosEventHandlers(id) {
    $(`#${id}`).on("click", function() {
        location.href = "/videos/" + id;
    });
}

function getSuggestedVidElement(id, title)  {
    return `<div id="${id}"class="row cursor align-items-center smallVid">
                <div class="col-md-12 h-100 smallVidItem">
                <div class="row h-100 d4">
                    <div class="col-md-5 smallThumbnailItem">
                        <div class="row h-100 text-center align-items-center">
                            <i class="playIcon bi bi-play-circle"></i>
                        </div>
                    </div>
                    <div class="col-md-7 lead">
                        ${title}
                        <p class="text-start copyright">
                        <small>
                            By Natascha Puper ©
                        </small>
                        </p>
                    </div>
                </div>
                </div>
            </div>`
}
// Get all videos
async function getAllVideos() {
    let res = await ApiCaller.getAllVideos();
    let json = await res.json();

    return json;
}