var listeAnalogies = document.querySelector('.analogies-list'); //div recevant les analogies
var shortCodesList = []; //Tableau contenant tous les shortCodes des analogies
var currentHash = window.location.hash; //Récupération de l'encre pour y accéder après chargement des analogies
var headerHeight = document.querySelector('#accueil').offsetHeight;
var footerHeight = document.querySelector('#bas').offsetHeight;
var documentHeight;
var vpHeight = window.innerHeight;
var activePos;
var creditsList = document.querySelector('.credits-list');
var ready = false;

//# Récupération des analogies
fetch('data/analogies.json').then(function (response) { 
    response.json().then(function (data) { 
        fetch('data/modele_credits.html').then(function(response) {
            response.text().then(function (modeleCredits) {
                fetch('data/modele.html').then(function (response) {  //## Récupération du modèle d'analogies
                    response.text().then(function (toReplace) {
                        data.forEach(function (obj, index) {
                            shortCodesList.push(obj.shortCode);
                            var toReplace2 = toReplace
                            Object.keys(obj).forEach(function (key) { //Récupère toutes les clés dans les objets analogies
                                if (key == 'valeurAnalogie' || key == 'explication') { //### Système de détection de liens Markdown dans la valeur et l'explication de l'analogie
                                    let content = obj[key];
                                    let elements = content.match(/\[.*?\)/g);
                                    if (elements != null && elements.length > 0) {
                                        elements.forEach(function (el) {
                                            let txt = el.match(/\[(.*?)\]/)[1];
                                            let url = el.match(/\((.*?)\)/)[1];
                                            content = content.replace(el,'<a href="' + url + '" class="link" title="' + url + '" target="_blank">' + txt + '</a>')
                                            toReplace2 = toReplace2.replaceAll('{{' + key + '}}', content);
                                        });
                                    }
                                }
                                toReplace2 = toReplace2.replaceAll('{{' + key + '}}', obj[key]); //Remplace toutes les occurences {{clé}} dans le modèle par les valeurs des clés
                            });
                            listeAnalogies.innerHTML += toReplace2;
                            creditsList.innerHTML += modeleCredits.replaceAll('{{media}}', obj['media']).replaceAll('{{licence}}', obj['licence']);
                            if (index == data.length - 1) { //Détecte la fin du forEach
                                location.hash = currentHash;
                                documentHeight = document.documentElement.scrollHeight;
                                ready = true;
                            }
                        });
                    });
                });
            });
        });
    });
});

//# Change les variables vpHeight (viewport height) et documentHeight quand le viewport est redimensionné
window.addEventListener('resize', function () {
    vpHeight = window.innerHeight;
    documentHeight = document.documentElement.scrollHeight; //Besoin de recharger hauteur totale de la page car analogies occupent une auteur relative au viewport (100vh)
});

/*# Associe un entier (activePos) à une analogie dans le tableau (shortCodesList), et peut accéder à une encre avec le paramètre goto.
Une fois l'association effectuée, on change l'url de la page et le title.*/
function scrollactivePos(activePos, shortCodesList, goto) {
    if (ready == true) {
        let gotoHref;
        if (activePos < 0) { //Header
            window.history.pushState(undefined, undefined, 'index.html#accueil');
            document.title = 'Accueil - MPC';
            gotoHref = 'accueil';
        } else if (activePos >= shortCodesList.length) { //Footer
            window.history.pushState(undefined, undefined, 'index.html#bas');
            document.title = 'Pied de page - MPC';
            gotoHref = "bas";
        } else { //Entre header et footer
            window.history.pushState(undefined, undefined, 'index.html#' + shortCodesList[activePos]);
            console.log(shortCodesList)
            document.title = (shortCodesList[activePos])[0].toUpperCase() + shortCodesList[activePos].slice(1) + ' - MPC'; //Rajoute une majuscule au shortCode
            gotoHref = shortCodesList[activePos];
        }
        if (goto == true) {
            location.hash = gotoHref; //Si goto vrai, alors on accède à l'encre
        }
    }
};

//# Détecte au scroll l'analogie à l'écran et lui associe un entier (activePos)
document.addEventListener('scroll', function () {
    let scroll = window.scrollY;
    let newPos;
    if (scroll < headerHeight / 2) {
        newPos = -1; //Header
    } else if ((scroll + vpHeight) > (documentHeight - (footerHeight / 2))) {
        newPos = shortCodesList.length + 1; //Footer
    } else {
        newPos = Math.round(scroll / (listeAnalogies.offsetHeight / shortCodesList.length));  //Entre header et footer - Divise le scroll par le nombre d'analogies pour déterminer activePos
    }
    if (newPos != activePos && newPos !== 'undefined') {
        activePos = newPos;
        scrollactivePos(activePos,shortCodesList); //Appelle scrollactivePos avec la positiion détectée (activePos) et le tableau des shortCodes
    }
});