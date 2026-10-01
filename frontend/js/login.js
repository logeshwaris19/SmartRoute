/* =========================================================
   SMARTROUTE LOGIN
========================================================= */


/* =========================================================
   LOGIN FORM
========================================================= */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document.getElementById("email")
                .value
                .trim();


            const password =
                document.getElementById("password")
                .value;


            const remember =
                document.getElementById("rememberMe")
                .checked;


            const button =
                document.getElementById("loginButton");


            /* =============================================
               DEMO LOGIN
            ============================================= */

            const demoEmail =
                "admin@smartroute.com";

            const demoPassword =
                "Smart@123";


            if (
                email === demoEmail &&
                password === demoPassword
            ) {


                /* Loading */

                button.innerHTML = `
                    <i class="bi bi-arrow-repeat"></i>
                    Signing in...
                `;


                button.disabled = true;


                /* Save login */

                localStorage.setItem(
                    "smartrouteLoggedIn",
                    "true"
                );


                localStorage.setItem(
                    "smartrouteUser",
                    email
                );


                if (remember) {

                    localStorage.setItem(
                        "smartrouteEmail",
                        email
                    );

                } else {

                    localStorage.removeItem(
                        "smartrouteEmail"
                    );

                }


                /* Redirect */

                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 700);


            } else {

                showLoginError();

            }

        }
    );

}


/* =========================================================
   SHOW / HIDE PASSWORD
========================================================= */

function togglePassword() {

    const password =
        document.getElementById("password");

    const icon =
        document.getElementById("passwordIcon");


    if (
        password.type === "password"
    ) {

        password.type = "text";

        icon.className =
            "bi bi-eye-slash";

    } else {

        password.type = "password";

        icon.className =
            "bi bi-eye";

    }

}


/* =========================================================
   LOGIN ERROR
========================================================= */

function showLoginError() {

    const email =
        document.getElementById("email");

    const password =
        document.getElementById("password");


    email.style.borderColor =
        "#dc4f4f";

    password.style.borderColor =
        "#dc4f4f";


    alert(
        "Invalid login details.\n\n" +
        "Demo Login:\n" +
        "Email: admin@smartroute.com\n" +
        "Password: Smart@123"
    );


    setTimeout(() => {

        email.style.borderColor = "";

        password.style.borderColor = "";

    }, 2000);

}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

function forgotPassword(event) {

    event.preventDefault();

    alert(
        "Password recovery will be available " +
        "after backend authentication is connected."
    );

}


/* =========================================================
   SOCIAL LOGIN
========================================================= */

function socialLogin(provider) {

    alert(
        provider +
        " login will be connected with the backend later."
    );

}


/* =========================================================
   CREATE ACCOUNT
========================================================= */

function createAccount(event) {

    event.preventDefault();

    alert(
        "Registration page will be added next."
    );

}


/* =========================================================
   LOAD SAVED EMAIL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const savedEmail =
            localStorage.getItem(
                "smartrouteEmail"
            );


        const email =
            document.getElementById("email");


        const remember =
            document.getElementById("rememberMe");


        if (
            savedEmail &&
            email &&
            remember
        ) {

            email.value = savedEmail;

            remember.checked = true;

        }

    }
);