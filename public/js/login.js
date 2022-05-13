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
        if(res.status == 200) {
            console.log(res);
        } else {
            console.log(res);
        }
    } catch(err)
    {
        
    }
});