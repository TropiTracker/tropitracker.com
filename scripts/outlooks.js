const api = 'https://api.tropitracker.com/outlooks?nocache=' + Date.now()

document.addEventListener('DOMContentLoaded', () => {
    const atlButton = document.getElementById("atlButton");
    const pacButton = document.getElementById("pacButton");
    const cpacButton = document.getElementById("cpacButton");

    const atlImage = document.getElementById("atlImage");
    const pacImage = document.getElementById("pacImage");
    const cpacImage = document.getElementById("cpacImage");

    const outlookText = document.getElementById("outlook");

    fetchOutlookData('atlantic', outlookText);

    atlButton.onclick = () => changeImageDisplay('atlantic', outlookText, atlImage, pacImage, cpacImage);
    pacButton.onclick = () => changeImageDisplay('eastPacific', outlookText, pacImage, atlImage, cpacImage);
    cpacButton.onclick = () => changeImageDisplay('centralPacific', outlookText, cpacImage, pacImage, atlImage);
});

function fetchOutlookData(region, outlookText) {
    fetch(api)
        .then(response => response.json())
        .then(data => {
            const outlookData = data[`${region}`].description;
            console.log(JSON.stringify(outlookData))

            outlookText.innerHTML = outlookData;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function changeImageDisplay(region, outlookText, showImage, ...hideImages) {
    showImage.style.display = "block";
    hideImages.forEach(image => image.style.display = "none");

    fetchOutlookData(region, outlookText);
}

function openNav() {
    const nav = document.getElementById('fullscreenNavbar');
    nav.style.display = 'block';
}

function closeNav() {
    const nav = document.getElementById('fullscreenNavbar');
    nav.style.display = 'none';
}