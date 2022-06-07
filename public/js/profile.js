//click on nav and change the content
$(".setting").on("click", async function () {
    $(".settingsContent").empty();
    const userConst = await ApiCaller.getUserInfo(user.userId);
    const json = await userConst.json();
    console.log(json);
    if (this.id == "profiel")
    {
        
        $(".settingsContent").load("profile/myProfile", function (){
            $("#accountName").html(``+ json.fullName +`<i class="bi bi-pencil" onclick="changeInfo('name')"></i>`);
            $("#accountEmail").html(``+ json.email +`<i class="bi bi-pencil" onclick="changeInfo('email')"></i>`);
            $("#accountPhoneNumber").html(``+ json.phoneNumber +`<i class="bi bi-pencil" onclick=""></i>`);
            $("#notes").html(json.notes);
        });
    }
    else if (this.id == "product")
    {
        $(".settingsContent").load("profile/myPoducts");
    }
    else if(this.id == "abonnement")
    {
        $(".settingsContent").load("profile/mySubscription")
    }
    else if (this.id == "payment")
    {
        $(".settingsContent").load("profile/myPayments", async function(){
            //json something to array
            $("#paymentContent").html()
        });
    }
    else if(this.id == "settings") 
    {
        $(".settingsContent").load("profile/settings");
    }
})



async function changeInfo(sort) {
    const userConst = await ApiCaller.getUserInfo(user.userId);
    const json = await userConst.json();
    console.log(sort);
    if(sort == "name"){
        $("#accountName").html(
            `<input id = "nameChange" type = "text" value = "` + json.fullName + `"> 
            <i class="bi bi-check-circle" onclick="acceptName('name')"></i>
            <i class="bi bi-x-circle" onclick="denyName()"></i>`
            )
    }else if(sort == "email"){
        $("#accountEmail").html(
            `<input id = "changeEmail" type = "text" value = "` + json.email + `"> 
            <i class="bi bi-check-circle" onclick="acceptName('email')"></i>
            <i class="bi bi-x-circle" onclick="denyName()"></i>`
            )
    }else if(sort == "phoneNumber"){
        $("#accountPhoneNumber").html(
            `<input id = "changePhoneNumber" type = "text" value = "` + json.phoneNumber + `"> 
            <i class="bi bi-check-circle" onclick="acceptName('phone')"></i>
            <i class="bi bi-x-circle" onclick="denyName()"></i>`
            )
    }
    else if(sort == "notes")
    {
        $("#titleNotes").html(
            `<b>Notities 
            <i class="bi bi-check-circle" onclick="acceptName('notes')"></i>
            <i class="bi bi-x-circle" onclick="denyName()"></i></b>`
        );
        $("#notes").html(
            `<textarea id = "changeNotes" type = "text">`+ json.notes +`</textarea>`
        );
    }
}

