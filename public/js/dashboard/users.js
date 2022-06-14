let allUsers;

const setUsers = async () => {
    let res = await ApiCaller.getAllUsers();
    allUsers = await res.json();
}

const loadUsers = async (users) => {
    $("#usersContainer").empty();
    for (i in users) {
        let user = users[i];
        loadUser(user);
    }
}

const loadUser = (user) => {
    let icon = user.isEmployee ? "patch-check" : "person";
    const row =
        $(`<div class="row userRow align-items-center">
            <div class="col-md">
                <p class="m-0">${user.fullName}  <i class="bi bi-${icon} ps-2 float-right"></i></p>
            </div>
        </div>`);
    $("#usersContainer").append(row);

    row.on("click", function () {
        setUserTextField(user);
    });
}

const setUserTextField = (user) => {
    $("#nameTextField").html(user.fullName);
    $("#emailTextField").html(user.email);
    $("#phoneTextField").html(user.phoneNumber);
    $("#balanceTextField").html(user.saldo + " uur");
    $("#mollieTextField").html(user.customerId);

    //Enable more information button
    const moreInfoBtn = $("#moreInfoBtn");
    moreInfoBtn.removeClass("disabled");
    moreInfoBtn.on("click", function () {
        location.href = "/dashboard/klanten/" + user.id + "";
    });
}

const filterUsers = async (filter) => {
    let filteredUsers = [];
    for (i in allUsers) {
        const user = allUsers[i];
        const fullName = user.fullName.toLowerCase();
        if (fullName.includes(filter)) {
            filteredUsers.push(user);
        }
    }

    await loadUsers(filteredUsers);
}

//--------------------------------------------------//
//                  Event handlers                  //
//--------------------------------------------------//

$("#searchBtn").on("click", async function () {

});

$("#searchBar").on("input", async function () {
    let searchBarVal = $("#searchBar").val();
    await filterUsers(searchBarVal);
});

(async () => {
    await setUsers();
    await loadUsers(allUsers);
})();