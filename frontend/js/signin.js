
let form = document.querySelector("form");

function validateForm() {
  let x = document.forms["loginForm"]["username"].value;
  console.log(x);
  if (x === "manager@gmail.com") {
    form.setAttribute("action", "./manager.html");
    return true;
  } else if (x === "user@gmail.com") {
    form.setAttribute("action", "./products.html");
    return true;
  } else {
    return false;
  }
}