# Mon Portrait Chinois - Léo Planus

## Lien du site
[https://leo29plns.github.io/portrait-chinois/](https://leo29plns.github.io/portrait-chinois/)

## Installation sur un serveur local

Pas d'instruction particulière, déposez à la racine de votre serveur web l'ensemble des fichiers et dossiers contenus dans ce repo.

## Autres informations

1. Analogies modulables
	Les analogies sont stockées sous forme d'objets dans un tableau, à l'intérieur d'un fichier JSON /data/analogies.json
	Chaque objet comporte les clés nécessaires au fonctionnement du site, mais d'autres peuvent être aisément ajoutées sans avoir à modifier le code. Il suffit simplement de renseigner l'endroit où sera déposée l'information dans le fichier /data/modele.html sous la forme {{clé}}.
2. Lecteur de liens Markdown
	Il est possible d'intégrer des liens sous format Markdown pour la valeur de l'analogie ou de son explication. Une balise a sera automatiquement créée.
3. Gamification
	Un système "d'approbation - désapprobation" a été implémenté. Celui-ci génère un score en fonction du nombre de votes.
	Ce score est associé automatiquement à un tableau de phrases sous /data/game_opinions.json Ces phrases sont rangées de manière croissante en fonction du taux d'approbation, le programme s'occupe de lui-même d'y associer une phrase.
4. Responsive
	Ce site web est full responsive. Il est *normalement* compatible desktop et mobile.
5. Éditeur d'analogies
	Il est possible d'éditer ses propres analogies. Néanmoins, il n'est possible que de renseigner : l'analogie, la valeur de l'analogie, et une explication. Ce choix a été fait en raison du fonctionnement de l'API qui ne prend en entrée qu'un "message". Il aurait été possible de transmettre des objets par cette méthode, mais générer une simple phrase me semblait plus pertinent.
6. Fenêtres modales
	Les deux modales fonctionnent grâce à une seule fonction. Ce système est donc *théoriquement* modulable.

## Licence

Ce site web est distribué librement par Léo Planus sous la licence CC-BY 4.0