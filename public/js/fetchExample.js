const fetchExample = async(data) => {
    let url = "exampleUrl/api/users/";
    let options = {
        method: 'GET', //PUT, DELETE, POST
	    headers:{
        'Content-Type':'application/json'
        },
	    body: JSON.stringify(data)
    };
    try {
        let response = await fetch(url, options);
        if(response.status == 200) {
            //ok
        } else {
            //error
        }
    } catch(err) {
        //error
    }
}