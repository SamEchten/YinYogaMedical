$(".setting").on("click", function () {
    console.log(this.id);
    $(".settingsContent").empty();
    $(".settingsContent").append("<h1>" + this.id + "</h1>");

})