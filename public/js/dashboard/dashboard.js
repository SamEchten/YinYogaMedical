const userText = $(".amountOfUsers");
const sessionText = $(".amountOfSessions");
const subscriptionText = $(".amountOfSubscriptions");
const productText = $(".amountOfProducts");

const setUserText = async () => {
    let res = await ApiCaller.getAllUsers();
    let amountOfUsers = (await res.json()).length;
    userText.html(amountOfUsers);
}

const setSessionText = async () => {
    let res = await ApiCaller.getSessionStats();
    let sessionStats = await res.json();
    console.log(sessionStats);
    sessionText.html(sessionStats.amountOfSessions);
}

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