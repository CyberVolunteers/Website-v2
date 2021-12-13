// export const HandleSliderMovement = () => {
// 	window.addEventListener("resize", (event) => {
// 		let isTouch = "ontouchstart" in window || navigator.maxTouchPoints;

// 		if (isTouch == 0) {
// 			document
// 				.querySelector(".request-navigation-area")
// 				.classList.remove("touch");
// 		} else {
// 			document.querySelector(".request-navigation-area").classList.add("touch");
// 		}
// 	});
// 	window.addEventListener("load", (event) => {
// 		let isTouch = "ontouchstart" in window || navigator.maxTouchPoints;

// 		if (isTouch == 0) {
// 			document
// 				.querySelector(".request-navigation-area")
// 				.classList.remove("touch");
// 		} else {
// 			document.querySelector(".request-navigation-area").classList.add("touch");
// 		}
// 	});

// 	let setMobileView = false;
// 	let FirstReel = 0;
// 	let SecondReel = 0;
// 	let setMobileViewSecondReel = false;
// 	let Sizebelow550 = false;
// 	let CurrentActiveOption = 1;

// 	let ArrowsLeft = document.querySelectorAll(".icon-wrapper.left");
// 	let ArrowsRight = document.querySelectorAll(".icon-wrapper.right");

// 	window.addEventListener("load", (e) => {
// 		if (window.innerWidth < 850) {
// 			setMobileView = true;
// 		}

// 		if (window.innerWidth < 1200) {
// 			setMobileViewSecondReel = true;
// 		}
// 		if (window.innerWidth < 550) {
// 			Sizebelow550 = true;
// 		}
// 	});

// 	window.addEventListener("resize", (e) => {
// 		FirstReel = 0;
// 		document.querySelector(".first-reel").style.transform = "translateX(0)";
// 		if (window.innerWidth < 850) {
// 			document
// 				.querySelector(".top-navigation-area .left")
// 				.classList.add("disable");
// 			document
// 				.querySelector(".top-navigation-area .right")
// 				.classList.remove("disable");

// 			setMobileView = true;
// 		} else {
// 			setMobileView = false;
// 		}
// 		if (window.innerWidth < 1200) {
// 			document
// 				.querySelector(".request-navigation-area  .left")
// 				.classList.add("disable");
// 			document
// 				.querySelector(".request-navigation-area  .right")
// 				.classList.remove("disable");

// 			setMobileViewSecondReel = true;
// 		} else {
// 			setMobileViewSecondReel = false;
// 		}

// 		if (window.innerWidth > 1200) {
// 			document
// 				.querySelector(".request-navigation-area  .left")
// 				.classList.add("disable");
// 			document
// 				.querySelector(".request-navigation-area  .right")
// 				.classList.remove("disable");
// 		}

// 		SecondReel = 0;
// 		document.querySelector(".second-reel").style.transform = "translateX(0)";

// 		if (window.innerWidth < 550) {
// 			Sizebelow550 = true;
// 		}
// 		CurrentActiveOption = 1;
// 	});

// 	ArrowsRight.forEach((element) => {
// 		element.addEventListener("click", (e) => {
// 			let Reel = e.target.parentNode.querySelector(".reel");

// 			if (setMobileView == false) {
// 				if (FirstReel > -100) {
// 					if (Reel.classList.contains("first-reel")) {
// 						e.target.parentNode.firstElementChild.classList.remove("disable");
// 						FirstReel = FirstReel - 100;
// 						Reel.style.transform = `translateX(${FirstReel}%)`;
// 					}
// 				}
// 			} else {
// 				if (
// 					document.querySelector(`#top-nav-${CurrentActiveOption}`)
// 						.textContent != "Technology"
// 				) {
// 					if (Reel.classList.contains("first-reel")) {
// 						e.target.parentNode.firstElementChild.classList.remove("disable");

