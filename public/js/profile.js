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
    else if (this.id == "enrollments")
    {
        $(".settingsContent").load("profile/myEnrollments");
    }
})



function changeInfo(sort) {
    let name = user.fullName;
    let email = user.email;
    let phoneNumber = user.phoneNumber;
    console.log(sort);
    if(sort == "name"){
        $("#accountName").html(
            `<input id = "nameChange" type = "text" value = "` + name + `"> 
            <i class="bi bi-check-circle" onclick="acceptName('name')"></i>
            <i class="bi bi-x-circle" onclick="denyName(name)"></i>`
            )
    }else if(sort == "email"){
        $("#accountEmail").html(
            `<input id = "changeEmail" type = "text" value = "` + email + `"> 
            <i class="bi bi-check-circle" onclick="acceptName('email')"></i>
            <i class="bi bi-x-circle" onclick="denyName(email)"></i>`
            )
    }else if(sort == "phoneNumber"){
        $("#accountPhoneNumber").html(
            `<input id = "changePhoneNumber" type = "text" value = "` + phoneNumber + `"> 
            <i class="bi bi-check-circle" onclick="acceptName('phone')"></i>
            <i class="bi bi-x-circle" onclick="denyName(phone)"></i>`
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
        let updatedPhone = $("changePhoneNumber").val();
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

