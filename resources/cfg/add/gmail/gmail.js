const modulename = 'gmail';
const version = '1.0a';
const {ipcRenderer} = require('electron');
const {initWebview, sendPromptControle, connecttoaddrunnertext} = require('../ipcmain.js');
initWebview(modulename);

const fs = require('fs');
const util = require('util');
const path = require("path");
const readFileAsync = util.promisify(fs.readFile);

const CFG_PATH = '../../cfg';
const CFG_PATH2 = '../../../cfg';


const DATA_SVIMAGE_PATH = path.join(__dirname, CFG_PATH2 + `/add/${modulename}/datasvimage.json`);
const MPROMPT_TEXT_PATH = path.join(__dirname, CFG_PATH2 + `/add/${modulename}/prompt.json`);
const RICHTEXTMINC_PATH = path.join(__dirname, CFG_PATH2 + `/add/${modulename}/css/richtext.min.css`);
const FONT_AWESOME_PATH = path.join(__dirname, CFG_PATH2 + `/add/${modulename}/css/font-awesome.min.css`);
const INJECTOGMAIL_PATH = path.join(__dirname, CFG_PATH2 + `/add/${modulename}/injectogmail.html`);
const BUTTONINJECT_PATH = path.join(__dirname, CFG_PATH2 + `/add/${modulename}/buttoninjection.html`);


const DATASVIMAGE = require(DATA_SVIMAGE_PATH).dataimage;
const PROMPT_MAIL = require(MPROMPT_TEXT_PATH).mailprompt1;

const webviewNameList = {};
let myinjectrichtextcss = '';
let myinjectfontawesome = '';
let myinjectogmail = '';
let myinjectButton = '';

ipcRenderer.on('ipcListNameWebContents', (event, arg) => {
    console.log('ipcListNameWebContents:' + arg);
    webviewNameList[arg] = false;
});

window.addEventListener('load', () => {

    window.$ = window.jQuery = require('./jquery-3.6.3.min.js');
    console.log("Start Preload Script");
    require('./jquery.richtext.min.js');

    readFilesAsync();

    setTimeout(function () {
        console.log('Start Preload addrunnertext');
        connecttoaddrunnertext(modulename);
    }, 1000);

    ipcRenderer.on('ipcToWebView', (event, arg) => {
        console.log(arg);
        switch (arg[0]) {
            case 'gettextrealtime':
                console.log('gettextrealtime: ' + arg[1]);
                $('.richText-editor').html(formatTextWithLineBreaks(arg[1]));
                break
        }
    });

    // quand on clique sur l'icone chatGPT
    $(document).on('click', 'td#chatGPTaction', function () {
        $('#mailchatgptblock').show();
    });

    // quand on clique sur le bouton generer
    $(document).on('click', 'button#mailchatgptfermer', function () {
        $('#mailchatgptblock').hide();
    });

    $(document).on('click', 'button#mailchatgptprompt', function () {
        //prompt genmail
        if ($('div#prompt').is(':visible')) {
            $('div#prompt').hide();
            $('div#genmail').show();
        } else {
            $('div#prompt').show();
            $('div#genmail').hide();
        }
    });

    // quand on clique sur le bouton generer
    $(document).on('click', 'button#mailchatgptenvoyer', function () {
        console.log('Le bouton a été cliqué');
        let extratext = extractHtmltotext();
        let extratextoption = ($('#proposition2').val() !== '' ? ',' + $('#proposition2').val() + '.' : '.');
        let extratextinformation = ($('#proposition').val() !== '' ? '. Répond à ce mail en utilisant les informations suivants : «' + $('#proposition').val() + '».' : '');
        let prompt = $('textarea#prompttext').val();

        sendPromptControle(
            replaceTags(prompt, {
                'OPTIONS': extratextoption,
                'INFORMATION_EXTRA': extratextinformation,
                'MAIL_A_REPONDRE': extratext,
            })
            , modulename);
    });

    // Détection de l'interface et INJECTION
    $(document).on('DOMNodeInserted', 'div.M9 table.iN td.HE div.aDh table tbody > tr.btC', function () {
        dectectSelector('div.M9 table.iN td.HE div.aDh table tbody > tr.btC');
    });

    // securité dans le doute d'un lague on relance la detection jusqu'a 10secondes
    for (const delay of [0, 100, 1000, 2000, 3000, 5000, 8000, 13000]) {
        setTimeout(relancerDetection, delay);
    }

});

