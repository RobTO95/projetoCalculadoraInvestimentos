import { generateReturnsArray } from "./src/investimentGoals";
import { Chart } from "chart.js/auto";

const finalMoneyChart = document.getElementById("final-money-distribution");
const progressionChart = document.getElementById("progression");

const form = document.getElementById("investment-form");
const clearFormButton = document.getElementById("clear-form");

let doughnutChartReference = {};
let progressionChartReference = {};
// const calculateButton = document.getElementById("calculate-results");
function formatCurrency(value) {
	return value.toFixed(2);
}
function renderProgression(event) {
	event.preventDefault();

	if (document.querySelector(".error")) {
		return;
	}
	18030;
	resetCharts();
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

	// Building chart Doughnut

	const finalInvestmentObject = returnsArray[returnsArray.length - 1];

	doughnutChartReference = new Chart(finalMoneyChart, {
		type: "doughnut",
		data: {
			labels: ["Total investido", "Rendimento", "imposto"],
			datasets: [
				{
					data: [
						formatCurrency(
							finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)
						),
						formatCurrency(
							finalInvestmentObject.totalInterestReturns * (taxRate / 100)
						),
						formatCurrency(finalInvestmentObject.investedAmount),
					],
					backgroundColor: [
						"rgb(255, 99, 132)",
						"rgb(54, 162, 235)",
						"rgb(255, 205, 86)",
					],
					hoverOffset: 8,
				},
			],
		},
	});

	// Building Stacked Bar Chart
	progressionChartReference = new Chart(progressionChart, {
		type: "bar",
		data: {
			labels: returnsArray.map((investmentObject) => investmentObject.month),
			datasets: [
				{
					label: "Total investido",
					data: returnsArray.map((investmentObject) =>
						formatCurrency(investmentObject.investedAmount)
					),
					backgroundColor: "rgb(255, 99, 132)",
				},
				{
					label: "Retorno do investimento",
					data: returnsArray.map((investmentObject) =>
						formatCurrency(investmentObject.interestReturns)
					),
					backgroundColor: "rgb(54, 162, 235)",
				},
			],
		},
		options: {
			responsive: true,
			scales: {
				x: {
					stacked: true,
				},
				y: {
					stacked: true,
				},
			},
		},
	});
}

function isObjectEmpty(obj) {
	return Object.keys(obj).length === 0;
}
function resetCharts() {
	if (
		!isObjectEmpty(doughnutChartReference) &&
		!isObjectEmpty(progressionChartReference)
	) {
		doughnutChartReference.destroy();
		progressionChartReference.destroy();
	}
}

function clearForm() {
	form["starting-amount"].value = "";
	form["additional-contribution"].value = "";
	form["time-amount"].value = "";
	form["return-rate"].value = "";
	form["tax-rate"].value = "";

	resetCharts();

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
