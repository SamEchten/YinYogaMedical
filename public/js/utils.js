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

};


function getfirstAndlastDatesOfTheWeek(year, week)
{
    firstDay = new Date(year, 0, 1).getDay();
    var d = new Date("Jan 01, " + year + " 01:00:00");
    var w = d.getTime() - (3600000 * 24 * (firstDay - 1)) + 604800000 * (week)
    var firstDay = new Date(w);
    var lastDay = new Date(w + 518400000)

    return {
        firstDay: firstDay.toLocaleDateString("en-GB"),
        lastDay: lastDay.toLocaleDateString("en-GB")
    }
}
    