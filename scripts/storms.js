document.addEventListener('DOMContentLoaded', () => {
    const stormCount = document.getElementById('storm-count');

    const stormList = document.getElementById('storms');

    let hideTS = true;

    const api = 'https://api.tropitracker.com/active_storms'

    let currentImageType = 'cone';

    const stormButton = document.getElementById('storm-label');
    stormButton.onclick = toggleStorms;

    const depButton = document.getElementById('depression-label');

    const stormDropdown = document.getElementById('storm-dropdown');

    function toggleStorms() {
        if (hideTS) {
            stormList.style.display = "block";
            stormDropdown.innerHTML = "arrow_drop_down";
            hideTS = false;
        } else {
            stormList.style.display = "none";
            stormDropdown.innerHTML = "arrow_right";
            hideTS = true;
        }
    }

    function fetchStormData() {
        const currentStormData = {
            hurricanes: [],
            storms: [],
            depressions: []
        };

        fetch(api).then(response => response.json())
            .then(data => {
                data.active_storms.forEach(storm => {
                    const name = storm.name
                    const type = storm.category
                    const datetime = storm.datetime
                    const movement = storm.movement
                    const pressure = storm.pressure
                    const wind = storm.wind
                    const headline = storm.headline
                    const coneTrack = storm.coneTrack
                    const satelliteGif = storm.satelliteGif
                    const irSatelliteGif = storm.irSatelliteGif

                    const stormData = { type, name, datetime, movement, pressure, wind, headline, coneTrack, satelliteGif, irSatelliteGif };
                    if (type == "HU") {
                        currentStormData.hurricanes.push(stormData);
                    } else if (type == "TS") {
                        currentStormData.storms.push(stormData);
                    } else if (type == "TD" || type == "PTC") {
                        currentStormData.depressions.push(stormData);
                    }
                });

                updateStormLists(currentStormData);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function updateStormLists(stormData) {
        updateStormList(stormList, stormData.storms, "storm");

        const activeTropicalStorms = stormList.children.length;

        let stormProperGrammar = activeTropicalStorms === 1 ? "Tropical Storm" : "Tropical Storms";
        let areIs = activeTropicalStorms === 1 ? "is" : "are";

        stormCount.textContent = `There ${areIs} ${activeTropicalStorms} active ${stormProperGrammar}.`;

        stormButton.style.display = activeTropicalStorms === 0 ? "none" : "block";
    }

    function updateStormList(listElement, storms) {
        listElement.innerHTML = '';
        storms.forEach(storm => {
            const stormListItem = createStormListItem(
                storm.type, storm.name, storm.datetime,
                storm.movement, storm.pressure, storm.wind, storm.headline, storm.coneTrack, storm.satelliteGif, storm.irSatelliteGif
            );
            listElement.appendChild(stormListItem);

            const imageToShow = stormListItem.querySelector(`#${currentImageType}Image`);
            if (imageToShow) {
                changeImageDisplay(imageToShow, ...stormListItem.querySelectorAll('.storm-image:not(#' + currentImageType + 'Image)'));
            }
        });
    }

    function createStormListItem(type, name, datetime, movement, pressure, wind, headline, coneTrack, satelliteGif, irSatelliteGif) {
        const stormListItem = document.createElement('div');

        const stormText = document.createElement('span');
        stormListItem.appendChild(stormText);

        if (type == "tropical storm") {
            const tsIcon = document.createElement('img');
            tsIcon.src = '/images/tropical-storm.png';
            tsIcon.id = 'hurricane-icon';
            stormListItem.className = "storm-list-item";
            stormListItem.appendChild(tsIcon);

            stormListItem.innerHTML += `${type} ${name}`;
        }

        const update = document.createElement('div');
        update.className = "hurricane-update";
        update.textContent = `Last updated: ${datetime}`;
        stormListItem.appendChild(update);

        const headlineElement = document.createElement('div');
        headlineElement.className = "hurricane-headline";
        headlineElement.textContent = `${headline}`;
        stormListItem.appendChild(headlineElement);

        const details = document.createElement('div');
        details.className = "hurricane-headline";
        details.id = "details";
        details.style.marginTop = "10px";
        details.style.textDecoration = "underline";
        details.innerHTML = `Winds: ${Math.round(wind)} MPH<br>Pressure: ${pressure} mb<br>Movement: ${movement}`;
        stormListItem.appendChild(details);

        const imgButtonDiv = document.createElement('div');
        imgButtonDiv.className = 'img-button-div';
        stormListItem.appendChild(imgButtonDiv);

        const coneButton = createImgButton('Cone Tracks', () => {
            currentImageType = 'cone';
            changeImageDisplay(coneImage, satImage, irImage);
        });
        const satelliteButton = createImgButton('Satellite', () => {
            currentImageType = 'sat';
            changeImageDisplay(satImage, coneImage, irImage);
        });
        const IrSatButton = createImgButton('Infrared Satellite', () => {
            currentImageType = 'ir';
            changeImageDisplay(irImage, coneImage, satImage);
        });

        imgButtonDiv.appendChild(coneButton);
        imgButtonDiv.appendChild(satelliteButton);
        imgButtonDiv.appendChild(IrSatButton);

        const coneImage = document.createElement('img');
        coneImage.className = `storm-image`;
        coneImage.src = coneTrack;
        coneImage.id = "coneImage";
        coneImage.style.display = "block";
        stormListItem.appendChild(coneImage);

        const satImage = document.createElement('img');
        satImage.className = `storm-image`;
        satImage.src = satelliteGif;
        satImage.id = "satImage";
        satImage.style.display = "none";
        stormListItem.appendChild(satImage);

        const irImage = document.createElement('img');
        irImage.className = `storm-image`;
        irImage.src = irSatelliteGif;
        irImage.id = "irImage";
        irImage.style.display = "none";
        stormListItem.appendChild(irImage);

        return stormListItem;
    }

    function createImgButton(label, onClick) {
        const button = document.createElement('button');
        button.className = "img-button";
        button.innerHTML = label;
        button.onclick = onClick;
        return button;
    }

    function changeImageDisplay(showImage, ...hideImages) {
        showImage.style.display = "block";
        hideImages.forEach(image => image.style.display = "none");
    }

    fetchStormData();
    setInterval(fetchStormData, 60000);
});

function openNav() {
    const nav = document.getElementById('fullscreenNavbar');
    nav.style.display = 'block';
}

function closeNav() {
    const nav = document.getElementById('fullscreenNavbar');
    nav.style.display = 'none';
}