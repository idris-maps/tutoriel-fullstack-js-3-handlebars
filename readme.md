# Handlebars

Dans le chapitre précedent, la vue de notre application était une chaîne de caractères HTML créée à l'intérieur du script ```vue-a-faire.js```. Le problème avec cette approche est un mélange de HTML et de javacript qui peut devenir illisible pour des applications plus complexes. Nous allons maintenant séparer les deux à l'aide d'une libraire "patron" ("templating engine" en anglais). Pour cet exercice j'ai choisi [handlebars](http://handlebarsjs.com/).

## Mise en place

Nous allons réutiliser le modèle et les controleurs du chapitre précédent et ne changer que la vue. 

Créez un nouveau dossier ```3.handlebars```, copiez le contenu du dossier ```2.vanilla``` du [chapitre 2](link_to_do) et ouvrez le fichier ```package.json``` pour en modifier le nom.

```
{
  "name": "handlebars", // <-- modifié
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "browserify main.js -o public/script.js | minify public/script.js -o public/script.js"
  },
  "author": "",
  "license": "ISC"
}
```

Dans ```public/index.html``` changer le titre.

```
<title>Handlebars</title>
```

Nous allons aussi télécharger ```handlebars``` ainsi que le module ```browserify-handlebars``` avec NPM. Ouvrez le terminal dans le dossier du projet.

```
$ cd ~/Desktop/3.handlebars
$ npm install handlebars browserify-handlebars --save
```

Dans le dossier ```lib``` créez un nouveau dossier ```vue-a-faire``` où nous allons ajouter la nouvelle vue.

## Vue handlebars

Dans ```lib/vue-a-faire```, créez un fichier ```liste.handlebars```.

```
{{#each data}}
<div
 {{#if fait}} class="liste-element fait"
 {{else}} class="liste-element a-faire"
 {{/if}}
 >
 <div class="liste-element-info">
  <div class="liste-element-texte">
   <p>{{text}}</p>
  </div>
  <div class="liste-element-modif">
   <span class="glyphicon glyphicon-pencil"></span>
  </div>
  <div class="liste-element-statut">
   <span
    {{#if fait}} class="glyphicon glyphicon-remove"
    {{else}} class="glyphicon glyphicon-ok"
    {{/if}}
   ></span>
  </div>
 </div>

 {{#if maj}}
 <div class="liste-element-maj">
  <div class="liste-element-maj-input">
   <input class="form-control" id="liste-element-maj-input" type="text">
  </div>
  <div class="liste-element-maj-bouton">
   <button class="btn btn-primary" id="liste-element-maj-bouton">OK</button>
  </div>
 </div>
 {{/if}}

</div>
{{/each}}
```

Nous avons ici repris le HTML d'un élément de la liste de choses à faire qui, comme nous l'avons vu dans le chapitre précédent, sera représenté différemment selon qu'il soit marqué comme ```fait``` ou non et selon qu'il soit en cours de modification ou pas.

### Sémantique handlebars

Les balises handlebars sont représentées par les caractères ```{{``` et ```}}```.

#### Boucle

```
{{#each data}}

 // HTML de chaque objet du dictionnaire "data"

{{/each}}
```

Pour chaque objet du dictionnaire ```data```, handlebars va créer le HTML entre les balises ```each```.

#### Condition

Dans handlebars une condition est exprimée par la balise ```{{#if}}```.

Dans notre example:

```
<div
 {{#if fait}} class="liste-element fait"
 {{else}} class="liste-element a-faire"
 {{/if}}
 >
```

Si l'objet du dictionnaire ```data``` est ```fait``` la ```<div>``` aura les classes ```liste-element``` et ```fait```. Sinon (```{{else}}```), elle aura les classes ```liste-element``` et ```a-faire```.

De la même manière le ```<span>``` dans ```<div class="liste-element-statut">``` aura différentes classes dépendant de ce que l'objet soit ```fait``` ou non.

Le conditionnel peut aussi être utilisé pour montrer ou non un bloque de code HTML. Dans notre exemple, la partie ```<div class="liste-element-maj">``` est montrée si l'objet est en cours de modification.

#### Insérer une chaîne caractère du modèle

Nous insérons le ```text``` de l'objet en utilisant les balises handlebars. Dans notre exemple:

```
<p>{{text}}</p>
```

### Intégrer la vue dans notre application

Ouvrez le fichier ```lib/vue-a-faire.js```. Vous pouvez effacer la fonction ```creerHtmlElement()``` puisque le patron handlebars se chargera de cette partie. Nous allons garder la fonction ```creerHtml()``` mais la réécrire, effacez son contenu.

Le fichier ressemble maintenant à ça:

```
module.exports = function(modele) {
 document.getElementById('liste').innerHTML = creerHtml(modele)
}

function creerHtml(modele) {

}
```

En haut de page, créez un lien vers le patron ```liste.handlebars```.

```
var liste = require('./vue-a-faire/liste.handlebars')
```

À l'intérieur de la fonction ```creerHtml()``` nous allons passer le dictionnaire ```data``` du modèle à la vue ```liste``` et renvoyer le HTML ainsi créé.

```
var liste = require('./vue/liste.handlebars')

module.exports = function(modele) {
 document.getElementById('liste').innerHTML = creerHtml(modele)
}

function creerHtml(modele) {
 var html =  liste({data: modele.data})
 return html
}
```

### Transformer la vue avec browserify

```browserify``` combine les fichiers javascript en un seul fichier qui sera téléchargez avec le fichier HTML. Notre vue ```liste.handlebars``` n'étant pas écrite en javascript nous devons utiliser une transformation ```browserify```. C'est la librairie ```browserify-handlebars``` que nous avons téléchargée tout à l'heure.

Ouvrez ```package.json``` et modifiez le script ```build``` en ajoutant ```-t browserify-handlebars``` pour qu'il utilise la transformation:

```
{
  "name": "handlebars",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "browserify main.js -o public/script.js -t browserify-handlebars | minify public/script.js -o public/script.js"
  },
  "author": "",
  "license": "ISC"
}
```

Vous pouvez maintenant mettre à jour ```script.js``` dans le dossier ```public``` en ouvrant un terminal pour lancer le script ```build```.

```
$ npm run build
```

Ouvrez ```public/index.html``` dans le navigateur.

## Conclusion

Nous avons utilisé un script externe pour un rendu de la vue plus propre. Il existe beaucoup d'alternatives à handlebars que vous pouvez trouver par une simple [recherche sur internet](https://www.google.fr/#q=template+engine+javascript+frontend).

Dans le [prochain chapitre](link_to_do) nous allons créer des composants qui englode vue et controleurs.



