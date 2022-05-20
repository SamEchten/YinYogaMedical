$(".setting").on("click", function () {
    $(".settingsContent").empty();
    // $(".settingsContent").append("<h1>" + this.id + "</h1>");
    // $.get("profile/myProfile.ejs", function (data) {
    //     $(this).children("div:first").html(data);
    // });
    if (this.id == "profiel")
    {
        console.log('works');
        $(".settingsContent").load("./profile/myProfile.ejs");
    }
})