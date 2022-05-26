//handleUserErrors
//Params:   err
//Handles the error passed through by the login and signup methods
//Returns an error object containing the error messages for the different fields
module.exports.handleUserErrors = (err) => {
    const errors = { fullName: null, email: null, password: null, phoneNumber: null, notes: null, isEmployee: null };

    //Duplicate email ->
    if (err.code == 11000) {
        errors.email = "Er bestaat al een account met dit e-mailadres";
        return errors;
    }

    //Password / phonenumber errors ->
    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach((error) => {
            let properties = error.properties;
            errors[properties.path] = properties.message;
        })

        return errors;
    }

    //Other errors ->
    try {
        let error = JSON.parse(err.message);
        errors[error.path] = error.message;
    } catch (err) {
        errors["error"] = "Invalid JSON";
    } finally {
        return errors;
    }
}

module.exports.handleSessionErrors = (err) => {
    try {
        const errors = {
            title: null,
            location: null,
            date: null,
            duration: null,
            participants: null,
            teacher: null,
            maxAmountOfParticipants: null
        };

        if (err.message.includes("session validation failed")) {
            Object.values(err.errors).forEach((error) => {
                let properties = error.properties;
                errors[properties.path] = properties.message;
            })

            return errors;
        }
    } catch (err) {
        return { message: "Er is iets fout gegaan", error: err.message }
    }

}
