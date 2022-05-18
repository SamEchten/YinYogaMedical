
$('#subscribe').on("click", function(){
  Swal.fire({
    html: 
    '<h2>Inschrijven</h2>' +
    '<p>U wilt u inschrijven voor (les).</p>' +
    '<p><b> Hoeveel personen wilt u inschrijven?</b></p>' +
    '<input id="swal-input1" class="swal2-input" align="left" type="number" min="0">' +
    '<p><b>Vul hieronder de naam en het e-mailadres van deze personen in.</b></p>' +
    '<p><input id="swal-input2" class="swal2-input" type="text" placeholder="Naam">' +
    '<input id="swal-input2" class="swal2-input" type="text" placeholder="E-mailadres"></p>',
    customClass: 'sweetalert-subscribe',
    showCancelButton: true,
    confirmButtonText: 'Schrijf mij in',
    confirmButtonColor: '#D5CA9B',
    cancelButtonText: 'Cancel',
  })
})
