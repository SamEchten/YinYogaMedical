$(async function () {
    baseUrl = window.location.pathname;
    var id = baseUrl.substring(baseUrl.lastIndexOf('/') + 1);
    setvideoPlayer(id);

    });

async function getVideoInfo(id){
    try {
        let res = await ApiCaller.getSingleVideo(id);
        let json = await res.json();
        return json;
    } catch(err) {
        console.log(err);
    }
}

async function setvideoPlayer(id) {
    let baseUrl = "https://localhost:80/api/video/stream/"
    let json = await getVideoInfo(id);
    console.log(json);
    let vidElement = $("<source src="+ baseUrl + json.videoPath +"></source>");
    $("#videoPlayer").append(vidElement);
    $("#videoPlayer").attr("poster", "/static/" + json.thumbnailPath);
    $(".videoTitle").text(json.title);
    $(".videoDescription").text(json.description)
}