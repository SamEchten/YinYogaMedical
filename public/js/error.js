$(".errorBox").on("click", function()
{
    $(".errorBox").slideUp(300);
});

function errorText(errMessage)
{
    $(".errorBox").html(errMessage);
    $(".errorBox").slideDown(200);
}