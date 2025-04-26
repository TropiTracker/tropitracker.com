document.addEventListener('DOMContentLoaded', () => {
    const stormCount = document.getElementById('storm-count');

    const hurricaneList = document.getElementById('hurricanes');
    const depList = document.getElementById('depressions');
    const stormList = document.getElementById('storms');

    const api = 'https://api.tropitracker.com/active_storms';

    let hideHurricanes = true;

    let currentImageType = 'cone';

    const hurricaneButton = document.getElementById('hurricane-label');
    hurricaneButton.onclick = toggleHurricanes;

    const hurricaneDropdown = document.getElementById('hurricane-dropdown');

    function toggleHurricanes() {
        if (hideHurricanes) {
            hurricaneList.style.display = "block";
            hurricaneDropdown.innerHTML = "arrow_drop_down";
            hideHurricanes = false;
        } else {
            hurricaneList.style.display = "none";
            hurricaneDropdown.innerHTML = "arrow_right";
            hideHurricanes = true;
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
                data.active_storms.forEach(hurricane => {
                    const name = hurricane.name
                    const type = hurricane.type
                    const datetime = hurricane.datetime
                    const movement = hurricane.movement
                    const pressure = hurricane.pressure
                    const wind = hurricane.wind
                    const headline = hurricane.headline
                    const coneTrack = hurricane.coneTrack
                    const satelliteGif = hurricane.satelliteGif
                    const irSatelliteGif = hurricane.irSatelliteGif

                    const stormData = { type, name, datetime, movement, pressure, wind, headline, coneTrack, satelliteGif, irSatelliteGif };
                    if (type.toLowerCase() == "hurricane") {
                        currentStormData.hurricanes.push(stormData);
                    } else if (type.toLowerCase() == "tropical storm") {
                        currentStormData.storms.push(stormData);
                    } else if (type.toLowerCase() == "tropical depression" || type.toLowerCase() == "potential tropical cyclone") {
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
        updateStormList(hurricaneList, stormData.hurricanes, "hurricane");

        const activeHurricanes = hurricaneList.children.length;

        let hurricaneProperGrammar = activeHurricanes === 1 ? "Hurricane" : "Hurricanes";

        stormCount.textContent = `There are ${activeHurricanes} active ${hurricaneProperGrammar}.`;

        hurricaneButton.style.display = activeHurricanes === 0 ? "none" : "block";
    }

    function updateStormList(listElement, storms, type) {
        listElement.innerHTML = '';
        storms.forEach(storm => {
            const stormListItem = createStormListItem(
                storm.type, storm.name, storm.category, storm.datetime,
                storm.movement, storm.pressure, storm.wind, storm.headline, storm.coneTrack, storm.satelliteGif, storm.irSatelliteGif
            );
            listElement.appendChild(stormListItem);

            const imageToShow = stormListItem.querySelector(`#${currentImageType}Image`);
            if (imageToShow) {
                changeImageDisplay(imageToShow, ...stormListItem.querySelectorAll('.storm-image:not(#' + currentImageType + 'Image)'));
            }
        });
    }

    function createStormListItem(type, name, category, datetime, movement, pressure, wind, headline) {
        const stormListItem = document.createElement('div');

        const stormText = document.createElement('span');
        stormListItem.appendChild(stormText);

        if (type.toLowerCase() == "hurricane") {
            const hurricaneIcon = document.createElement('img');
            hurricaneIcon.src = '/images/hurricane.png';
            hurricaneIcon.id = 'hurricane-icon';
            hurricaneIcon.style.marginRight = "5px";
            stormListItem.className = "hurricane-list-item";
            stormListItem.appendChild(hurricaneIcon);

            if (category >= 3) {
                type = "Major Hurricane";
            } else {
                type = "Hurricane";
            }

            stormListItem.innerHTML += `${type} ${name}: Category ${category}`;
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
        details.innerHTML = `Winds: ${wind} MPH<br>Pressure: ${pressure}<br>Movement: ${movement}`;
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