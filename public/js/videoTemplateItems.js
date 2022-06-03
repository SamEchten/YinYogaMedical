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
                    </div>
                    <div class="col-12 text-start">
                        <label for="fileToInput" class="form-label lbs">Video</label>
                        <input type="file" name="media" accept=".mp4, .mov , .mp3" class="form-control" id="media" placeholder="">
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

function videoTemplate (title, description, videoId) {
    let html = `
    <div class="col-md-3 slide-in-fwd-center test h-100 p-4">
        <div class="row h-60 videoIdRow ">
            <div id=${videoId} class="col-md videoThumbnail">
                <div class="row h-100 align-items-center">
                    <div class="col-md text-center">
                        <i class="bi bi-file-lock2-fill lockIcon text-center"></i>
                    </div> 
                </div>
                
            </div>
        </div>
        <div class="row h-40">
            <div class="col-md videoInfo">
                <div class="row">
                    <div class="col-md">
                        <h4 class="lead p-1 font-weight-bold">${title}</h4>
                        <hr class="m-0">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md">
                        <p class="p-2"><small>${description}</small></p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <i class="bi bi-pencil cursor text-center editVideo"></i>
                    </div>
                    <div class="col-md-6 text-center">
                        <i class="bi bi-trash cursor  removeVideo"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `

    return html;
}