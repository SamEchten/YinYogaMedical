$(".loginButton").on("click", async function()
{
    const email = $(".emailInput").val();
    const password = $(".passwordsInput").val();
    
    const data = {email, password}

    try
    {
        const call = await ApiCaller.loginUser(data);
        if(call.status == 200) {
            console.log(call);
        } else {
            console.log(call);
        }
    }catch(err)
    {

    }
});