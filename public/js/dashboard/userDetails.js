let userCredentials;

$(async () =>  {
    await getAllUserInfo();
    setUserInformation();
    await addPaymentHistory();
    await addSubscriptionItem();
    console.log(userCredentials);
});

const getAllUserInfo = async () => {
    let userId = location.href.split("/").slice(-1)[0];
    let res = await ApiCaller.getUserInfo(userId);
    let json = await res.json();
    userCredentials = json;
};

const setUserInformation = () => {
    $("#nameTextField").html(userCredentials.fullName);
    $("#emailTextField").html(userCredentials.email);
    $("#phoneTextField").html(userCredentials.phoneNumber);
    $("#balanceTextField").html(userCredentials.saldo + " uur");
    $("#mollieTextField").html(userCredentials.customerId);
};

const getUserPaymentHistory = async () => {
    try {
        let res = await ApiCaller.paymentHistory(userCredentials.id);
        let json = await res.json();
        return json;
    } catch (err) {
        console.log(err)
    }
};

const addPaymentHistory = async () => {
    let paymentHistory = await getUserPaymentHistory();
    let totalSpent = 0;
    let products = await paymentHistory.products;
    let table = $("#tablePaymentHistory");
    console.log(products);
    table.empty();
    if(products.length > 0) {
        for(i in products) {
            const product = products[i];
            let productPaymentId = product.paymentId;
            let productStatus = product.status == "paid" ? "Betaald" : "Nog niet betaald";
            let productName = product.description;
            let productPrice = product.amount.value
            totalSpent += parseFloat(productPrice);
            let element = `
            <tr id="${productPaymentId}" class="cursor">
                <td>${productName}</td>
                <td>€${productPrice}</td>
                <td>${productStatus }<i class="bi bi-check2-square icons ps-3"></i></td>
            </tr>`

            table.append(element);
            eventHandlers(product);
        }
        $("#spent").text("€ " + totalSpent)
    }else {
        table.append(`<p class="lead"><small>Gebruiker heeft nog geen producten gekocht</small></p>`);
    }
    
}

const addSubscriptionItem = async () => {
    let subscription = await getUserPaymentHistory.subscription;
    if(subscription == undefined) {
        console.log("geen abbp")
    } else {
        console.log("abbo")
        let element = ``
    }
    console.log(subscription)
} 

const eventHandlers = (product) => {
    $("#" + product.paymentId).on("click", function() {
        window.open("https://www.mollie.com/dashboard/org_15275729/payments/" + product.paymentId);
    });
}