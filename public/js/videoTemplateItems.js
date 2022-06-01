function addVideoTemplate () {
    let html = `
    <hr>
    <div class="container">
        <div class="row">
            <div class="col-md">
                <form name="submitVideo" action="/api/mediaUpload" method="post" enctype="multipart/form-data" class="row g-3">
                <button class="test">dasda</button>
                    <div class="col-md-6">
                        <label for="title" class="form-label">Title</label>
                        <input type="text" class="form-control" id="title">
                    </div>
                    <div class="col-md-6">
                        <label for="price" class="form-label">Price</label>
                        <input type="text" class="form-control" id="price">
                    </div>
                    <div class="col-12">
                        <label for="description" class="form-label">Beschrijving</label>
                        <textarea type="textarea" class="form-control" id="description" placeholder="Beschrijving"></textarea>
                    </div>
                    <div class="col-12">
                        <label for="thumbnail" class="form-label">Thumbnail</label>
                        <input type="file" class="form-control" id="fileToUpload" placeholder="">
                    </div>
                    <div class="col-12">
                        <label for="fileToInput" class="form-label">Video</label>
                        <input type="file" class="form-control" id="fileToUpload" placeholder="">
                    </div>
                </form>
            <div>
        </div>
    </div>
    `
    // name = fileToUpload
    // thumbnail
    // title 
    // price 
    // discription

    return html
}