let allPodcasts;
let numberOfPodcastsShown = 0;
let videos;

$(async function () {
    //await setAllVideosObject();
    await displayVideos(0);
    //$(".page").text(videoIndex / 2);
});

// Append the videos to the correct DOM elements
async function displayVideos () {
    $(".contentRow").empty();
    let res =  await ApiCaller.getAllPodcasts();
    let json = await res.json();
    videos = json;
    console.log(videos)
    if(videos == false){
        $(".contentRow").html(`<div class="col-md text-center"><h2 class="lead">Geen video's beschikbaar</h2></div>`);
        if(roleCheck()) {
            $(".addVideo").css("display", "block");
        }
        //loader(false);
    } else {
        for(; numberOfPodcastsShown < 8 && numberOfPodcastsShown < videos.length; numberOfPodcastsShown++) {
            addAPodcast()
        }
        //add event handlers for admin action : edit ->
        //adminActions();
        //loader(false);
    }
    adminActions();
}

$(".scrollbar").scroll(function() {
    if($(".scrollbar").scrollTop()  + $(".scrollbar").height() >= $(".scrollbar").prop('scrollHeight') - 20) {
        for(let i = 0; i < 4 && numberOfPodcastsShown < videos.length; numberOfPodcastsShown++, i++)
            addAPodcast()
        if(roleCheck())
            showAdminItems()
    }
});

function addAPodcast()
{
    let video = videos[numberOfPodcastsShown];
    let element = podcastTemplate(video.title, video.description, video.id);
    $(".contentRow").last().append(element);
    addEventHandlers(video.bought, video.id);
    $("#"+ video.id).css("background-image", "url(/static/"+ video.thumbnailPath + ")")
}

function addEventHandlers(bought, id) {
    console.log(user.subscriptions)
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

function userActionBought(id) {
    toastPopUp("Go to the video page","success")
    location.href = "podcasts/" + id;
}

function adminActions() {
    if(roleCheck()) {
        showAdminItems();// show admin items ->

        // Edit video as ADMIN ->
        $(".editVideo").on("click", async function() {
            let html = editVideoDetails();
            let id = $(this).parent().parent().parent().parent().children(".picture").children().attr("id");
            let res = await ApiCaller.getSinglePodcast(id);
            let json = await res.json();

            Swal.fire({
                confirmButtonText: "Wijzig podcast",
                html: html,
                confirmButtonColor: '#D5CA9B',
                showCancelButton: "true",
                cancenlButtonText: "Terug",
                preConfirm: async() => {
                    let body = {title: $("#videoTitle").val(),description: $("#videoDescription").val()}
                    let resUpdate = await ApiCaller.updatePodcast(id, body);
                    let jsonUpdate = await resUpdate.json();
                    if(resUpdate.status = 200){
                        toastPopUp("Video gewijziged", "success");
                        window.location.reload();
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
            let id = $(this).parent().parent().parent().parent().children(".picture").children().attr("id");
            Swal.fire({
                title: "Weet u zeker dat u deze podcast wilt verwijderen",
                text: "Bij het permanent verwijderen van deze video zal de video ook van de server verwijderd worden.",
                icon: "warning" ,
                confirmButtonColor: '#D5CA9B',
                showCancelButton: "true",
                confirmButtonText: "Verwijder video",
                cancelButtonText: "Terug"
            }).then(async (result) => {
                if(result.isConfirmed) {
                    let res = await ApiCaller.deletePodcast(id);
                    let json = await res.json();
                    if(res.status == 200) {
                        toastPopUp(json.message, "success");
                        window.location.reload();
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

$(".addVideo").on("click", function() {
    addVideo();
});
// Add a video as admin
function addVideo() {
    let html = addVideoTemplate();
    if(roleCheck()) {
        Swal.fire({
            title: 'Podcast toevoegen',
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