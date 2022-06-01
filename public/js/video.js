$(async function () {
    console.log("video page");
  });

  
$(".addVideo").on("click", function() {
    addVideo();
});

function addVideo () {
    if(roleCheck()) {
        Swal.fire({
            title: 'Video toevoegen',
            html: `<form>
                <div class="form-group">
                <label for="exampleFormControlFile1">Example file input</label>
                <input type="file" class="form-control-file" id="exampleFormControlFile1">
                </div>
            </form>`,
            showCancelButton: true,
            text: "",
            confirmButtonColor: '#D5CA9B',
            confirmButtonText: 'Toevoegen',
            cancelButtonText: 'Terug'
          });
    }
}
