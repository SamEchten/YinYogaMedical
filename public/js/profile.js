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

