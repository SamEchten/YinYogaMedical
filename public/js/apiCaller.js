class  ApiCaller
{
    //static functions
    // Creates a new user and logs them in ->
    static registerUser = async(data) => {
        let url = "/api/session/signup/";
        let options = {
            method: 'POST', //PUT, DELETE, POST
            headers:{
            'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        };
        try {
            let response = await fetch(url, options);
            return response.json();
        } catch(err) {
            //error
        }
    }

    // Logs in a user ->
    static loginUser = async(data) => {
        let url = "/api/session/login/";
        let options = {
            method: 'POST', //PUT, DELETE, POST
            headers:{
            'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        };
        try {
            let response = await fetch(url, options);
            return response.json();
        } catch(err) {
            //error
        }
    }
    
}