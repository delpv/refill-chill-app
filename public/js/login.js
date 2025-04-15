const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (e) => {
    console.log("Submitted form!")
    e.preventDefault();

    let inputFname = document.getElementById("fname");
    // save first name
    localStorage.setItem("fname", inputFname.value);
    // get last name
    let inputLname = document.getElementById("lname");
    // save last name
    localStorage.setItem("lname", inputLname.value);

    let inputPassW = document.getElementById("passw");
    localStorage.setItem("passw", inputPassW.value);

    let inputEmail = document.getElementById("email");
    localStorage.setItem("email", inputEmail.value);

    window.location.href = "home.html"
})