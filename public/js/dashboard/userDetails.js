let userCredentials;
let totalSpent = 0;

$(async () => {
    await getAllUserInfo();
    setUserInformation();
    await addPaymentHistory();
    await addSubscriptionItem();
    setTotalSpent();
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
        console.log(res);
        let json = await res.json();
        return json;
    } catch (err) {
        console.log(err)
    }
};

const addPaymentHistory = async () => {
    let paymentHistory = await getUserPaymentHistory();
    console.log(paymentHistory);
    let products = await paymentHistory.products;
    let table = $("#tablePaymentHistory");
    console.log(products);
    table.empty();
    if (products.length > 0) {
        for (i in products) {
            const product = products[i];
            let productPaymentId = product.paymentId;
            let productStatus = product.status == "paid" ? "Betaald<i class='bi bi-check2-square icons ps-3'>" : "Cadeau <i class='bi bi-gift icons ps-3'>";
            let productName = product.description;
            let productPrice = "-"
            if (product.amount) {
                productPrice = product.amount.value
            }
            totalSpent += parseFloat(productPrice);
            let element = `
            <tr id="${productPaymentId}" class="cursor">
                <td>${productName}</td>
                <td>€${productPrice}</td>
                <td>${productStatus}</td>
            </tr>`
            console.log(element)

            table.append(element);
            eventHandlers(product);
        }

    } else {
        table.append(`<p class="lead"><small>Gebruiker heeft nog geen producten gekocht.</small></p>`);
    }

}

const addSubscriptionItem = async () => {
    let transactions = await getUserPaymentHistory();;
    let subscription = transactions.subscriptions[0];
    let subIcon;
    console.log(subscription)
    if (subscription == undefined) {
        console.log("geen abbo")

        let element = `<p class="lead"><small>Gebruiker heeft op het moment geen abonnement.</small><p>`
        $(".subscriptions").after(element);
    } else {
        let amount = parseFloat(subscription.amount.value)
        if (subscription.description == "Video") {
            subIcon = "camera-video"
        } else if (subscription.description == "Podcast") {
            subIcon = "mic"
        } else {
            subIcon = "gem"
        }
        let element = `
        <div id="${subscription.subscriptionId}" class="row align-items-center subscriptionItem">
            <div class="col-md-8  p-3">
                <h3 class="m-0">${subscription.description}</h3>
            </div>
            <div class="col-md-4 p-3 text-end">
                <i class="bi bi-${subIcon}"></i>
            </div>

        </div>
        <div class="row subInfo">
            <div class="col-md-6">
                <h5>Gekocht op:</h5>
                <p>${subscription.startDate}</p> 
            </div>
            <div class="col-md-6">
                <h5>Aantal facturen betaald:</h5>
                <p>${subscription.payments.length}</p>
             </div>
        </div> `

        $(".subscriptions").after(element);
        totalSpent += amount * subscription.payments.length;
        $("#" + subscription.subscriptionId).on("click", function () {
            window.open("https://www.mollie.com/dashboard/org_15275729/payments/" + subscription.subscriptionId);
        });
    }
    console.log(subscription)
}
const setTotalSpent = () => {
    $("#spent").text("€ " + totalSpent)
}
const eventHandlers = (product) => {
    $("#" + product.paymentId).on("click", function () {
        if(product.paymentId) {
            window.open("https://www.mollie.com/dashboard/org_15275729/payments/" + product.paymentId);
        } else {
            Swal.fire({
                title: "Cadeau",
                text: "Dit product is een gift van een andere gebruiker of uw zelf, dit product heeft geen betaalgegevens omdat het valt uw eigen applicatie.",
                icon: "warning"
            });
        }
        
    });
}