$(".registerButton").on("click", async function()
{
    const fullName = $(".nameInput").val();
    const email = $(".emailInput").val();
    const phoneNumber = $(".phoneInput").val();
    const password = $(".passwordInput").val();
    const notes = $(".notesInput").val();

    const data = {fullName, email, phoneNumber, password, notes}

    
    try
    {
        const call = await ApiCaller.registerUser(data);
        if(call.status == 200) {
            console.log(call);
        } else {
            console.log(call);
        }
    }catch(err)
    {

    }
});

