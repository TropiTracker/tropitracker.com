document.addEventListener('DOMContentLoaded', () => {
    const stormCount = document.getElementById('storm-count');

    const depList = document.getElementById('depressions');
    const stormList = document.getElementById('storms');

    let hideTD = true;

    const api = 'https://api.tropitracker.com/active_storms'

    let currentImageType = 'cone';

    const depButton = document.getElementById('depression-label');
    depButton.onclick = toggleTD;

    const hurricaneDropdown = document.getElementById('depression-dropdown');

    function toggleTD() {
        if (hideTD) {
            depList.style.display = "block";
            hurricaneDropdown.innerHTML = "arrow_drop_down";
            hideTD = false;
        } else {
            depList.style.display = "none";
            hurricaneDropdown.innerHTML = "arrow_right";
            hideTD = true;
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
                data.active_storms.forEach(depression => {
                    const name = depression.name
                    const type = depression.type
                    const datetime = depression.datetime
                    const movement = depression.movement
                    const pressure = depression.pressure
                    const wind = depression.wind
                    const headline = depression.headline
                    const coneTrack = depression.coneTrack
                    const satelliteGif = depression.satelliteGif
                    const irSatelliteGif = depression.irSatelliteGif

                    const stormData = { type, name, datetime, movement, pressure, wind, headline, coneTrack, satelliteGif, irSatelliteGif };
                    if (type == "HU") {
                        currentStormData.hurricanes.push(stormData);
                    } else if (type == "TS") {
                        currentStormData.storms.push(stormData);
                    } else if (type == "TD" || type == "PTC" || type == "PC") {
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
        updateStormList(depList, stormData.depressions, "depression");

        const activeTropicalDeps = depList.children.length;

        let depProperGrammar = activeTropicalDeps === 1 ? "Tropical Depression" : "Tropical Depressions";
        let areIs = activeTropicalDeps === 1 ? "is" : "are";

        stormCount.textContent = `There ${areIs} ${activeTropicalDeps} active ${depProperGrammar}.`;

        depButton.style.display = activeTropicalDeps === 0 ? "none" : "block";
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

        if (type == "TD") {
            stormListItem.className = "depression-list-item";
            stormListItem.innerHTML = `${type} ${name}`;
        } else if (type == "PC" || type == "PTC") {
            stormListItem.className = "depression-list-item";
            stormListItem.innerHTML = `Potential TC ${name}`;
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
