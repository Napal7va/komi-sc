document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    console.log(`Event ID: ${eventId}`); // Добавлено для отладки

    if (eventId) {
        fetchEventDetails(eventId);
    }
});

const baseUrl = "https://ib.komisc.ru";

function fetchEventDetails(eventId) {
    fetch('event.json')
        .then(response => response.json())
        .then(data => {
            if (data.event && Array.isArray(data.event)) {
                const event = data.event.find(event => event.id === eventId);

                console.log(`Event data:`, event); // Добавлено для отладки

                if (event) {
                    displayEventDetails(event);
                } else {
                    console.error('Event not found'); // Добавлено для отладки
                }
            } else {
                console.error('Invalid data format'); // Добавлено для отладки
            }
        })
        .catch(error => {
            console.error('Error fetching event data:', error); // Добавлено для отладки
        });
}

function displayEventDetails(event) {
    const eventDetails = document.getElementById('eventDetails');

    const titleElement = document.createElement('h1');
    titleElement.className = 'text-2xl font-bold mb-4';
    titleElement.textContent = event.Name;

    const dateElement = document.createElement('p');
    dateElement.className = 'text-lg mb-4';
    dateElement.textContent = `Дата: ${event.Date}`;

    const personList = document.createElement('ul');
    personList.className = 'mb-4';

    if (event.person && event.person.length > 0) {
        event.person.forEach(person => {
            const personItem = document.createElement('li');
            const personLink = document.createElement('a');
            personLink.href = `person.html?id=${person.id}`;
            personLink.textContent = person.Name;
            personItem.appendChild(personLink);
            personList.appendChild(personItem);
        });
    } else {
        const noPersonItem = document.createElement('li');
        noPersonItem.textContent = 'Нет информации о персонах';
        personList.appendChild(noPersonItem);
    }

    const tagList = document.createElement('ul');
    tagList.className = 'mb-4';
    event.tag.forEach(tag => {
        const tagItem = document.createElement('li');
        tagItem.textContent = tag.Name;
        tagList.appendChild(tagItem);
    });

    const imageElement = document.createElement('img');
    imageElement.src = event.file && event.file.length > 0 ? `${baseUrl}${event.file[0].pathWeb}` : '/images/no-photo.svg';
    imageElement.alt = event.file && event.file.length > 0 ? event.file[0].disc : '';
    imageElement.className = 'rounded mb-4';

    eventDetails.appendChild(titleElement);
    eventDetails.appendChild(dateElement);
    eventDetails.appendChild(document.createTextNode('Персоны:'));
    eventDetails.appendChild(personList);
    eventDetails.appendChild(document.createTextNode('Теги:'));
    eventDetails.appendChild(tagList);
    eventDetails.appendChild(imageElement);
}
