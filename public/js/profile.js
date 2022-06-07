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
            $("#accountPhoneNumber").html(``+ json.phoneNumber +`<i class="bi bi-pencil" onclick="changeInfo('phoneNumber')"></i>`);
        });
        // this.nameRow.innerHTML = '<p>'+ name +'<i class="bi bi-pencil" onclick="changeName()"></i></p>';
        // $(".")
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
        $(".settingsContent").load("profile/myPayments");
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
}

function acceptName(type) {
    if(type == "name"){
        let updatedName = $("#nameChange").val();
        console.log(updatedName);
    }
    else if(type == "email"){
        let updatedEmail = $("#changeEmail").val();
        console.log(updatedEmail);
    }
    else if(type == "phone"){
        let updatedPhone = $("#changePhoneNumber").val();
        console.log(updatedPhone);
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
    })
}

