var liste = require('./vue-a-faire/liste.handlebars')

module.exports = function(modele) {
 document.getElementById('liste').innerHTML = creerHtml(modele)
}

function creerHtml(modele) {
 var html =  liste({data: modele.data})
 return html
}
