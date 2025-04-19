document.addEventListener('DOMContentLoaded', () => {
    const stormCount = document.getElementById('storm-count');

    const hurricaneList = document.getElementById('hurricanes');
    const depList = document.getElementById('depressions');
    const stormList = document.getElementById('storms');

    let hideHurricanes = true;
    let hideTS = true;
    let hideTD = true;

    let currentImageType = 'cone';

    const hurricaneButton = document.getElementById('hurricane-label');
    hurricaneButton.onclick = toggleHurricanes;

    const stormButton = document.getElementById('storm-label');
    stormButton.onclick = toggleStorms;

    const depButton = document.getElementById('depression-label');
    depButton.onclick = toggleDeps;

    const hurricaneDropdown = document.getElementById('hurricane-dropdown');
    const stormDropdown = document.getElementById('storm-dropdown');
    const depDropdown = document.getElementById('dep-dropdown');

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

    function toggleDeps() {
        if (hideTD) {
            depList.style.display = "block";
            depDropdown.innerHTML = "arrow_drop_down";
            hideTD = false;
        } else {
            depList.style.display = "none";
            depDropdown.innerHTML = "arrow_right";
            hideTD = true;
        }
    }

    function fetchStormData() {
        const currentStormData = {
            hurricanes: [],
            storms: [],
            depressions: []
        };

        const api = 'https://api.tropitracker.com/'

        fetch(api).then(response => response.json())
            .then(data => {
                data.forEach(cyclone => {
                    const name = cyclone.name
                    const type = cyclone.type
                    const datetime = cyclone.datetime
                    const movement = cyclone.movement
                    const pressure = cyclone.pressure
                    const wind = cyclone.wind
                    const headline = cyclone.headline
                    const category = cyclone.category
                    const coneTrack = cyclone.coneTrack
                    const satelliteGif = cyclone.satelliteGif
                    const irSatelliteGif = cyclone.irSatelliteGif

                    const stormData = { type, name, category, datetime, movement, pressure, wind, headline, coneTrack, satelliteGif, irSatelliteGif };
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
        updateStormList(stormList, stormData.storms, "storm");
        updateStormList(depList, stormData.depressions, "depression");

        const activeHurricanes = hurricaneList.children.length;
        const activeTropicalStorms = stormList.children.length;
        const activeTropicalDeps = depList.children.length;

        let hurricaneProperGrammar = activeHurricanes === 1 ? "Hurricane" : "Hurricanes";
        let stormProperGrammar = activeTropicalStorms === 1 ? "Tropical Storm" : "Tropical Storms";
        let depProperGrammar = activeTropicalDeps === 1 ? "Tropical Depression" : "Tropical Depressions";

        stormCount.textContent = `There are ${activeHurricanes} active ${hurricaneProperGrammar}, ${activeTropicalStorms} active ${stormProperGrammar}, and ${activeTropicalDeps} active ${depProperGrammar}.`;

        hurricaneButton.style.display = activeHurricanes === 0 ? "none" : "block";
        stormButton.style.display = activeTropicalStorms === 0 ? "none" : "block";
        depButton.style.display = activeTropicalDeps === 0 ? "none" : "block";
    }

    function updateStormList(listElement, storms) {
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

    function createStormListItem(type, name, category, datetime, movement, pressure, wind, headline, coneTrack, satelliteGif, irSatelliteGif) {
        const stormListItem = document.createElement('div');

        const stormText = document.createElement('span');
        stormListItem.appendChild(stormText);

        if (type.toLowerCase() === "hurricane") {
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
        } else if (type.toLowerCase() == "tropical storm") {
            const tsIcon = document.createElement('img');
            tsIcon.src = '/images/tropical-storm.png';
            tsIcon.id = 'hurricane-icon';
            stormListItem.className = "storm-list-item";
            stormListItem.appendChild(tsIcon);

            stormListItem.innerHTML += `${type} ${name}`;
        } else if (type.toLowerCase().includes("depression")) {
            stormListItem.className = "depression-list-item";
            stormListItem.innerHTML = `${type} ${name}`;
        } else if (type.toLowerCase().includes("potential")) {
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

    function getHurricaneCategory(winds) {
        if (winds >= 157) {
            return "5";
        } else if (winds >= 130) {
            return "4";
        } else if (winds >= 111) {
            return "3";
        } else if (winds >= 96) {
            return "2";
        } else {
            return "1";
        }
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