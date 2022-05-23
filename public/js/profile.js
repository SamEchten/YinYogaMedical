$(".setting").on("click", function () {
    $(".settingsContent").empty();
    // $(".settingsContent").append("<h1>" + this.id + "</h1>");
    // $.get("profile/myProfile.ejs", function (data) {
    //     $(this).children("div:first").html(data);
    // });
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