$(".settingsContent").ready(async function (){
    const userConst = await ApiCaller.getUserInfo(user.id);
    const json = await userConst.json();
    $(".settingsContent").load("profile/myProfile", function (){
        $("#accountName").html(``+ json.fullName +`<i class="bi bi-pencil" onclick="changeInfo('name')"></i>`);
        $("#accountEmail").html(``+ json.email +`<i class="bi bi-pencil" onclick="changeInfo('email')"></i>`);
        $("#accountPhoneNumber").html(``+ json.phoneNumber +`<i class="bi bi-pencil" onclick="changeInfo('phoneNumber')"></i>`);
        $("#notes").html(json.notes);
    });
});

//click on nav and change the content
$(".setting").on("click", async function () {
    $(".settingsContent").empty();
    const userConst = await ApiCaller.getUserInfo(user.id);
    const json = await userConst.json();
    const payments = await ApiCaller.paymentHistory(user.id);
    const jsonPayment = await payments.json();
    console.log(json);
    let allBoughtItems = "";
    if (this.id == "profiel")
    {
        $(".settingsContent").load("profile/myProfile", function (){
            $("#accountName").html(``+ json.fullName +`<i class="bi bi-pencil" onclick="changeInfo('name')"></i>`);
            $("#accountEmail").html(``+ json.email +`<i class="bi bi-pencil" onclick="changeInfo('email')"></i>`);
            $("#accountPhoneNumber").html(``+ json.phoneNumber +`<i class="bi bi-pencil" onclick="changeInfo('phoneNumber')"></i>`);
            $("#notes").html(json.notes);
        });
    }
    else if (this.id == "product")
    {
        $(".settingsContent").load("profile/myPoducts", function(){
            if(json.saldo == 0)
            {
                $(".showHours").html(`
                <div class="col-md-12">
                <p>Momenteel heeft u <b>geen</b> uren.</p>
                </div>`)
            }
            else if(json.saldo < 2 && json.saldo > 0)
            {
                $(".showHours").html(`
                <div class="col-md-12">
                <p>Momenteel heeft u <b>`+ json.saldo +`</b> uur</p>
                </div>`)
            }
            else
            {
                $(".showHours").html(`
                <div class="col-md-12">
                <p>Momenteel heeft u <b>`+ json.saldo +`</b> uren</p>
                </div>`)
            }
            console.log(jsonPayment.products[1]);
            for(i = 0; i < jsonPayment.products.length; i++)
            {
                const product = jsonPayment.products[i];
                const date = new Date(product.paidAt);
                const month = date.getMonth()+1;
                allBoughtItems += ` <div class='row'>
                                        <div class='col-md-5'>
                                            <p class='m-0'>
                                                Product '`+ jsonPayment.products[i].description +`' gekocht voor &euro;`+ jsonPayment.products[i].amount.value +`
                                            </p>
                                        </div>
                                        <div class='col-md-7'>
                                            <p class='m-0'> 
                                                
                                            </p>
                                        </div>
                                    </div>
                                    <div class='row'>
                                        <div class='col=md-12 pb-3'>
                                            <p class='fontSizeText'>Gekocht op: 
                                            <i>
                                                `+ date.getDate() +`-`+ month +`-`+ date.getFullYear() +`
                                            </i>
                                            </p>
                                        </div>
                                    </div>`
            }
            $(".showPaymentHistory").html(allBoughtItems);
        });
    }
        else if(this.id == "abonnement")
        {
            const subscriptions = []
            let multipleSubscriptions = "";
            for(i = 0; i < json.subscriptions.length; i++)
            {
                subscriptions.push(json.subscriptions[i].description+ ' ');
                multipleSubscriptions += `<li>`+ json.subscriptions[i].description+ '</li>';
            }
            if(subscriptions.length == 0)
            {
                $(".settingsContent").load("profile/mySubscription", function(){
                    $(".abonnementContent").html(`
                        <div class="col-md-5">
                            <p>U heeft geen abonnementen</p>
                        </div>`)
                });
            }
            else
            {
                $(".settingsContent").load("profile/mySubscription", function(){
                    $(".abonnementContent").html(`
                        <div class="col-md-12">
                            <p>U heeft de volgende abonnementen:</p>
                            <ul>`+ multipleSubscriptions +`</ul>
                        </div>`)
                });
            }
        }
    else if(this.id == "settings") 
    {
        $(".settingsContent").load("profile/settings");
    }
})



async function changeInfo(sort) {
    const userConst = await ApiCaller.getUserInfo(user.id);
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
        
        let res = await ApiCaller.updateUser(json, user.id)
        console.log(user.id);
        if(res.status == 200){
            console.log("succes");
            toastPopUp("Uw naam is geüpdate", "success");
        }else{
            console.log("pech");
        }
            
        const userConst = await ApiCaller.getUserInfo(user.id);
        const jsonload = await userConst.json();
        $(".settingsContent").empty();
        $(".settingsContent").load("profile/myProfile", function (){
            $("#accountName").html(``+ jsonload.fullName +`<i class="bi bi-pencil" onclick="changeInfo('name')"></i>`);
            $("#accountEmail").html(``+ jsonload.email +`<i class="bi bi-pencil" onclick="changeInfo('email')"></i>`);
            $("#accountPhoneNumber").html(``+ jsonload.phoneNumber +`<i class="bi bi-pencil" onclick="changeInfo('phoneNumber')"></i>`);
            $("#titleNotes").html(`<b>Notities <i class="bi bi-pencil" onclick="changeInfo('notes')"></i></b>`);
            $("#notes").html(jsonload.notes);
                // updateNav();
        })
    }
    else if(type == "email"){
        let updatedEmail = $("#changeEmail").val();
        console.log(updatedEmail);
        
        let json = {"email": updatedEmail}
        
        let res = await ApiCaller.updateUser(json, user.id)
        if(res.status == 200){
            console.log("succes");
            toastPopUp("Uw email is geüpdate", "success");
        }else if(res.status == 503){
            toastPopUp("Dit email emailadress is al in gebruik", "error");
        }    
        const userConst = await ApiCaller.getUserInfo(user.id);
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
        
        let res = await ApiCaller.updateUser(json, user.id)
        if(res.status == 200){
            console.log("succes");
            toastPopUp("Uw telefoonnummer is geüpdate", "success");
        }else{
            console.log("pech");
        }    
        const userConst = await ApiCaller.getUserInfo(user.id);
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
        
        let res = await ApiCaller.updateUser(json, user.id);
        if(res.status == 200){
            console.log("succes");
            toastPopUp("Uw notities zijn geüpdate", "success");
        }else{
            console.log("pech");
        }    
        const userConst = await ApiCaller.getUserInfo(user.id);
        const jsonload = await userConst.json();
        console.log(jsonload);
        $(".settingsContent").empty();
        $(".settingsContent").load("profile/myProfile", function (){
            $("#accountName").html(``+ jsonload.fullName +`<i class="bi bi-pencil" onclick="changeInfo('name')"></i>`);
            $("#accountEmail").html(``+ jsonload.email +`<i class="bi bi-pencil" onclick="changeInfo('email')"></i>`);
            $("#accountPhoneNumber").html(``+ jsonload.phoneNumber +`<i class="bi bi-pencil" onclick="changeInfo('phoneNumber')"></i>`);
            $("#titleNotes").html(`<b>Notities <i class="bi bi-pencil" onclick="changeInfo('notes')"></i></b>`);
            $("#notes").html(jsonload.notes);
        })
    }
}

async function denyName() {
    const userConst = await ApiCaller.getUserInfo(user.id);
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

