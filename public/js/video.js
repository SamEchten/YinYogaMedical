$(async function () {
    console.log("video page");
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
