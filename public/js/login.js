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
            console.log("logged in")
            $(".imageHolder").slideUp(400);
            $(".loginContent").slideUp(400, function()
            {
                // Go to home/lesrooster
                location.href = "/home";
            });
        
        } else 
        {
            res.json().then(function(result)
            {
                for(errorMessage in result)
                {
                    if(result[errorMessage] != null)
                    {
                        errorText(result[errorMessage])
                        return;
                    } 
                }
            });  
        }
    } catch(err)
    {
        
    }
});