let Selection = null;

let facebookURL = "";
let LinkedinURL = "";
let TwitterURL = "";
let aggreement = null;
const HandleValidationLogo = (e) => {
	if (Selection != null) {
		if (Selection == "yes") {
			document.querySelector("#create-account-button").classList.add("disable");
			if (facebookURL != "" && LinkedinURL != "" && TwitterURL != "") {
				if (aggreement != null) {
					document
						.querySelector("#create-account-button")
						.classList.remove("disable");
				} else {
					document
						.querySelector("#create-account-button")
						.classList.add("disable");
				}
			}
		} else if (Selection == "no") {
			if (aggreement != null) {
				document
					.querySelector("#create-account-button")
					.classList.remove("disable");
			} else {
				document
					.querySelector("#create-account-button")
					.classList.add("disable");
			}
		}
	}
};

export const HandleValidation = (e) => {
	if (e.target.id == "yes-selection-checkbox") {
		Selection = "yes";
	} else if (e.target.id == "no-selection-checkbox") {
		Selection = "no";
	} else if (e.target.id == "fname") {
		facebookURL = e.target.value;
	} else if (e.target.id == "lname") {
		LinkedinURL = e.target.value;
	} else if (e.target.id == "tname") {
		TwitterURL = e.target.value;
	} else if (e.target.id == "aggreement") {
		if (e.target.checked) {
			aggreement = e.target.value;
		} else {
			aggreement = null;
		}
	}

	HandleValidationLogo(e);
};
