class ApiCaller {
    //static functions
    // Creates a new user and logs them in ->
    static baseUrl = "https://03ea-94-213-95-72.eu.ngrok.io";

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
            console.log(response);
            return response;
        } catch (err) {
            //error
        }
    }
    // Update a sessions information -> *ADMIN*
    static updateSession = async (data, sessionId) => {
        let url = "/api/session/" + sessionId;
        let options = {
            method: 'PUT',
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
            console.log(err)
        }
    }

    // Add a user to a session with or without extra participants ->
    static addUserToSession = async (data, sessionId) => {
        let url = "/api/session/signup/" + sessionId;
        console.log(data);
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
    // unscubscribe from a session ->
    static unsubscribeFormSession = async (data, sessionId) => {
        let url = "/api/session/signout/" + sessionId;
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
    static getSingleProduct = async (id) => {
        let url = "/api/product/" + id;
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
    // Add a product -> *ADMIN*
    static addProduct = async (data) => {
        let url = "/api/product/";
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

    // Update product -> *ADMIN*
    static updateProduct = async (data, productId) => {
        let url = "/api/product/" + productId;
        let options = {
            method: 'PUT',
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

    // Remove a product -> *ADMIN*
    static removeProduct = async (productId) => {
        let url = "/api/product/" + productId;
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

    // Gift a product to a user -> *ADMIN*
    // Gift a product to another user -> *USER*
    static giftProduct = async (data, productId) => {
        console.log(data, productId);
        let url = "/api/product/gift/" + productId;
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

    // Buy a product as a user ->
    static buyUserProduct = async (data, productId) => {
        let url = "/api/product/purchase/" + productId;
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


    static paymentHistory = async (id) => {
        let url = this.baseUrl + "/api/user/purchasehistory/" + id;
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

    // Gets all users with information -> *ADMIN*
    static getAllUsers = async () => {
        let url = "/api/user/";
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

    static cancelSubscription = async (subscriptionId) => {
        let url = "/api/product/cancel/" + subscriptionId;
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

    static getSessionStats = async () => {
        let url = "/api/dashboard/sessionStats";
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

    static getProductStats = async () => {
        let url = "/api/dashboard/productStats";
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

    // Gets the info of the user
    static getUserInfo = async (id) => {
        let url = "/api/user/" + id;
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

    static updateUser = async (data, id) => {
        let url = "/api/user/" + id;
        let options = {
            method: 'PUT',
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

    // Gets one single product -> 
    static getSingleProduct = async (productid) => {
        let url = "/api/product/" + productid;
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
    // upload a video + thumbnail OR mp3 + thumbnail ->
    // DATA OBJECT MUST BE OF FORMDATA!
    static uploadVideo = async (data) => {
        let url = "/api/video/";
        let options = {
            method: 'POST',
            body: data
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch (err) {
            //error
        }
    }
    // Get all videos ->
    static getAllVideos = async () => {
        let url = "/api/video/";
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

    // Delete video and thumbnail ->
    static deleteVideo = async (id) => {
        let url = "/api/video/" + id;
        let options = {
            method: 'DELETE',
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch (err) {
            //error
        }
    }

    static getSingleVideo = async (id) => {
        let url = "/api/video/" + id;
        let options = {
            method: 'GET',
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch (err) {
            //error
        }
    }

    static updateVideo = async (id, data) => {
        let url = "/api/video/" + id;
        let options = {
            method: 'PUT',
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

    // Get all Podcasts ->
    static getAllPodcasts = async () => {
        let url = "/api/podcast/";
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

    static getSinglePodcast = async (id) => {
        let url = "/api/podcast/" + id;
        let options = {
            method: 'GET',
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch (err) {
            //error
        }
    }

    // Delete podcest and thumbnail ->
    static deletePodcast = async (id) => {
        let url = "/api/podcast/" + id;
        let options = {
            method: 'DELETE',
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch (err) {
            //error
        }
    }

    static updatePodcast = async (id, data) => {
        let url = "/api/podcast/" + id;
        let options = {
            method: 'PUT',
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

}