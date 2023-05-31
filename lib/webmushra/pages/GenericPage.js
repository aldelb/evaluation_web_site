/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

/**
* @class GenericPage
* @property {string} title the page title
* @property {string} the page content
*/
function GenericPage(_pageManager, _pageConfig) {
  this.pageManager = _pageManager;
  this.title = _pageConfig.name;
  this.content = _pageConfig.content;
  this.language = _pageConfig.language;
}

/**
* Returns the page title.
* @memberof GenericPage
* @returns {string}
*/
GenericPage.prototype.getName = function () {
  return this.title;
};

/**
* Renders the page
* @memberof GenericPage
*/
GenericPage.prototype.render = function (_parent) {
  var main_div = $("<div></div>");
  _parent.append(main_div);

  var video = '<div><video width="480" height="360" controls>\
    <source src="configs/videos/acceuil_slow.mp4" type="video/mp4">\
  </video></div>'

  var bienvenue = '<br><br>Bonjour, bienvenue sur la plateforme d’évaluation des agents virtuels.<br><br>' 
  var par1 = '<br><br><div style="text-align: left">Aujourd\'hui, vous allez devoir évaluer le comportement de plusieurs agents virtuels.<br></div>'
  var par2 = '<div style="text-align: left">Quand on parle de comportements, on parle de : <br>\
  &nbsp&nbsp o leurs expressions faciales,<br>\
  &nbsp&nbsp o leurs mouvements de tête,<br>\
  &nbsp&nbsp o leurs regards.<br>\
      <br></div>'
  
  var par3 = '<div style="text-align: left">Les évaluations se font selon deux critères : <br> \
  &nbsp&nbsp o le premier critère est  la crédibilité, c\'est-à-dire la ressemblance de leurs comportements avec des comportements humains. Ce critère est évalué sans l’audio.<br> \
  &nbsp&nbsp o Le deuxième critère est la coordination avec la parole, c\'est-à-dire l\'adéquation entre le comportement de l\'agent et le discours en termes de rythme et d\'intonation du discours.<br><br>\
    </div>'
    
  var par4 = '<div style="text-align: left">Ne vous inquiétez pas les consignes seront écrites au fur et à mesure.<br><br></div>'
  var par5 = 'Merci beaucoup de prendre le temps de faire cette évaluation.<br><br> Et bon courage !'

  main_div.append(bienvenue);
  main_div.append(video);
  main_div.append(par1);
  main_div.append(par2);
  main_div.append(par3);
  main_div.append(par4);
  main_div.append(par5);


    // _parent.append(this.content);
    return;
};

/**
* Saves the page
* @memberof GenericPage
*/
GenericPage.prototype.save = function () {
};
