var modelePreview;

fetch('data/modele_preview.html').then(function(response) {  // Récupération du modèle d'analogies dans sa version previex
    response.text().then(function (toReplace){
        modelePreview = toReplace;
    });
});

function displayModal(modal) { // Gestion des modales
    if (modal) { // Détermine la modale à afficher
        let modalDiv = document.querySelector('.' + modal);
        modalDiv.innerHTML += '<div class="bg"></div>'
        modalDiv.classList.remove('hidden');
        document.querySelector('.' + modal + ' .bg').addEventListener('click', function () {
            displayModal();
        });
    } else { // Ferme toutes les modales si pas de class de modale en entrée
        let modalClass = document.querySelectorAll('.modal');
        modalClass.forEach(function (el) {
            el.classList.add('hidden');
        });
        let bg = document.querySelectorAll('.modal .bg');
        bg.forEach(function (el) {
            el.remove();
        });
    }
}

function editorNav(requested) { // Permet de mettre en surbrillance les liens actifs en bas de la modale
    let navA = document.querySelectorAll('.editor nav a');
    navA.forEach(function (el) {
        el.classList.remove('selected');
    });
    document.querySelector('.editor nav .' + requested).classList.add('selected');
}

editorNav('toPreview');

function refreshEditorData() { // Rafraîchit les données dans la preview
    let analogie = document.querySelector('#analogie-editor').value;
    let valeurAnalogie = document.querySelector('#valeurAnalogie-editor').value;
    let explication = document.querySelector('#explication-editor').value;
    let newModelePreview = modelePreview.replace('{{analogie}}', analogie).replace('{{valeurAnalogie}}', valeurAnalogie).replace('{{explication}}', explication);
    document.querySelector('.editor .preview').innerHTML = newModelePreview;
}

var apiUrl = "https://perso-etudiant.u-pem.fr/~gambette/portrait/api.php?format=json&login=leo.planus&courriel={{email}}&message="
var message = "Si j\'étais {{analogie}}, je serais {{valeurAnalogie}}. {{explication}}"
var editorResponse = document.querySelector('.editorResponse');

function sendAnalogy() { // Envoie les données vers l'api
    let analogie = document.querySelector('#analogie-editor').value;
    let valeurAnalogie = document.querySelector('#valeurAnalogie-editor').value;
    let explication = document.querySelector('#explication-editor').value;
    let email = document.querySelector('#email-editor').value;
    let newApiUrl = message.replace('{{analogie}}', analogie).replace('{{valeurAnalogie}}', valeurAnalogie).replace('{{explication}}', explication);
    newApiUrl = apiUrl.replace('{{email}}', email) + encodeURIComponent(newApiUrl); // Encode les chaînes de caractères pour être intégrées dans une URL
    fetch(newApiUrl).then(function (response) {
        response.json().then(function (data) {
            if (data.status == 'success') { // Tout va bien
                editorResponse.innerHTML = data.message;
            } else { // Erreur de l'API
                editorResponse.innerHTML = data.message;
                editorResponse.classList.add('notOk');
            }
            editorResponse.classList.remove('hidden');
            setTimeout(function () { // Info-bulle de 5 secondes sur l'état de l'envoi
                editorResponse.classList.add('hidden');
                editorResponse.classList.remove('notOk');
            }, 5000);
        });
    }).catch(function (error) { // Quand tout va mal - Impossible de joindre l'API
        editorResponse.innerHTML = 'Une erreur inattendue est survenue.<br>' + error;
        editorResponse.classList.add('notOk');
        editorResponse.classList.remove('hidden');
        setTimeout(function () {
            editorResponse.classList.add('hidden');
            editorResponse.classList.remove('notOk');
        }, 5000);
    });
    location.hash = "editor-editor";
    displayModal();
}