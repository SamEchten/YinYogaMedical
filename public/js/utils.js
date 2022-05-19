// Error message : give the class "errorBox" to activate ->
$(".errorBox").on("click", function()
{
    $(".errorBox").slideUp(300);
});

function errorText(errMessage)
{
    $(".errorBox").html(errMessage);
    $(".errorBox").slideDown(200);
}

// Date Time formatter  ->
// Call the function with .time to get time 
// Call the function with .date to get the date
function dateFormat(data)
{   
    let json = {}
    const dateObj = new Date(data);
    
    // Get time ->
    const time = new Date(dateObj.getTime()).toLocaleTimeString("en-GB");

    // Get date ->
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    newDate = day + "/" + month + "/" + year;
    
    json.date = newDate;
    json.time = time.toString().slice(0, -3);

    return json;

}