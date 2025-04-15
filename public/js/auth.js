const username = document.getElementById("username");

const localStorageFName = localStorage.getItem("fname");
const localStorageLName = localStorage.getItem("lname");
const localStorageEmail = localStorage.getItem("email");

const loginElement = document.getElementById("login-link");
const logoutElement = document.getElementById("logout-link");

logoutElement.addEventListener("click", () => {
    localStorage.removeItem("fname");
    localStorage.removeItem("lname");
    localStorage.removeItem("email");

    window.location.href = "login.html";
})

if (localStorageEmail && localStorageFName && localStorageLName) {
    loginElement.style.display = "none";
    logoutElement.style.display = "block";
} else {
    loginElement.style.display = "block";
    logoutElement.style.display = "none";
}
if (localStorageFName) {
    username.innerText = `Hi, ${localStorageFName}`;
}
