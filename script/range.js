const rangeInput = document.querySelectorAll(".range-input input"),
    yearInput = document.querySelectorAll(".year-input input"),
    range = document.querySelector(".slider .progress");

let yearGap = 1; // Минимальная разница между значениями

const minValue = 1924;
const maxValue = 2024;

yearInput.forEach(input => {
    input.addEventListener("input", e => {
        let minYear = parseInt(yearInput[0].value),
            maxYear = parseInt(yearInput[1].value);

        if ((maxYear - minYear >= yearGap) && maxYear <= maxValue && minYear >= minValue) {
            if (e.target.classList.contains("input-min")) {
                rangeInput[0].value = minYear;
            } else {
                rangeInput[1].value = maxYear;
            }
            updateProgressBar(minYear, maxYear);
        }
    });
});

rangeInput.forEach(input => {
    input.addEventListener("input", e => {
        let minVal = parseInt(rangeInput[0].value),
            maxVal = parseInt(rangeInput[1].value);

        if ((maxVal - minVal) < yearGap) {
            if (e.target.classList.contains("range-min")) {
                rangeInput[0].value = maxVal - yearGap;
            } else {
                rangeInput[1].value = minVal + yearGap;
            }
        } else {
            yearInput[0].value = minVal;
            yearInput[1].value = maxVal;
        }
        updateProgressBar(minVal, maxVal);
    });
});

function updateProgressBar(min, max) {
    const percentMin = ((min - minValue) / (maxValue - minValue)) * 100;
    const percentMax = ((max - minValue) / (maxValue - minValue)) * 100;
    range.style.left = percentMin + "%";
    range.style.right = (100 - percentMax) + "%";
}

// Инициализация прогресс-бара при загрузке страницы
updateProgressBar(parseInt(rangeInput[0].value), parseInt(rangeInput[1].value));
