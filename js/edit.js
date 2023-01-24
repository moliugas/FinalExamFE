window.addEventListener('DOMContentLoaded', event => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token == null) { location.assign("index.html"); }

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
            offset: 72
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

    const { elements } = document.querySelector('#personForm');
    console.log(elements);

    const fillForm = (data) => {
        console.log(data);
        for (const [key, value] of Object.entries(data)) {
            const field = elements.namedItem(key);
            if (key == "profilePicture") {
                setImage(value);
                continue;
            }
            else if (key == "selectAvatar") {
                setImage(value);
                continue;
            }
            field && (field.value = value);
        }
    };

    const doAjax = async () => {
        const response = await fetch("https://localhost:7246/Person");
        if (response.ok) {
            let list = await response.json();
            fillIdSelector(list);
            fillForm(list[getUserPersonIndex(list)]);
        } else {
            return Promise.reject("Not found.");
        }
    };

    const redoAjax = async () => {
        const response = await fetch("https://localhost:7246/Person");
        if (response.ok) {
            let list = await response.json();
            fillForm(list[select.selectedIndex]);
        } else {
            return Promise.reject("Not found.");
        }
    };

    const isAdmin = () => token.role == 1;

    const select = document.querySelector("#id-select");
    const formPerson = document.querySelector("#personForm");

    const fillIdSelector = (items) => {
        select.disabled = !isAdmin();
        items.map((item, i) => {
            let opt = document.createElement("option");
            opt.value = i;
            opt.innerHTML = item.id;
            select.append(opt);
        });
    };

    const getUserPersonIndex = (items) =>
        items.findIndex(item => item.id == token?.person?.id);


    const setImage = (base64) => {
        var src = "data:image/jpeg;base64,";
        src += base64;
        var newImage = document.createElement('img');
        newImage.src = src;
        newImage.width = newImage.height = "200";
        document.querySelector('#profilePicture').innerHTML = newImage.outerHTML;
    };

    const send = (body) =>
        fetch("https://localhost:7246/Person/update", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                Accept: "text/json",
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res.ok) {
                location.reload();
            } else {
                alert("Something went wrong, try again.");
            }
        });


    const surname = (value) =>
        fetch("https://localhost:7246/Person/Surname", {
            id: token.person.id,
            value: value,
        });
    const personalCode = (value) =>
        fetch("https://localhost:7246/Person/PersonalId", {
            id: token.person.id,
            value: value,
        });
    const phone = (value) =>
        fetch("https://localhost:7246/Person/Phone", {
            id: token.person.id,
            value: value,
        });
    const email = (value) =>
        fetch("https://localhost:7246/Person/Email", {
            id: token.person.id,
            value: value,
        });


    formPerson.addEventListener("submit", (e) => {

        if (document.querySelector("p.error.bg-warning").style.display != 'none') {
            return;
        }

        let body = {
            id: token.person.id,
            Name: elements[2].value,
            Lastname: elements[3].value,
            PersonalCode: elements[4].value,
            PhoneNumber: elements[5].value,
            Email: elements[6].value,
            Avatar: elements[9].value,
            Address: elements[10].value,
            City: elements[11].value,
            Buiding: elements[12].value,
            Apartment: elements[13].value
        };

        send(body);
    });

    doAjax();

    select.addEventListener("change", (e) => {
        redoAjax(select.selectedIndex);
    });

    function customSubmit(a) { console.log(a) }

    document.querySelector("#logout").addEventListener("click", () => {
        localStorage.removeItem('token');
        fetch("https://localhost:7246/User/logout");
        location.assign("index.html");
    });
});