document.addEventListener('DOMContentLoaded', () => {
    setupYearRange();
});
const baseUrl = "https://ib.komisc.ru";
let selectedYearRange = { startYear: 1924, endYear: 2024 };

function setupYearRange() {
    fetch('event.json')
        .then(response => response.json())
        .then(data => {
            if (data.event && Array.isArray(data.event)) {
                const years = data.event.map(event => parseInt(event.Date.split('.')[0], 10));
                const minYear = Math.min(...years);
                const maxYear = Math.max(...years);

                const inputMinElem = document.getElementById('input-min');
                const inputMaxElem = document.getElementById('input-max');
                const rangeMinElem = document.getElementById('range-min');
                const rangeMaxElem = document.getElementById('range-max');

                inputMinElem.value = minYear;
                inputMaxElem.value = maxYear;
                rangeMinElem.min = minYear;
                rangeMinElem.max = maxYear;
                rangeMinElem.value = minYear;
                rangeMaxElem.min = minYear;
                rangeMaxElem.max = maxYear;
                rangeMaxElem.value = maxYear;

                rangeMinElem.addEventListener('input', updateYearRange);
                rangeMaxElem.addEventListener('input', updateYearRange);
                inputMinElem.addEventListener('change', updateYearRangeFromInput);
                inputMaxElem.addEventListener('change', updateYearRangeFromInput);

                fetchEvents();
            }
        });
}

function updateYearRange() {
    const rangeMinElem = document.getElementById('range-min');
    const rangeMaxElem = document.getElementById('range-max');
    const inputMinElem = document.getElementById('input-min');
    const inputMaxElem = document.getElementById('input-max');

    const minYear = parseInt(rangeMinElem.value);
    const maxYear = parseInt(rangeMaxElem.value);

    if (minYear > maxYear) {
        rangeMaxElem.value = minYear;
        selectedYearRange.startYear = minYear;
        selectedYearRange.endYear = minYear;
    } else {
        selectedYearRange.startYear = minYear;
        selectedYearRange.endYear = maxYear;
    }

    inputMinElem.value = selectedYearRange.startYear;
    inputMaxElem.value = selectedYearRange.endYear;

    fetchEvents();
}

function updateYearRangeFromInput() {
    const inputMinElem = document.getElementById('input-min');
    const inputMaxElem = document.getElementById('input-max');
    const rangeMinElem = document.getElementById('range-min');
    const rangeMaxElem = document.getElementById('range-max');

    const minYear = parseInt(inputMinElem.value);
    const maxYear = parseInt(inputMaxElem.value);

    if (minYear > maxYear) {
        inputMaxElem.value = minYear;
        selectedYearRange.startYear = minYear;
        selectedYearRange.endYear = minYear;
    } else {
        selectedYearRange.startYear = minYear;
        selectedYearRange.endYear = maxYear;
    }

    rangeMinElem.value = selectedYearRange.startYear;
    rangeMaxElem.value = selectedYearRange.endYear;

    fetchEvents();
}
function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }

    let truncated = text.substr(0, maxLength);

    // Ensure words are not cut off
    if (text[maxLength] !== ' ' && truncated.lastIndexOf(' ') > 0) {
        truncated = truncated.substr(0, truncated.lastIndexOf(' '));
    }

    return truncated + '...';
}
function fetchEvents() {
    fetch('event.json')
        .then(response => response.json())
        .then(data => {
            const eventsContainer = document.getElementById('eventsContainer');
            eventsContainer.innerHTML = '';

            if (data.event && Array.isArray(data.event)) {
                const filteredEvents = data.event.filter(event => {
                    const eventYear = parseInt(event.Date.split('.')[0], 10);
                    return eventYear >= selectedYearRange.startYear && eventYear <= selectedYearRange.endYear;
                });

                // Сортировка по уровню в порядке возрастания
                const sortedEvents = filteredEvents.sort((a, b) => a.level - b.level);

                sortedEvents.forEach(event => {
                    const eventElement = document.createElement('a');
                    eventElement.href = `event.html?id=${event.id}`;
                    eventElement.className = 'flex w-[80%] h-[12%] ml-[7%] bg-[#D9D9D9] bg-opacity-30 rounded-[15px] p-[1%] mb-[2%] justify-between';

                    const eventContentWrapper = document.createElement('div');
                    eventContentWrapper.className = 'flex';

                    const imageElement = document.createElement('img');
                    imageElement.src = event.file && event.file.length > 0 ? `${baseUrl}${event.file[0].pathWeb}` : '/images/no-photo.svg';
                    imageElement.alt = event.file && event.file.length > 0 ? event.file[0].disc : '';
                    imageElement.className = 'preview-image rounded-[15px] fixed-size w-[175px]';

                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'flex flex-col pl-[2.5%]';

                    const titleElement = document.createElement('h1');
                    titleElement.textContent = truncateText(event.Name, 56);

                    const dateElement = document.createElement('p');
                    dateElement.className = 'mt-[10%]';
                    dateElement.textContent = event.Date;

                    contentDiv.appendChild(titleElement);
                    contentDiv.appendChild(dateElement);

                    eventContentWrapper.appendChild(imageElement);
                    eventContentWrapper.appendChild(contentDiv);

                    const aboutImageWrapper = document.createElement('div');
                    aboutImageWrapper.className = 'flex ';

                    const aboutImageElement = document.createElement('img');
                    aboutImageElement.src = '/images/about.svg';
                    aboutImageElement.alt = '';
                    aboutImageElement.className = 'fixed-size';

                    aboutImageWrapper.appendChild(aboutImageElement);

                    eventElement.appendChild(eventContentWrapper);
                    eventElement.appendChild(aboutImageWrapper);

                    eventsContainer.appendChild(eventElement);
                });
            }
        });
}
