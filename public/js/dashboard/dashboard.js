const userText = $(".amountOfUsers");
const sessionText = $(".amountOfSessions");
const subscriptionText = $(".amountOfSubscriptions");
const productText = $(".amountOfProducts");

const setUserText = async () => {
    let res = await ApiCaller.getAllUsers();
    let users = await res.json();
    userText.html(users.length);
}

const setSubscriptions = async () => {
    let res = await ApiCaller.getAllProducts();
    let products = await res.json();

}

const setSessions = async () => {

}

const setProducts = async () => {

}

(async () => {
    setUserText();
    setSubscriptions();
    setSessions();
    setProducts();
    $("#content").load("/static/users.ejs");
})();

//--------------------------------------------------//
//                  Event handlers                  //
//--------------------------------------------------//
const container = $("#content");

$(".toggleSideBar").on("click", function () {
    $('#sidebar').toggleClass('active');
});

$("#usersBtn").on("click", function () {
    container.load();
});

$("#productsBtn").on("click", function () {
    container.load();
});

$("#sessionsBtn").on("click", function () {
    container.load();
});

$("#toScheduleBtn").on("click", function () {
    container.load();
});