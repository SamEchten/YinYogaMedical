function podcastTemplate(title, description, videoId) {
    let html = `
<div class="row podcastRow my-2">
   <div class="col-3 h-100 p-0 picture">
        <div id=${videoId} class="col-md videoThumbnail">
            <div class="row h-100 align-items-center">
                <div class="col-md text-center">
                    <i class="bi bi-file-lock2-fill lockIcon text-center"></i>
                </div> 
            </div>
        </div>
   </div>
   <div class="col-9 h-100">
        <div class="row">
            <h4 class="lead p-1 font-weight-bold">${title}</h4>
        </div>
        <div class="row">
            <div class="col-11">
                <p class="p-2"><small>${description}</small></p>
            </div>
            <div class="col-1">
                <i class="bi bi-pencil cursor editVideo"></i>
                 <i class="bi bi-trash cursor removeVideo"></i>
            </div>         
        </div>
   </div>
</div>

    `

    return html;
}

function editVideoDetails() {
    let html = `
    <div class="container">
        <div class="row">
            <div class="col">
                <h2>Wijzig video informatie</h2>
                <hr>
            </div>
        </div>
        <div class="row">
            <div class="col p3 text-start">
                <h3 class="lead lbs"><b>Titel</b></h3>
                <input id="videoTitle" contenteditable="true" class="form-control" type="text">
            </div>
        </div>
        <div class="row">
            <div class="col p-3 text-start">
                <h3 class="lead lbs"><b>Beschrijving</b></h3>
                <textarea id="videoDescription" class="form-control placeholder="Wijzig dit""></textarea>
            </div>
        </div>
    <div>
    `;

    return html;
}

function addVideoTemplate () {
    let html = `
    <hr>
    
    <div class="container">
        <div class="row">
            <div class="col-md">
                <form id="submitVid" name="submitVideo" class="row g-3">
                    <div class="col-md-6 text-start">
                        <label for="title" class="form-label lbs">Titel</label>
                        <input type="text" name="title" class="form-control" id="title">
                    </div>
                    <div class="col-md-6 text-start">
                        <label for="price" class="form-label lbs">Prijs</label>
                        <input type="number" name="price" class="form-control" id="price">
                    </div>
                    <div class="col-12 text-start">
                        <label for="description" class="form-label  lbs">Beschrijving</label>
                        <textarea type="textarea" name="description" class="form-control" id="description" placeholder="Beschrijving"></textarea>
                    </div>
                    <div class="col-12 text-start">
                        <label for="thumbnail" class="form-label lbs">Thumbnail</label>
                        <input type="file" name="thumbnail" accept=".png, .jpg, .jpeg" class="form-control" id="thumbnail" placeholder="">
                        <small id="" class="form-text text-muted">Drag and Drop</small>
                    </div>
                    <div class="col-12 text-start">
                        <label for="fileToInput" class="form-label lbs">Video</label>
                        <input type="file" name="media" accept=".mp4, .mov , .mp3" class="form-control" id="media" placeholder="">
                        <small id="fileSize" class="form-text text-muted">Drag and Drop</small>
                    </div>
                    <div class="col-12">
                        <button type="submit" id="submitVideo" class="btn btn-primary">Upload media</button>
                    </div>
                    <div class="col-12">
                        <div class="alert alert-warning close errorBox" role="alert">
                    </div>
                </form>
            <div>
        </div>
    </div>
    `
    return html
}