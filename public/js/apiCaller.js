
class  ApiCaller
{
    //static functions
    // Creates a new user and logs them in ->
    static registerUser = async(data) => {
        let url = "/api/auth/signup/";
        let options = {
            method: 'POST',
            headers:{
            'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch(err) {
            //error
        }
    }

    // Logs in a user ->
    static loginUser = async(data) => {
        let url = "/api/auth/login/";
        let options = {
            method: 'POST',
            headers:{
            'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch(err) {
            //error
        }
    }

    static getAllSessions = async() => {
        let url = "/api/session/";
        let options = {
            method: 'GET',
            headers:{
            'Content-Type':'application/json'
            }
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch(err) {
            //error
        }
    }
    static getSingleSession = async(id) => {
        let url = "/api/session/" + id;
        let options = {
            method: 'GET',
            headers:{
            'Content-Type':'application/json'
            }
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch(err) {
            //error
        }
    }
    // Remove a session as admin
    static removeSession = async(sessionId) => {
        let url = "/api/session/" + sessionId;
        let options = {
            method: 'DELETE',
            headers:{
            'Content-Type':'application/json'
            }
        };
        try {
            let response = await fetch(url, options);
            return response;
        } catch(err) {
            //error
        }
    }
    
}