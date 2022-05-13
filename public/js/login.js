$(".loginButton").on("click", async function()
{
    const data = 
    {
        email: $(".emailInput").val(),
        password: $(".passwordInput").val()
    }

    try
    {
        const res = await ApiCaller.loginUser(data);
        if(res.status == 200) 
        {

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
    } catch(err)
    {
        
    }
});