const userText = $(".amountOfUsers");
const sessionText = $(".amountOfSessions");
const subscriptionText = $(".amountOfSubscriptions");
const productText = $(".amountOfProducts");

const setUserText = async () => {
    let res = await ApiCaller.getAllUsers();
    let amountOfUsers = (await res.json()).length;
    userText.html(amountOfUsers);
}

const setSubscriptionText = async () => {
    let res = await ApiCaller.getAllProducts();
    let products = await res.json();
}

const setSessionText = async () => {

}

const setProductText = async () => {

}

(async () => {
    setUserText();
    setSubscriptionText();
    setSessionText();
    setProductText();
})();

//--------------------------------------------------//
//                  Event handlers                  //
//--------------------------------------------------//
const container = $("#content");


$(".toggleSideBar").on("click", function () {
    $('#sidebar').toggleClass('active');
});

$("#dashboardBtn").on("click", function () {
    location.reload();
});

$("#usersBtn").on("click", function () {
    container.load("/static/users.ejs");
});

$("#productsBtn").on("click", function () {
    container.empty();
    container.load("/static/products.ejs");
});

$("#sessionsBtn").on("click", function () {
    container.empty();
    container.load("/static/sessions.ejs");
});

$("#toScheduleBtn").on("click", function () {
    container.empty();
    container.load("/static/toSchedule.ejs");
});