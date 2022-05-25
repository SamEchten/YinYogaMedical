
class ApiCaller {
    //static functions
    // Creates a new user and logs them in ->
    static registerUser = async (data) => {
        let url = "/api/auth/signup/";
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch (err) {
            //error
        }
    }

    // Logs in a user ->
    static loginUser = async (data) => {
        let url = "/api/auth/login/";
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch (err) {
            //error
        }
    }

    static getAllSessions = async () => {
        let url = "/api/session/";
        let options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch (err) {
            //error
        }
    }

    // Gets on single session -> 
    static getSingleSession = async (id) => {
        let url = "/api/session/" + id;
        let options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch (err) {
            //error
        }
    }

    // Remove a session -> *ADMIN*
    static removeSession = async (sessionId) => {
        let url = "/api/session/" + sessionId;
        let options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch (err) {
            //error
        }
    }

    // Add a session to the agenda -> *ADMIN*
    static addSession = async (data) => {
        let url = "/api/session/";
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch (err) {
            //error
        }
    }

    // Add a user to a session with extra participants ->
    static addUserToSession = async (data, sessionId) => {
        let url = "/api/session/signup/" + sessionId;
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch (err) {
            //error
        }
    }

    static getAllProducts = async () => {
        let url = "/api/product/";
        let options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch (err) {
            //error
        }
    }

    // Remove a product -> *ADMIN*
    // static removeProduct = async (productId) => {
    //     let url = "/api/session/" + productId;
    //     let options = {
    //         method: 'DELETE',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     };
    //     try {
    //         let response = await fetch(url, options);
    //         return response;
    //     } catch (err) {
    //         //error
    //     }
    // }

}