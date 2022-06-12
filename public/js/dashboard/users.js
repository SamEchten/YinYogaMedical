let users;

const setUsers = async () => {
    let res = await ApiCaller.getAllUsers();
    users = await res.json();
}

const loadUsers = async () => {
    for (i in users) {
        let user = users[i];
        loadUser(user);
    }
}

const loadUser = (user) => {
    const row =
        $(`<div class="row userRow align-items-center">
            <div class="col-md">
                <p class="m-0">${user.fullName}  <i class="bi bi-person ps-2 float-right"></i></p>
            </div>
        </div>`);
    $("#usersContainer").append(row);

    row.on("click", function () {
        localStorage.setItem("id", user.id);
        $("#content").load("/static/userDetails.ejs");
    });
}

(async () => {
    await setUsers();
    await loadUsers();
})();