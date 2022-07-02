export function submissionValidate(
    name: string,
    email: string,
    password: string
): string | null {
    return (
        nameValidate(name) || emailValidate(email) || passwordValidate(password)
    );
}

export function realTimeValidate(
    name: string,
    email: string,
    password: string
): string | null {
    if (name) {
        const nameError = nameValidate(name);
        if (nameError) {
            return nameError;
        }
    }
    if (email) {
        const emailError = emailValidate(email);
        if (emailError) {
            return emailError;
        }
    }
    if (password) {
        const passwordError = passwordValidate(password);
        if (passwordError) {
            return passwordError;
        }
    }
    return null;
}

function nameValidate(name: string): string | null {
    if (name.length > 20) {
        return "Your username must contain between 1 and 20 characters.";
    }
    return null;
}

function emailValidate(email: string): string | null {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return "Please enter a valid email address.";
    }
    if (email.length > 50) {
        return "Your email address must be less than 51 characters.";
    }
    return null;
}

function passwordValidate(password: string): string | null {
    if (password.length < 8 || password.length > 60) {
        return "Your password must contain between 8 and 60 characters.";
    }

    if (!password.match(/([a-zA-Z])/) || !password.match(/([0-9])/)) {
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
            // If the password includes one upper case and one lower case, it's ok
            return null;
        }
        return "Your password must contain at least one number and one letter.";
    }

    return null;
}
