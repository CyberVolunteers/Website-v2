export const EmailValidation = (event, selector, EffectSelector) => {
  let email = /^([a-zA-Z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
  let Field = document.querySelector(selector);
  let EffectField = document.querySelector(EffectSelector);
  // validate(Field, email, EffectField);
};

let URL = "";
let phone = "";
let fname = "";
let lname = "";

export const HandleTextValidation = (e) => {
  let HelperElement = e.target.parentNode.parentNode.nextElementSibling;

  if (e.target.id == "fname") {
    fname = e.target.value;
  } else if (e.target.id == "lname") {
    lname = e.target.value;
  } else if (e.target.id == "URL") {
    URL = e.target.value;
  } else if (e.target.id == "PHONE") {
    phone = e.target.value;
  }

  HelperElement.textContent = "";

  HandleValidation();
};

const HandleValidation = () => {
  let Button = document.querySelector(".button-wrapper button");

  if (URL != "" && phone != "" && fname != "" && lname != "") {
    Button.classList.remove("disable");
  } else {
    Button.classList.add("disable");
  }
};
