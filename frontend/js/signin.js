
let form = document.querySelector("form");

function validateForm() {
  let x = document.forms["loginForm"]["username"].value;
  if (x === "manager@gmail.com") {
    form.setAttribute("action", "./manager.html");
    return true;
  } else if (x === "user@gmail.com") {
    form.setAttribute("action", "./products.html");
    return true;
  } else if (x == "admin@gmail.com") {
    form.setAttribute("action", "./admin-manager.html");
    return true;
} else {
    return false;
  }
}