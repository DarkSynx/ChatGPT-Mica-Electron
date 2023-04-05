<link rel="shortcut icon" type="image/x-icon" href="/Mica-ChatGPT/favicon.svg">

# Mica-ChatGPT windows 8, 10, 11

<br/>

***Mica-ChatGPT est une application innovante qui exploite les avancées en prompt engineering pour converser avec ChatGPT, une IA conversationnelle avancée. Disponible en versions libre, elle offre une interface intuitive grâce à Electron.***

***L'application permet de créer et d'ajouter des prompts personnalisés répondant aux besoins spécifiques des utilisateurs. La version standard inclut des prompts préexistants et une zone de texte pour ajouter des prompts personnalisés, offrant une expérience de conversation sur mesure.***

***Cette version permet également d'importer et d'exporter des prompts au format JSON pour faciliter leur gestion et personnalisation. Ainsi, pouvoir partager des prompts avec d'autres membres de leur organisation ou les importer depuis d'autres sources. Mica-ChatGPT en version entreprise offrira la flexibilité nécessaire pour intégrer ChatGPT dans les flux de travail et répondre aux besoins spécifiques en matière de conversation.***

-----
<video src="https://user-images.githubusercontent.com/9467611/229367187-4503d5c8-d4da-4bd1-81c9-c681df7e1841.mp4" width="640" height="auto" controls>
    Merci de mettre à jour votre navigateur pour lire la vidéo
</video>
-----

TELECHARGER ICI : 

<a href="https://github.com/DarkSynx/Mica-ChatGPT/releases/tag/1.6.0-040423">micaChatGPT_test.zip 1.6.0</a>

<a href="https://github.com/DarkSynx/Mica-ChatGPT/releases/tag/1.5.0">micaChatGPT_test.zip 1.5.0</a>

<a href="https://github.com/DarkSynx/Mica-ChatGPT/releases/download/1.4.3/micaChatGPT_1.4.3_b.zip">micaChatGPT_test.zip 1.4.3</a>

<a href="https://github.com/DarkSynx/Mica-ChatGPT/releases/download/1.4.1/micaChatGPT_test.zip">micaChatGPT_test.zip 1.4.1</a>


---

***Il est important de noter que la version standard de l'application Mica-ChatGPT est destinée uniquement à un usage personnel et non commercial. Les entreprises ne doivent pas l'utiliser pour des besoins professionnels, mais plutôt nous contacter par mail à***
  
  <b>repondeur.systeme@gmail.com</b> 
  
###### pour discuter des solutions personnalisées que nous pouvons proposer pour répondre à leurs besoins spécifiques.

###### Il est également important de souligner que si les entreprises utilisent la version standard de Mica-ChatGPT à des fins commerciales, cela peut les exposer à des poursuites et à des sanctions légales. Par conséquent, nous encourageons les entreprises à respecter nos conditions d'utilisation et à nous contacter pour discuter de solutions personnalisées et adaptées à leurs besoins.

* ###### En somme, la version standard de Mica-ChatGPT est conçue pour un usage personnel et non commercial, et les entreprises qui souhaitent utiliser ChatGPT à des fins professionnelles doivent nous contacter pour discuter de solutions personnalisées afin de respecter les conditions d'utilisation et éviter toute exposition à des poursuites et à des sanctions légales. 


---

<h1>comme créé un module ?</h1>

1. vous allez dans resources > cfg > add
2. vous modifier app.json comme ici bas avec "newapp"


```json
{
	"gmail" : {
		"link" : "https://mail.google.com/mail/x",
		"linka": { "html" : "https://mail.google.com/mail/?ui=html", "small" : "https://mail.google.com/mail/mu/mp/110/"},
		"dossier" : "gmail",
		"nom" : "Gmail",
		"sufixid" : "gmail",
		"script" : "gmail.js",
		"spancss" : "background-image: url('{{@PATHADD}}gmail/googleappicon.png');background-size: 42px calc(3307px / 1.52);background-position: 0 calc(-2415px / 1.52);",
		"autre" : "",
		"version" : "1.0a"
	},
    	"newapp" : {
		"link" : "https://github.com/DarkSynx/Mica-ChatGPT/",
		"linka": { "html" : "", "small" : ""},
		"dossier" : "newapp",
		"nom" : "newapp",
		"sufixid" : "newapp",
		"script" : "newapp.js",
		"spancss" : "background-image: url('{{@PATHADD}}newapp/newapp.png');background-size: 42px 42px;",
		"autre" : "",
		"version" : "1.0"
	}
}
```

3. vous crez un dossier "newapp" dans "add" 
    cfg > add > newapp

4. dans app.json vous ajouté une url dans "link", ("linka" pas encore exploité) vers la page web exploitable comme "Mica-ChatGPT" par exemple ici
   Mica-ChatGPT sera charger dans un webview que vous pourez controler via le script newapp.js
   que vous aurez créé dans cfg > add > newapp

