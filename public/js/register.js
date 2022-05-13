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
        if(data.password != $(".vPasswordInput").val())
        {
            errorText("Wachtwoorden komen niet over een.")
        }else
        {
            const res = await ApiCaller.registerUser(data);
            if(res.status == 200) {
                console.log(res);
            } else 
            {
                for(errorMessage in res)
                {
                    if(res[errorMessage] != null)
                    {
                        errorText(res[errorMessage])
                        return;
                    } 
                }
            }
        }
    } catch(err)
    {

    }
});

