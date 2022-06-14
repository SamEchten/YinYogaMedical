let userCredentials;

$(async () => {
    await getAllUserInfo();
    setUserInformation();
    await getUserPaymentHistory();
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
async function test() {

}
const getUserPaymentHistory = async () => {
    try {
        let res = await ApiCaller.paymentHistory(userCredentials.id);
        let json = await res.json();
        console.log(json)
    } catch (err) {
        console.log(err)
    }
};
