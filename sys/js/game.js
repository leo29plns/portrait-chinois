var score = 0;
var votesNumber = 0;
var opinions;
var progressBar = document.querySelector('.progress-bar .mask');
var placeHolderTitle = document.querySelector('.score-display h5');
var placeHolderDesc = document.querySelector('.score-display h6');


//# Charge les phrases qui seront associées au score
fetch('data/game_opinions.json').then(function (response){ 
    response.json().then(function(data){ 
        opinions = data;
    });
});

//# Fonction appelée par boutons dans chaque analogie
function makeVote(shortCode, vote) {
    let refusedBtn = document.querySelector('#' + shortCode + 'Refused');
    let approvedBtn = document.querySelector('#' + shortCode + 'Approved');
    let resetBtn = document.querySelector('#' + shortCode + 'Reset');
    refusedBtn.classList.add('hidden');
    approvedBtn.classList.add('hidden');
    if (vote == 'refused') { // Analogie désapprouvée, on réduit de 1 le score, et on compte un vote (votesNumber). On affiche resetBtn si l'utilisateur veut annuler
        score--;
        votesNumber++;
        resetBtn.setAttribute('value', 'Désapprouvé');
        resetBtn.classList.remove('btn-valid');
        resetBtn.classList.add('btn-notvalid');
        resetBtn.classList.remove('hidden');
    } else if (vote == 'approved') {
        score++;
        votesNumber++;
        resetBtn.setAttribute('value', 'Approuvé');
        resetBtn.classList.remove('btn-notvalid');
        resetBtn.classList.add('btn-valid');
        resetBtn.classList.remove('hidden');
    } else { // L'utilisateur annule, on rétablie le score et on annule le vote
        if (resetBtn.classList.contains('btn-valid') == true) {
            score--;
        } else {
            score++;
        }
        votesNumber--;
        resetBtn.classList.add('hidden');
        refusedBtn.classList.remove('hidden');
        approvedBtn.classList.remove('hidden');
    }
    refreshScore(); // Appelle refreshScore
};

//# Détermine la phrase associée au score
function refreshScore() {
    let descEnd = ' votes.';
    let relativeScore = (score - votesNumber * -1) / (votesNumber * 2); // Place le score sur une échelle de 0 à 1 dans relativeScore
    if (!relativeScore > 0) {
        relativeScore = 0;
    }
    if (votesNumber <= 1) {
        descEnd = ' vote.';
    }
    let opinionNumber = Math.round(relativeScore * (opinions.length - 1)) // Associe relativeScore à une phrase
    progressBar.style.width = ((1 - relativeScore) * 100) + '%';
    placeHolderTitle.innerHTML = opinions[opinionNumber];
    placeHolderDesc.innerHTML = Math.round(relativeScore * 100) + '% d\'approbation pour ' + votesNumber + descEnd;
}