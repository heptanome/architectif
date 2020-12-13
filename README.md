# Architect'IF

*Hexanôme H4213*

*Auteurs*:
  - BATEL Arthur
  - BODELOT Paul
  - BUONOMO Fanny
  - GUERRAOUI Camélia
  - KESSIBI Guillaume
  - PELTIER Camille
  - ZIEGER Luise

## Introduction
Dans le cadre de notre projet de Web Sémantique, nous avons créé un moteur de
recherche spécialisé dans les bâtiments architecturaux. L'objectif de ce
document est de vous guider dans l'utilisation de ce moteur de recherche, et
plus particulièrement de son interface graphique.

## Lancer le projet

Nous avons fait le choix d'une architecture très simple. Pour utiliser notre
projet, il suffit d'ouvrir le fichier `index.html` à l'aide d'un navigateur.
Nous vous recommandons d'utiliser *Firefox*.

## Utiliser le moteur de recherche

### Recherche par mots-clé

Une fois la page `index.html` chargée, vous pouvez préciser des mots-clé à
rechercher. Ces mots-clés doivent être en anglais. Par exemple, la recherche
`tour eiffel` ne renverra aucun résultat, tandis que la recherche `eiffel tower`
en renverra deux. La casse n'influe pas sur les résultats, mais **l'ordre des
mots-clé et leur orthographe doivent être corrects**.

Vous pouvez préciser le nombre de résultats que vous souhaitez voir afficher.
En cliquant sur le bouton `Submit`, la recherche est lancée. Il faut être
patient, cette dernière peut être assez longue. Une fois les résultats de votre
recherche affichés, si jamais ces derniers sont plus nombreux que prévus, vous
avez la possibilité de cliquer sur le bouton `Display All`, qui affichera tous
les résultats retournés. Pour plus d'informations sur un bâtiment de la liste,
il vous suffit de cliquer dessus.

Si vous ne trouvez pas ce que vous cherchez parmi les résultats, vous avez bien
évidemment la possibilité de relancer une recherche avec différents mots-clé.


### La page d'informations

Une fois sur la page d'un bâtiment, vous avez accès à différentes informations.
Tout en haut, vous trouverez un bouton `Go back` qui vous permettra de revenir
la page de recherche par mot-clé.

Dans l'encart `Location`, vous avez la possibilité de cliquer le nom d'une
localisation. Il peut s'agir d'un pays, d'une région, d'un département, etc.
Cliquer sur ce nom affichera, puis masquera lors d'un nouveau clic, une
description de la localisation.

Tout en bas de cette page se trouve une carte qui va vous permettre de naviguer
d'une page à l'autre. Le point rouge représente le monument que vous regadez
actuellement tandis que les points bleus représentent les monuments alentour.
En cliquant sur un point bleu, le nom du bâtiment correspondant s'affiche.
Cliquer sur ce nom vous amènera à la page d'information du monument en question.
