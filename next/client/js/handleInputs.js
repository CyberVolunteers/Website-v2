export const EventHandle = (e) => {
	let Inputs = document.querySelectorAll(".basic_info input");

	const HandleBlurState = (e) => {
		let Label = e.target.nextElementSibling;
		let HelperMessage = e.target.parentElement.nextElementSibling;

		if (e.target.value == "") {
			e.target.style.borderColor = "rgb(246, 91, 78)";
			Label.style.color = "rgb(246, 91, 78)";
			HelperMessage.style.display = "block";
		}
	};

	const HandleFocusState = (e) => {
		let HelperMessage = e.target.parentElement.nextElementSibling;
		let Label = e.target.nextElementSibling;

		e.target.style.borderColor = "#212121";
		Label.style.color = "#212121";
		HelperMessage.style.display = "none";
	};

	Inputs.forEach((EachInput) => {
		EachInput.addEventListener("blur", HandleBlurState);
	});
	Inputs.forEach((EachInput) => {
		EachInput.addEventListener("focus", HandleFocusState);
	});
};

export const HandleAllCheck = (e) => {
	let FirstInput = document.querySelector(".first_input input");
	let SecondInput = document.querySelector(".second_input input");
	let ThirdInput = document.querySelector(".third_input input");
	let FourthInput = document.querySelector(".fourth_input input");
	let FifthInput = document.querySelector(".fifth_input input");
	let SixthInput = document.querySelector(".sixth_input input");
	let SevenInput = document.querySelector(".seven_input input");
	let EightInput = document.querySelector(".eight_input input");
	let NineInput = document.querySelector(".nine_input input");

	if (
		FirstInput.value != "" &&
		SecondInput.value != "" &&
		ThirdInput.value != "" &&
		FourthInput.value != "" &&
		FifthInput.value != "" &&
		SixthInput.value != "" &&
		SevenInput.value != "" &&
		EightInput.value != "" &&
		NineInput.value != "" &&
		window.sessionStorage.getItem("gender") != null &&
		window.sessionStorage.getItem("month") != null &&
		window.sessionStorage.getItem("country") != null
	) {
		document.querySelector(".skill_save_one").classList.add("active");
		return true;
	} else {
		document.querySelector(".skill_save_one").classList.remove("active");
		return false;
	}
};
