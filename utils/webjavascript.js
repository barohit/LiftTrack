function validateRegister() {
    firstName = document.getElementsByName('firstname')[0]
    lastName = document.getElementsByName('lastname')[0]
    dateOfBirth = document.getElementsByName('dateofbirth')[0]
    username = document.getElementsByName('username')[0]
    password = document.getElementsByName('password')[0]

    if (firstName == "" || lastname == "" || username == "") {
        return false; 
    }

    if (firstName.length > 30 || lastname.length > 30 || username.length < 5 || !username.charAt(0).match("/[a-zA-Z]/i")) {
        return false; 
    }

    if (password.length() < 8 || password.length() > 25) {
        return false; 
    }

    containsUppercaseLetter = false; 
    containsLowercaseLetter = false; 
    containsNumber = false; 
    containsSpecialCharacter = false; 

    for (let i = 0; i < password.length(); i++) {
        curr = password.charAt(i)
        if (!containsUppercaseLetter) {
            if (curr.match("[A-Z]")) {
                containsUppercaseLetter = true; 
            }
        }
        if (!containsLowercaseLetter) {
            if (curr.match("[a-z]")) {
                containsLowercaseLetter = true; 
            }
        }
        if (!containsNumber) {
            if (curr.match("[0-9]")) {
                containsNumberr = true; 
            }
        }
        if (!containsSpecialCharacter) {
            if (curr.match("[!@#$%^&*]")) {
                containsSpecialCharacter = true; 
            }
        }
    }
    if (!(containsLowercaseLetter && containsNumber && containsUppercaseLetter && containsSpecialCharacter)) {
        return false; 
    }
    return true; 



}

function validateLogin() {
    username = document.getElementsByName('username')[0]
    password = document.getElementsByName('password')[0]
    if (username == "" || password == "") {
        return false; 
    } else {
        return true; 
    }
}