async function acceptName(type) {
    if(type == "name"){
        let updatedName = $("#nameChange").val();
        console.log(updatedName);
        let json = {"fullName": updatedName}
        
        let res = await ApiCaller.updateUser(json, user.userId)
        console.log(user.userId);
        if(res.status == 200){
            console.log("succes");
            toastPopUp("Uw naam is geüpdate", "success");
        }else{
            console.log("pech");
        }
            
        const userConst = await ApiCaller.getUserInfo(user.userId);
        const jsonload = await userConst.json();
        console.log(jsonload);
        $(".settingsContent").empty();
        $(".settingsContent").load("profile/myProfile", function (){
            $("#accountName").html(``+ jsonload.fullName +`<i class="bi bi-pencil" onclick="changeInfo('name')"></i>`);
            $("#accountEmail").html(``+ jsonload.email +`<i class="bi bi-pencil" onclick="changeInfo('email')"></i>`);
            $("#accountPhoneNumber").html(``+ jsonload.phoneNumber +`<i class="bi bi-pencil" onclick="changeInfo('phoneNumber')"></i>`);
            $("#titleNotes").html(`<b>Notities <i class="bi bi-pencil" onclick="changeInfo('notes')"></i></b>`);
            $("#notes").html(json.notes);
        })
    }
    else if(type == "email"){
        let updatedEmail = $("#changeEmail").val();
        console.log(updatedEmail);
        
        let json = {"email": updatedEmail}
        
        let res = await ApiCaller.updateUser(json, user.userId)
        console.log(user.userId);
        if(res.status == 200){
            console.log("succes");
            toastPopUp("Uw email is geüpdate", "success");
        }else{
            console.log("pech");
        }    
        const userConst = await ApiCaller.getUserInfo(user.userId);
        const jsonload = await userConst.json();
        console.log(jsonload);
        $(".settingsContent").empty();
        $(".settingsContent").load("profile/myProfile", function (){
            $("#accountName").html(``+ jsonload.fullName +`<i class="bi bi-pencil" onclick="changeInfo('name')"></i>`);
            $("#accountEmail").html(``+ jsonload.email +`<i class="bi bi-pencil" onclick="changeInfo('email')"></i>`);
            $("#accountPhoneNumber").html(``+ jsonload.phoneNumber +`<i class="bi bi-pencil" onclick="changeInfo('phoneNumber')"></i>`);
            $("#titleNotes").html(`<b>Notities <i class="bi bi-pencil" onclick="changeInfo('notes')"></i></b>`);
            $("#notes").html(json.notes);
        })
    }
    else if(type == "phone"){
        let updatedPhone = $("#changePhoneNumber").val();
        console.log(updatedPhone);
        
        let json = {"phoneNumber": updatedPhone}
        
        let res = await ApiCaller.updateUser(json, user.userId)
        console.log(user.userId);
        if(res.status == 200){
            console.log("succes");
            toastPopUp("Uw telefoonnummer is geüpdate", "success");
        }else{
            console.log("pech");
        }    
        const userConst = await ApiCaller.getUserInfo(user.userId);
        const jsonload = await userConst.json();
        console.log(jsonload);
        $(".settingsContent").empty();
        $(".settingsContent").load("profile/myProfile", function (){
            $("#accountName").html(``+ jsonload.fullName +`<i class="bi bi-pencil" onclick="changeInfo('name')"></i>`);
            $("#accountEmail").html(``+ jsonload.email +`<i class="bi bi-pencil" onclick="changeInfo('email')"></i>`);
            $("#accountPhoneNumber").html(``+ jsonload.phoneNumber +`<i class="bi bi-pencil" onclick="changeInfo('phoneNumber')"></i>`);
            $("#titleNotes").html(`<b>Notities <i class="bi bi-pencil" onclick="changeInfo('notes')"></i></b>`);
            $("#notes").html(json.notes);
        })
    }
    else if(type == "notes"){
        let updatedNotes = $("#changeNotes").val();
        console.log(updatedNotes);
        
        let json = {"notes": updatedNotes}
        
        let res = await ApiCaller.updateUser(json, user.userId)
        console.log(user.userId);
        if(res.status == 200){
            console.log("succes");
            toastPopUp("Uw notities zijn geüpdate", "success");
        }else{
            console.log("pech");
        }    
        const userConst = await ApiCaller.getUserInfo(user.userId);
        const jsonload = await userConst.json();
        console.log(jsonload);
        $(".settingsContent").empty();
        $(".settingsContent").load("profile/myProfile", function (){
            $("#accountName").html(``+ jsonload.fullName +`<i class="bi bi-pencil" onclick="changeInfo('name')"></i>`);
            $("#accountEmail").html(``+ jsonload.email +`<i class="bi bi-pencil" onclick="changeInfo('email')"></i>`);
            $("#accountPhoneNumber").html(``+ jsonload.phoneNumber +`<i class="bi bi-pencil" onclick="changeInfo('phoneNumber')"></i>`);
            $("#titleNotes").html(`<b>Notities <i class="bi bi-pencil" onclick="changeInfo('notes')"></i></b>`);
            $("#notes").html(json.notes);
        })
    }
}

async function denyName() {
    const userConst = await ApiCaller.getUserInfo(user.userId);
    const json = await userConst.json();
    console.log(json);
    $(".settingsContent").empty();
    $(".settingsContent").load("profile/myProfile", function (){
        $("#accountName").html(``+ json.fullName +`<i class="bi bi-pencil" onclick="changeInfo('name')"></i>`);
        $("#accountEmail").html(``+ json.email +`<i class="bi bi-pencil" onclick="changeInfo('email')"></i>`);
        $("#accountPhoneNumber").html(``+ json.phoneNumber +`<i class="bi bi-pencil" onclick="changeInfo('phoneNumber')"></i>`);
        $("#titleNotes").html(`<b>Notities <i class="bi bi-pencil" onclick="changeInfo('notes')"></i></b>`);
        $("#notes").html(json.notes);
    
    })
}

