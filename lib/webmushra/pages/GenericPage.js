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

  var par0 = "<div style=\"text-align: left\">Vous avez besoin d'un <strong>dispositif audio</strong> (écouteur, haut parleur,...) pour visionner des vidéos avec du son. <br>\
  Vous ne <strong>devez pas réaliser cette expérience sur téléphone ou tablette</strong>.</div><br>"

  var par1 = '<br><div style="text-align: left">Aujourd\'hui, vous allez devoir évaluer le comportement de plusieurs agents virtuels. Pour cela, vous allez <strong>visionner plusieurs vidéos</strong>, puis répondre à une question par vidéo.\
   <br><br>Ici, quand on parle de comportements, on parle :<br></div>'
  var par2 = '<div style="text-align: left"> <br>\
  &nbsp&nbsp o <strong>des expressions faciales</strong>,<br><br>\
  &nbsp&nbsp o <strong>des mouvements de tête</strong>,<br><br>\
  &nbsp&nbsp o <strong>du regard</strong>.<br><br>\
      <br></div>'
  
  var par3 = '<div style="text-align: left">Les questions portent sur deux sujets : <br><br> \
  &nbsp&nbsp 1. le premier est  la <strong>crédibilité</strong> des agents virtuels, c\'est-à-dire la ressemblance entre leurs comportements et des comportements humains. Pour cette question il n\'y a pas d\'audio, seulement la vidéo.<br><br> \
  &nbsp&nbsp 2. Le second est la <strong>coordination avec la parole</strong>, c\'est-à-dire l\'adéquation entre le comportement de l\'agent, le rythme de la parole et l\'intonation. Essayez de ne pas considérer le contenu/le sens du discours. Pour cette question, vous aurez évidemment l’audio.<br><br><br>\
    </div>'

  var par4 = '<div style="text-align: left">Cette étude est subjective, <strong>il n\'y a pas de "bonne" ou "mauvaise" réponse</strong>. L`\'objectif est de connaître votre ressenti sur ces deux questions.<br><br><br></div>'
    
  var par5 = '<div style="text-align: left">Ne vous inquiétez pas, les consignes seront écrites au fur et à mesure.<br><br><br></div>'
  var par6 = '<strong>Merci beaucoup</strong> de prendre le temps de faire cette évaluation.<br><br><br>'
  var par7= '<div style="text-align: left"><I>Ps : n\'hésitez pas à dézommer votre navigateur si besoin, pour voir à la fois les vidéos et l\'espace de réponses.</I></div>'

  main_div.append(bienvenue);
  // main_div.append(video);
  main_div.append(par0)
  main_div.append(par1);
  main_div.append(par2);
  main_div.append(par3);
  main_div.append(par4);
  main_div.append(par5);
  main_div.append(par6);
  main_div.append(par7);


    // _parent.append(this.content);
    return;
};

/**
* Saves the page
* @memberof GenericPage
*/
GenericPage.prototype.save = function () {
};
