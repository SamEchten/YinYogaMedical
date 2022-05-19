$(".registerButton").on("click", async function () {
    const data =
    {
        fullName: $(".nameInput").val(),
        email: $(".emailInput").val(),
        phoneNumber: $(".phoneInput").val(),
        password: $(".passwordInput").val(),
        notes: $(".notesInput").val()
    }

    try {
        if (data.password != $(".vPasswordInput").val()) {
            errorText("Wachtwoorden komen niet over een.")
        } else {
            const res = await ApiCaller.registerUser(data);
            console.log(res.status)
            if (res.status == 201) {
                // User goes to the home page and is logged in ->
                location.href = "/home";
            } else {
                // Handling promise object to get the JSON object ->
                res.json().then(function (result) {
                    for (errorMessage in result) {
                        if (result[errorMessage] != null) {
                            errorText(result[errorMessage])
                            return;
                        }
                    }
                });
            }
        }
    } catch (err) {

    }
});

// Show password or not ->
$(".passIcon").on("click", function () {
    let type = $(".passwordInput").attr("type");
    if (type == "password") {
        $(".pass").attr("type", "text");
    } else {
        $(".pass").attr("type", "password");
    }
});