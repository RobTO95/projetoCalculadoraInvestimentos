import { generateReturnsArray } from "./src/investimentGoals";

// const calculateButton = document.getElementById("calculate-results");

const form = document.getElementById("investment-form");
const clearFormButton = document.getElementById("clear-form");

function renderProgression(event) {
	event.preventDefault();

	if (document.querySelector(".error")) {
		return;
	}

	// const startingAmount = Number(form["starting-amount"].value); // Recuperando o valor do campo pelo seu atributo 'name'

	const startingAmount = Number(
		document.getElementById("starting-amount").value
	);
	const additionalContribution = Number(
		document.getElementById("additional-contribution").value
	);
	const timeAmount = Number(
		document.getElementById("time-amount").value.replace(",", ".")
	);
	const timeAmountPeriod = document.getElementById("time-amount-period").value; //
	const returnRate = Number(
		document.getElementById("return-rate").value.replace(",", ".")
	);
	const returnRatePeriod = document.getElementById("evaluation-period").value; //
	const taxRate = Number(
		document.getElementById("tax-rate").value.replace(",", ".")
	);
	const returnsArray = generateReturnsArray(
		startingAmount,
		timeAmount,
		timeAmountPeriod,
		additionalContribution,
		returnRate,
		returnRatePeriod
	);
	console.log(returnsArray);
}

function clearForm() {
	form["starting-amount"].value = "";
	form["additional-contribution"].value = "";
	form["time-amount"].value = "";
	form["return-rate"].value = "";
	form["tax-rate"].value = "";
	const errorInputContainers = document.querySelectorAll(".error");
	for (const errorInput of errorInputContainers) {
		errorInput.classList.remove("error");
		errorInput.parentElement.querySelector("p").remove();
	}
}

// calculateButton.addEventListener("click", renderProgression);

function validateInput(event) {
	const element = event.target;
	if (element.value === "") {
		return;
	}
	const parentElement = element.parentElement;
	const grandParentElement = parentElement.parentElement;
	const inputValue = event.target.value.replace(",", ".");
	if (
		!parentElement.classList.contains("error") &&
		(isNaN(inputValue) || Number(inputValue) < 0)
	) {
		//objetivo: <p class="text-red-500">Insira um valor numérico e maior que 0</p>
		const errorTextElement = document.createElement("p");
		errorTextElement.classList.add("text-red-500");
		errorTextElement.innerText = "Insira um valor numérico e maior que zero";

		parentElement.classList.add("error");
		grandParentElement.appendChild(errorTextElement);
	} else if (
		parentElement.classList.contains("error") &&
		!isNaN(inputValue) &&
		Number(inputValue) > 0
	) {
		parentElement.classList.remove("error");
		grandParentElement.querySelector("p").remove();
	}
}

for (let formElement of form) {
	if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
		formElement.addEventListener("blur", validateInput);
	}
}

form.addEventListener("submit", renderProgression);
clearFormButton.addEventListener("click", clearForm);
