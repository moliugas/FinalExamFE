window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 72,
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // My stuff

    const password = document.querySelector("#password-register"),
        confirm_password = document.querySelector("#password-register-confirm"),
        login_password = document.querySelector("#login-pass"),
        name = document.querySelector("#login-user"),
        reg_name = document.querySelector("#name-register");
    const input = document.querySelector("#selectAvatar");
    const regSubmit = document.querySelector("#form-register");
    const loginSubmit = document.querySelector("#form-login");
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    let image64;

    const uploadImage = async (event) => {
        const file = event.target.files[0];
        image64 = await convertBase64(file);
    };

    function validatePassword() {
        if (password.value !== confirm_password.value) {
            confirm_password.setCustomValidity("Passwords Don't Match");
        } else {
            confirm_password.setCustomValidity('');
        }
    }

    password.onchange = validatePassword;
    confirm_password.onkeyup = validatePassword;

    input.addEventListener("change", (e) => {
        uploadImage(e);
    });

    loginSubmit.addEventListener('submit', (event) => {
        event.preventDefault();

        let body = {
            name: name.value,
            pass: login_password.value
        };

        console.log(body);

        fetch("https://localhost:7246/User/login", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                Accept: "text/json",
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res.ok) {
                res.text().then(token => {
                    localStorage.token = token;
                    location.assign("edit.html");
                })
            } else {
                alert("Failed.");
            }
        });

    });

    regSubmit.addEventListener('submit', (event) => {
        event.preventDefault();

        let body = {
            name: reg_name.value,
            pass: password.value,
            profilePicture: image64
        };

        console.log(body);

        fetch("https://localhost:7246/User", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                Accept: "text/json",
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res.ok) {
                res.text().then(token => {
                    localStorage.token = token;
                    location.assign("edit.html");
                })
            } else {
                alert("User exists.");
            }
        });

    });
})