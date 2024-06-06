document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const personId = urlParams.get('id');

    console.log(`Person ID: ${personId}`);

    if (personId) {
        fetchPersonDetails(personId);
        displayPersonEvents(personId);
    }
});

const baseUrl = "https://ib.komisc.ru";

function fetchPersonDetails(personId) {
    const api = 'https://ib.komisc.ru/vm/get.php?personAll';
    fetch(api, {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            if (data.person && Array.isArray(data.person)) {
                const personData = data.person.find(person => person.id === personId);

                if (!personData) {
                    console.error('Person not found');
                    return;
                }

                const personFileData = data.personFile ? data.personFile.find(file => file.name === `${personData.F} ${personData.I} ${personData.O}`) : null;

                console.log('Person data:', personData);
                console.log('Person file data:', personFileData);

                displayPersonDetails(personData, personFileData);
                displayPersonAbout(personData, personFileData);
                displayAchiv(personData, personFileData);
            } else {
                console.error('Invalid data format');
            }
        })
        .catch(error => {
            console.error('Error fetching person data:', error);
        });
}

function displayPersonDetails(person, personFile) {
    const personDetails = document.getElementById('personDetails');

    if (!personDetails) {
        console.error('Element with id "personDetails" not found');
        return;
    }

    const container = document.createElement('div');
    container.className = 'flex flex-row justify-center mt-[5%]';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'flex-none';

    const imageElement = document.createElement('img');
    imageElement.src = personFile ? `${baseUrl}${personFile.pathWeb}` : '/images/no-photoo.svg';
    imageElement.alt = personFile ? personFile.disc : '';
    imageElement.className = 'rounded mb-4 w-[80%] ml-[10%]';

    imageContainer.appendChild(imageElement);

    const infoContainer = document.createElement('div');
    infoContainer.className = 'w-[59%] h-[25%] pb-[2%] bg-[#0038A8] bg-opacity-20 rounded-[15px]';

    const nameElement = document.createElement('h1');
    nameElement.className = 'ml-[2.5%] mt-[1.5%] text-4xl font-bold';
    nameElement.textContent = `${person.F} ${person.I} ${person.O}`;

    const commentdayN = document.createElement('p');
    commentdayN.className = 'mb-4 ml-[2.5%]';
    commentdayN.textContent = `Дата рождения: ${person.dayN}`;

    const dolElement = document.createElement('p');
    dolElement.className = 'text-lg mb-4 ml-[2.5%]';
    dolElement.textContent = `Должность: ${person.dol}`;

    infoContainer.appendChild(nameElement);
    infoContainer.appendChild(commentdayN);

    if (person.dayD && person.dayD !== "0000-00-00") {
        const commentdayD = document.createElement('p');
        commentdayD.className = 'mb-4 ml-[2.5%]';
        commentdayD.textContent = `Дата смерти: ${person.dayD}`;
        infoContainer.appendChild(commentdayD);
    }

    infoContainer.appendChild(dolElement);

    container.appendChild(imageContainer);
    container.appendChild(infoContainer);

    personDetails.appendChild(container);
}

function displayPersonAbout(person, personFile) {
    const personAbout = document.getElementById('personAbout');

    if (!personAbout) {
        console.error('Element with id "personAbout" not found');
        return;
    }

    const container = document.createElement('div');
    container.className = 'flex flex-col items-start w-[80%] h-[30%] ml-[2.5%] p-[1%] bg-[#0038A8] bg-opacity-20 rounded-[15px]';

    const titleElement = document.createElement('h1');
    titleElement.className = 'flex text-2xl font-bold mb-2';
    titleElement.textContent = `Биография`;

    const commentElement = document.createElement('p');
    commentElement.className = 'mb-4';
    commentElement.textContent = `${person.comment}`;

    container.appendChild(titleElement);
    container.appendChild(commentElement);

    personAbout.appendChild(container);
}

function displayAchiv(person, personFile) {
    if (person.awards !== null && person.awards.trim() !== "") {
        const personAchiv = document.getElementById('personAchiv');

        if (!personAchiv) {
            console.error('Element with id "personAchiv" not found');
            return;
        }

        const containerAchiv = document.createElement('div');
        containerAchiv.className = 'flex flex-col items-start w-[80%] h-[30%] ml-[2.5%] p-[1%] bg-[#0038A8] bg-opacity-20 rounded-[15px]';

        const titleAchiv = document.createElement('h1');
        titleAchiv.className = 'flex text-2xl font-bold mb-2';
        titleAchiv.textContent = `Достижения`;

        const commentElement = document.createElement('p');
        commentElement.className = 'mb-4';
        commentElement.textContent = `${person.awards}`;

        containerAchiv.appendChild(titleAchiv);
        containerAchiv.appendChild(commentElement);

        personAchiv.appendChild(containerAchiv);
    }
}

function fetchEventData() {
    return fetch('event.json') // Замените на реальный путь к вашему файлу event.json
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => data)
        .catch(error => {
            console.error('Error fetching event data:', error);
            return null;
        });
}

function findPersonEvents(personId, events) {
    return events.filter(event => event.person.some(person => person.id === personId));
}

function displayPersonEvents(personId) {
    fetchEventData().then(eventData => {
        if (eventData && eventData.event) {
            const personEvents = findPersonEvents(personId, eventData.event);

            const eventContainer = document.getElementById('personEvents');

            if (!eventContainer) {
                console.error('Element with id "personEvents" not found');
                return;
            }

            personEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event-item';

                const eventLink = document.createElement('a');
                eventLink.href = `./event.html?id=${event.id}`; // Замените на реальный путь к странице события
                eventLink.className = 'block p-4 mb-4 bg-white rounded shadow hover:bg-gray-100';

                const eventTitle = document.createElement('h2');
                eventTitle.textContent = event.Name;
                eventLink.appendChild(eventTitle);

                const eventDate = document.createElement('p');
                eventDate.textContent = `Дата: ${event.Date}`;
                eventLink.appendChild(eventDate);

                if (event.file && event.file.length > 0) {
                    const eventImage = document.createElement('img');
                    eventImage.src = `${baseUrl}${event.file[0].pathWeb}`;
                    eventImage.alt = event.file[0].disc;
                    eventLink.appendChild(eventImage);
                }

                eventElement.appendChild(eventLink);
                eventContainer.appendChild(eventElement);
            });
        }
    });
}