// 						if (window.innerWidth < 460) {
// 							if (FirstReel > -400) {
// 								FirstReel = FirstReel - 100;
// 								Reel.style.transform = `translateX(${FirstReel}%)`;
// 							}
// 							if (FirstReel < -300) {
// 								e.target.classList.add("disable");
// 							}
// 						} else if (window.innerWidth < 550) {
// 							if (FirstReel > -900) {
// 								if (FirstReel == -750) {
// 									FirstReel = FirstReel - 270;
// 								} else {
// 									FirstReel = FirstReel - 150;
// 								}
// 								Reel.style.transform = `translateX(${FirstReel}px)`;
// 							}
// 							if (FirstReel < -800) {
// 								e.target.classList.add("disable");
// 							}
// 						} else if (window.innerWidth < 635) {
// 							if (FirstReel > -900) {
// 								if (FirstReel == -750) {
// 									FirstReel = FirstReel - 290;
// 								} else {
// 									FirstReel = FirstReel - 150;
// 								}
// 								Reel.style.transform = `translateX(${FirstReel}px)`;
// 							}
// 							if (FirstReel < -800) {
// 								e.target.classList.add("disable");
// 							}
// 						} else if (window.innerWidth < 735) {
// 							if (FirstReel > -900) {
// 								if (FirstReel == -750) {
// 									FirstReel = FirstReel - 220;
// 								} else {
// 									FirstReel = FirstReel - 150;
// 								}
// 								Reel.style.transform = `translateX(${FirstReel}px)`;
// 							}
// 							if (FirstReel < -800) {
// 								e.target.classList.add("disable");
// 							}
// 						} else if (window.innerWidth < 800) {
// 							if (FirstReel > -900) {
// 								if (FirstReel == -750) {
// 									FirstReel = FirstReel - 180;
// 								} else {
// 									FirstReel = FirstReel - 150;
// 								}
// 								Reel.style.transform = `translateX(${FirstReel}px)`;
// 							}
// 							if (FirstReel < -800) {
// 								e.target.classList.add("disable");
// 							}
// 						}

// 						CurrentActiveOption++;
// 					}
// 				}
// 			}
// 			if (setMobileViewSecondReel == false) {
// 				if (SecondReel > -200) {
// 					if (Reel.classList.contains("second-reel")) {
// 						e.target.parentNode.firstElementChild.classList.remove("disable");
// 						SecondReel = SecondReel - 100;
// 						Reel.style.transform = `translateX(${SecondReel}%)`;
// 					}
// 				}
// 			} else {
// 				if (SecondReel > -2097) {
// 					if (Reel.classList.contains("second-reel")) {
// 						e.target.parentNode.firstElementChild.classList.remove("disable");
// 						SecondReel = SecondReel - 330;
// 						Reel.style.transform = `translateX(${SecondReel}px)`;
// 					}
// 				}
// 			}

// 			if (setMobileViewSecondReel == false) {
// 				if (Reel.classList.contains("second-reel")) {
// 					if (SecondReel < -100) {
// 						e.target.classList.add("disable");
// 					}
// 				}
// 			} else {
// 				if (Reel.classList.contains("second-reel")) {
// 					if (SecondReel < -2097) {
// 						e.target.classList.add("disable");
// 					}
// 				}
// 			}

// 			if (setMobileView == false) {
// 				if (Reel.classList.contains("first-reel")) {
// 					if (FirstReel < 0) {
// 						e.target.classList.add("disable");
// 					}
// 				}
// 			} else {
// 				if (Reel.classList.contains("first-reel")) {
// 					if (
// 						document.querySelector(`#top-nav-${CurrentActiveOption}`)
// 							.textContent == "Technology"
// 					) {
// 						e.target.classList.add("disable");
// 					}
// 				}
// 			}
// 		});
// 	});

