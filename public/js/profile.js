//click on nav and change the content
$(".setting").on("click", function () {
    $(".settingsContent").empty();
    if (this.id == "profiel")
    {
        $(".settingsContent").load("profile/myProfile");
    }
    else if (this.id == "product")
    {
        $(".settingsContent").load("profile/myPoducts");
    }
    else if (this.id == "enrollments")
    {
        $(".settingsContent").load("profile/myEnrollments");
    }
})
// Render lesrooster from apiCaller and format it on date ->
// $(async function () {
//     setWeekData(weekNumb);
//     const res = await (await ApiCaller.getAllSessions()).json();
//     schedule = res;
//     loadAgenda(weekNumb);
// });
// console.log()






function changeName() {

    let name = user.fullName;
    console.log(this.name)

    this.nameRow.innerHTML = `<input id = "nameChange" type = "text" value = "` + name + `"> 
                                <i class="bi bi-check-circle"onclick="acceptName()"></i>
                                <i class="bi bi-x-circle" onclick="denyName()"></i>`
}

// function acceptName() {
//     let updatedName = document.getElementById("nameChange").value;
//     try
//     {
//         let res = await ApiCaller.getSingleSession(sessionId); // Get all the infomation from the session
//         let json = await res.json();
//         Swal.fire({
//             title: "Uw naam is geupdate naar " + updatedName,
//             icon: 'succes',
//             showCloseButton: true,
//             confirmButtonColor: '#D5CA9B'
//         });
//         $(".settingsContent").empty();
//         $(".settingsContent").load("profile/myProfile");
//     }
//     catch {

//     }
// }

// function denyName() {
//         $(".settingsContent").empty();
//         $(".settingsContent").load("profile/myProfile");
//     }

