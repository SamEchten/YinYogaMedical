const userText = $(".amountOfUsers");
const setUserText = async () => {
    let res = await ApiCaller.getAllUsers();
    let amountOfUsers = (await res.json()).length;
    userText.html(amountOfUsers);
}

const sessionText = $(".amountOfSessions");
const setSessionText = async () => {
    let res = await ApiCaller.getSessionStats();
    let sessionStats = await res.json();
    sessionText.html(sessionStats.amountOfSessions);
}

const subscriptionText = $(".amountOfSubscriptions");
const productText = $(".amountOfProducts");
const setProductAndSubText = async () => {
    let res = await ApiCaller.getProductStats();
    let data = await res.json();
    productText.html(data.amountOfBoughtProducts);
    subscriptionText.html(data.amountOfBoughtSubscriptions);
}

(async () => {
    setUserText();
    setSessionText();
    setProductAndSubText();
})();

//--------------------------------------------------//
//                  Event handlers                  //
//--------------------------------------------------//
const container = $("#content");


$(".toggleSideBar").on("click", function () {
    $('#sidebar').toggleClass('active');
});

$("#dashboardBtn").on("click", function () {
    location.href = "/dashboard";
});

$("#usersBtn").on("click", function () {
    location.href = "/dashboard/klanten";
});

$("#productsBtn").on("click", function () {
    location.href = "/dashboard/producten";
});

$("#sessionsBtn").on("click", function () {
    location.href = "/dashboard/sessies";
});

$("#toScheduleBtn").on("click", function () {
    location.href = "/dashboard/toSchedule";
});