// 	ArrowsLeft.forEach((element) => {
// 		element.addEventListener("click", (e) => {
// 			let Reel = e.target.parentNode.querySelector(".reel");
// 			if (setMobileView == false) {
// 				if (FirstReel < 0) {
// 					if (Reel.classList.contains("first-reel")) {
// 						e.target.parentNode.lastElementChild.classList.remove("disable");
// 						FirstReel = FirstReel + 100;
// 						Reel.style.transform = `translateX(${FirstReel}%)`;
// 						e.target.classList.remove("disable");
// 					}
// 				}
// 			} else {
// 				if (FirstReel < 0) {
// 					if (Reel.classList.contains("first-reel")) {
// 						e.target.parentNode.firstElementChild.classList.remove("disable");
// 						if (window.innerWidth < 470) {
// 							if (FirstReel != 0) {
// 								FirstReel = FirstReel + 100;
// 								Reel.style.transform = `translateX(${FirstReel}%)`;
// 							}
// 							if (FirstReel > -300) {
// 								e.target.classList.add("disable");
// 							}
// 						} else if (window.innerWidth < 550) {
// 							if (FirstReel == -1020) {
// 								FirstReel = FirstReel + 270;
// 							} else {
// 								FirstReel = FirstReel + 150;
// 							}
// 							if (FirstReel <= 0) {
// 								Reel.style.transform = `translateX(${FirstReel}px)`;
// 							}
// 							if (FirstReel == 0) {
// 								e.target.classList.add("disable");
// 							}
// 						} else if (window.innerWidth < 635) {
// 							if (FirstReel == -1040) {
// 								FirstReel = FirstReel + 290;
// 							} else {
// 								FirstReel = FirstReel + 150;
// 							}

// 							if (FirstReel <= 0) {
// 								Reel.style.transform = `translateX(${FirstReel}px)`;
// 							}
// 							if (FirstReel == 0) {
// 								e.target.classList.add("disable");
// 							}
// 						} else if (window.innerWidth < 735) {
// 							if (FirstReel == -970) {
// 								FirstReel = FirstReel + 220;
// 							} else {
// 								FirstReel = FirstReel + 150;
// 							}

// 							if (FirstReel <= 0) {
// 								Reel.style.transform = `translateX(${FirstReel}px)`;
// 							}
// 							if (FirstReel == 0) {
// 								e.target.classList.add("disable");
// 							}
// 						} else if (window.innerWidth < 800) {
// 							if (FirstReel == -930) {
// 								FirstReel = FirstReel + 180;
// 							} else {
// 								FirstReel = FirstReel + 150;
// 							}

// 							if (FirstReel <= 0) {
// 								Reel.style.transform = `translateX(${FirstReel}px)`;
// 							}
// 							if (FirstReel == 0) {
// 								e.target.classList.add("disable");
// 							}
// 						}

// 						CurrentActiveOption--;
// 					}
// 				}
// 			}
// 			if (setMobileView == true) {
// 				document
// 					.querySelector(".top-navigation-area .right")
// 					.classList.remove("disable");
// 			}

// 			if (setMobileViewSecondReel == false) {
// 				if (SecondReel < 0) {
// 					if (Reel.classList.contains("second-reel")) {
// 						e.target.parentNode.lastElementChild.classList.remove("disable");
// 						SecondReel = SecondReel + 100;
// 						Reel.style.transform = `translateX(${SecondReel}%)`;
// 						e.target.classList.remove("disable");
// 					}
// 				}
// 			} else {
// 				if (SecondReel < 0) {
// 					if (Reel.classList.contains("second-reel")) {
// 						e.target.parentNode.lastElementChild.classList.remove("disable");
// 						SecondReel = SecondReel + 330;
// 						Reel.style.transform = `translateX(${SecondReel}px)`;
// 						e.target.classList.remove("disable");
// 					}
// 				}
// 			}

// 			if (setMobileViewSecondReel == false) {
// 				if (Reel.classList.contains("second-reel")) {
// 					if (SecondReel == 0) {
// 						e.target.classList.add("disable");
// 					}
// 				}
// 			} else {
// 				if (Reel.classList.contains("second-reel")) {
// 					if (SecondReel == 0) {
// 						e.target.classList.add("disable");
// 					}
// 				}
// 			}

// 			if (setMobileView == false) {
// 				if (Reel.classList.contains("first-reel")) {
// 					if (FirstReel == 0) {
// 						e.target.classList.add("disable");
// 					}
// 				}
// 			}
// 		});
// 	});
// };