////////////////////////////////////////////////////////////////////////////////////////
// FONCTIONS
////////////////////////////////////////////////////////////////////////////////////////
function pathcfgweb(file = '', extend = '/') {
    return CFG_PATH + extend + file;
}

function readFilesAsync() {
    return Promise.all([
        readFileAsync(RICHTEXTMINC_PATH, 'utf8'),
        readFileAsync(FONT_AWESOME_PATH, 'utf8'),
        readFileAsync(INJECTOGMAIL_PATH, 'utf8'),
        readFileAsync(BUTTONINJECT_PATH, 'utf8')
    ])
        .then(([richtextCSS, fontAwesomeCSS, injectogmailHTML, injectButton]) => {
            myinjectrichtextcss = richtextCSS;
            myinjectfontawesome = fontAwesomeCSS;
            myinjectogmail = injectogmailHTML;
            myinjectButton = injectButton;
        })
        .catch((err) => {
            console.log(err);
        });
}

function replaceTags(str, tagValues) {
    for (var tag in tagValues) {
        var searchTag = '{{@' + tag + '}}';
        if (str.includes(searchTag)) {
            var replaceTag = tagValues[tag];
            str = str.replace(new RegExp(searchTag, 'g'), replaceTag);
        }
    }
    return str;
}

function formatTextWithLineBreaks(text) {
    let htmlText = text.replace(/\r\n|\r|\n/g, '<br>');
    htmlText = htmlText.replace(/<br><br>/g, '</p><p>');
    htmlText = '<p>' + htmlText + '</p>';
    return htmlText;
}

function extractHtmltotext(selector = 'div.adn.ads') {
    console.log('Le bouton a été cliqué Y');
    let replacements = [
        {search: /<[^>]*>/g, replace: ''},
        {search: /&lt;/g, replace: '<'},
        {search: /&gt;/g, replace: '>'},
        {search: /&nbsp;/g, replace: ' '},
        {search: /&#39;/g, replace: "'"},
        {search: /&quot;/g, replace: '"'},
        {search: /&amp;/g, replace: '&'},
    ];

    let textWithFormatting = $(selector).html();
    for (let i = 0; i < replacements.length; i++) {
        let replacement = textWithFormatting.replace(replacements[i].search, replacements[i].replace);
        //console.log(replacement); // Ajout de cette ligne pour débogage
        textWithFormatting = replacement;
    }
    return textWithFormatting;
}

function relancerDetection() {
    if (document.querySelector('div.M9 table.iN td.HE div.aDh table tbody > tr.btC') !== null) {
        // L'élément existe, faire quelque chose ici
        console.log('=relancerDetection= existe');
        dectectSelector('div.M9 table.iN td.HE div.aDh table tbody > tr.btC');
    }
}

function dectectSelector(thiselement) {

        // Liste des IDs à vérifier
        const idsToCheck = ['mailchatgptblock', 'mailchatgpt', 'chatGPTaction', 'mailchatgpt-bg'];

        // Vérifier si les éléments avec les ID spécifiques existent déjà
        const elementsNotFound = idsToCheck.every(id => !$(thiselement).find('#' + id).length);

        if (elementsNotFound) {
            injectToGmail(PROMPT_MAIL, myinjectrichtextcss, myinjectfontawesome);
            injectButtonToGmail(thiselement, DATASVIMAGE);
            $('textarea.rctext').richText();
        }

}

function injectButtonToGmail(thiselement, DATASVIMAGE) {
    setTimeout(function () {
        console.log('coloration des champs');
        $('div.M9 table tbody tr td div table tbody tr td div.editable.LW-avf.tS-tW').css('border', '3px solid grey');
    }, 5000);
    console.log('#chatGPTaction a été ajouté à la page');
    $(thiselement).find('td.gU.Up:first').after(replaceTags(myinjectButton, {'DATASVIMAGE': DATASVIMAGE}));
}

function injectToGmail(myinjectprompttext, myinjectrichtextcss, myinjectfontawesome) {
    $('body').prepend(replaceTags(myinjectogmail, {
        'myinjectprompttext': myinjectprompttext,
        'myinjectfontawesome': myinjectfontawesome,
        'myinjectrichtextcss': myinjectrichtextcss,
    }));
}