5. un script doit comporter plusieurs chose de départ

***faite attention j'ai réalisé des améliorations pour les modules 
le code de la version 1.5.0 est compatible avec les versions supérieur
mais la version 1.6.0 non; la 1.6.0 est là pour facilité un visuel d'initialisation
propre au modules il est fortement conseiller de regarder le fichier ipcmain.js*** 

pour version 1.6.0 
```js
const init = require('../ipcmain.js').init({
    modulename: 'gmail',
    version: '1.0a',
    autor: 'Darksynx',
    module_files_path: [ 'jquery-3.6.3.min.js' ]
});
const { WinLoad, ipcToWebView, sendPromptControle, sendToModule } = init;
const { MODULE_NAME, MODULE_FILE_PATH } = init;

// constante spécifique à charger avant WinLoad

// quand la page est charger
WinLoad({
    jqueryPath: MODULE_FILE_PATH[0], // ici si on veut utilisé Jquery on lui indique son chemin défini plus haut
    winLoad: () => {  // ici commence votre script 

	    // GTP4 <= je veux envoyer à chatGPT un prompt
	    // j'utilise : 
	    sendPromptControle("mon_prompt_en_texte", MODULE_NAME);

	    // GTP4 => je recolte l'information 
	    // j'utilise une switch pour que par la suite via d'autre application 
	    // je passe par ici voir la function dans ipcmain.js
	    ipcToWebView((arg) => {
		console.log(arg);
		switch (arg[0]) {
		    case 'gettextrealtime':
			console.log('gettextrealtime: ' + arg[1]);
			$('.richText-editor').html(formatTextWithLineBreaks(arg[1]));
			break
		}
	    });

	    // NEWAPP => je veux envoyer à une autre module par exemple NEWAPP2 
	     sendToModule(webviewName, ipcOn, dataExploit);
    }
});

// ici vos fonctions ! 
// avenir un fichier spécifique 
```

pour version 1.5.0 
```js
const modulename = 'gmail';
const version = '1.0a';
const {ipcRenderer} = require('electron');
const {initWebview, sendPromptControle, connecttoaddrunnertext} = require('../ipcmain.js');
initWebview(modulename);
const webviewNameList = {};
ipcRenderer.on('ipcListNameWebContents', (event, arg) => {
    console.log('ipcListNameWebContents:' + arg);
    webviewNameList[arg] = false;
});
window.addEventListener('load', () => {

    window.$ = window.jQuery = require('./jquery-3.6.3.min.js'); <= pas obligatoire sauf si vous voulez exploité Jquery mais peut être ajouté dans cfg > add > newapp
    console.log("Start Preload Script");
        
       
    /* votre code Jquery ou NodeJs ici */
    
    
    
    // GTP4 <= je veux envoyer à chatGPT un prompt et récolter l'information 
    // j'utilise : 
    sendPromptControle("mon_prompt_en_texte", modulename);
    
    // GTP4 => je veux recevoir l'information 
    // j'utilise une switch pour que par la suite via d'autre application 
    // je passe par ipcToWebView
    ipcRenderer.on('ipcToWebView', (event, arg) => {
        console.log(arg);
        switch (arg[0]) {
            case 'gettextrealtime':
                console.log('gettextrealtime: ' + arg[1]);
                // ICI MON CODE JE VAIS RECEVOIR CE QUE GTP VEUT M'ENVOYER
                break
        }
    });
    
    // NEWAPP => je veux envoyer à une autre NEWAPP2 
    // "webview": "NEWAPP2", pointe vers mon autre application 
    // "ipc": "ipcToWebViewChatGPT", sera son « ipcRenderer.on('ipcToWebViewChatGPT', (event, arg) => {... »
    // "data": ["promptcontrole", prompt, de] les donnés envoyer que vous exploiterez avec (event, arg) => {
      const {ipcRenderer} = require('electron');
      ipcRenderer.send('ipcCentralMain', {
            "webview": "NEWAPP2",
            "ipc": "ipcToWebViewChatGPT",
            "data": ["promptcontrole", prompt, de]
        });
        
        
        // avec  ipcRenderer.on( vous pouvez recevoir et
        // avec  ipcRenderer.send('ipcCentralMain', { vous pouvez envoyer
        // Attention ! toujours utilisé ipcCentralMain est le controleur central entre les modules 
        /*
            NEWAPP ------> ipcCentralMain ----> NEWAPP2
            NEWAPP <------> ipcCentralMain <----> NEWAPP2
            NEWAPP <------ ipcCentralMain <---- NEWAPP2
        */
        // c'est pour cela qu'il est important de nommer votre module
        
});

```




![pub](https://user-images.githubusercontent.com/9467611/229370614-5f3c4788-5ae3-4d42-937b-5036b7cfb4fe.png)



