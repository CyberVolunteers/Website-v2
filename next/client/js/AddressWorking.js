let ResultWrapper = false;

export const HandleSecondStepOnFocuse = (e) => {
  e.target.nextElementSibling.style.borderBottomLeftRadius = 0;
  e.target.nextElementSibling.style.borderBottomRightRadius = 0;
  document.querySelector(".result-wrapper").style.display = "block";

  document
    .querySelector(".result-wrapper")
    .addEventListener("mouseenter", (e) => {
      ResultWrapper = true;
      console.log("enter");
    });
  document
    .querySelector(".result-wrapper")
    .addEventListener("mouseleave", (e) => {
      ResultWrapper = false;
      console.log("leave");
    });

  document.querySelector(".country-select").classList.add("active");
};

export const HandleSecondStepOnBlur = (e) => {
  let label = e.target.parentNode.previousElementSibling;
  let BorderElement = e.target.nextElementSibling;
  console.log(ResultWrapper, "results");
  if (e.target.id == "address") {
    document.querySelector(".country-select").classList.remove("active");
    if (ResultWrapper == false) {
      document.querySelector(".result-wrapper").style.display = "none";

      e.target.nextElementSibling.style.borderBottomLeftRadius = "5px";
      e.target.nextElementSibling.style.borderBottomRightRadius = "5px";
    }
    if (e.target.value.length > 0) {
      label.style.color = "#000";
      BorderElement.style.borderColor = "#000";
      // document.querySelector(".expand-address").classList.add("active")
    } else {
      label.style.color = "rgba(0, 0, 0, 0.54)";
      BorderElement.style.borderColor = "rgba(0, 0, 0, 0.23)";
    }
  }
};
