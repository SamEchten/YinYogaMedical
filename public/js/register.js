$(".registerButton").on("click", async function()
{
    const data = 
    {
        fullName: $(".nameInput").val(),
        email: $(".emailInput").val(),
        phoneNumber: $(".phoneInput").val(),
        password: $(".passwordInput").val(),
        notes: $(".notesInput").val()
    }

    
    try
    {
        const res = await ApiCaller.registerUser(data);
        if(res.status == 200) {
            console.log(res);
        } else {
            console.log(res);
        }
    }catch(err)
    {

    }
});

