let fname = "";
let lname = "";

export const HandleTextValidation = (e) => {
  let HelperElement = e.target.parentNode.parentNode.nextElementSibling;

  if (e.target.id == "fname") {
    fname = e.target.value;
  } else if (e.target.id == "lname") {
    lname = e.target.value;
  }

  HelperElement.textContent = "";

  HandleValidation();
};

const HandleValidation = () => {
  let Button = document.querySelector(".button-wrapper button");

  if (fname != "" && lname != "") {
    Button.classList.remove("disable");
  } else {
    Button.classList.add("disable");
  }
};
