let OrganizationDesc = "",
	OrganizationMission = "";
let CharityWork = null;
let OrgSafeGuarding = null;
let Link = "";
let training = null;
let explain = "";
let appointedSafeGuard = null;
let OrgSystem = null;
let Orgpolicy = null;
let safeguardinglead = "";
let safeguardingleadEmail = "";

const ValidateAll = () => {
	if (OrganizationDesc != "" && OrganizationMission != "") {
		if (CharityWork == "yes") {
			document.querySelector(".next_button").classList.add("disable");

			if (OrgSafeGuarding != null) {
				if (Link != "") {
					if (
						training != null &&
						appointedSafeGuard != null &&
						OrgSystem != null &&
						Orgpolicy == "yes"
					) {
						document.querySelector(".next_button").classList.remove("disable");

						if (training == "other") {
							if (explain != "") {
								document
									.querySelector(".next_button")
									.classList.remove("disable");
							} else {
								document.querySelector(".next_button").classList.add("disable");
							}
						}

						if (appointedSafeGuard == "yes") {
							if (safeguardinglead != "" && safeguardingleadEmail != "") {
								document
									.querySelector(".next_button")
									.classList.remove("disable");
							} else {
								document.querySelector(".next_button").classList.add("disable");
							}
						}
					}
				}
			} else {
				document.querySelector(".next_button").classList.add("disable");
			}
		} else if (CharityWork == "no") {
			document.querySelector(".next_button").classList.remove("disable");
		}
	}
};
export const ValidateValue = (e) => {
	let id = e.target.id;

	if (id == "Description") {
		OrganizationDesc = e.target.value;
	} else if (id == "mission_statement") {
		OrganizationMission = e.target.value;
	} else if (id == "yes-charity") {
		CharityWork = "yes";
	} else if (id == "No-charity") {
		CharityWork = "no";
	} else if (id == "yes-organisation") {
		OrgSafeGuarding = "yes";
	} else if (id == "No-organisation") {
		OrgSafeGuarding = "no";
	} else if (id == "fname") {
		Link = e.target.value;
	} else if (id == "yes-training") {
		training = "yes";
	} else if (id == "No-training") {
		training = "no";
	} else if (e.target.id == "Other-training") {
		training = "other";
	} else if (id == "explain") {
		explain = e.target.value;
	} else if (id == "No-appointed") {
		appointedSafeGuard = "no";
	} else if (id == "yes-appointed") {
		appointedSafeGuard = "yes";
	} else if (id == "yes-system") {
		OrgSystem = "yes";
	} else if (id == "No-system") {
		OrgSystem = "no";
	} else if (id == "yes-Disclosure") {
		Orgpolicy = "yes";
	} else if (id == "No-Disclosure") {
		Orgpolicy = "no";
	} else if (id == "safeguarding-lead") {
		safeguardinglead = e.target.value;
	} else if (id == "email_name") {
		safeguardingleadEmail = e.target.value;
	}
	ValidateAll();

	// window.alert()
};
