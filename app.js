function c(a) {
    console.log(a);
}

//var urlSito='http://www.anomalie.piccoloweb.net';  var w=1;
var urlSito = 'http://localhost/web_anomalie2';
var w = 1;
var nomeDb = 'db-1';

//m(document.domain);
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    
    // Codice da eseguire nel caso di un dispositivo mobile
    //m('sei su '+ navigator.userAgent);
    var urlSito = 'http://www.anomalie.piccoloweb.net';
    var w = 1;
} else {
    
    // Codice da eseguire nel caso di un dispositivo tradizionale
    //m('sei su PC');
    var urlSito = 'http://localhost/web_anomalie2';
    var w = 1;
}

//var urlSito='http://www.anomalie.piccoloweb.net';  var w=1;

function m(message) {
    
    if (w === 1) {alert(message);
        } else {console.log(message); }
}

//m('path: ' + window.location.href);

function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

/*

GETUSERMEDIA RICHIEDE UNA CONNESSIONE SICURA DEL TIPO HTTPS:
AL MOMENTO NON DISPONIBILE


if (hasGetUserMedia()) {
    m('ok getUserMedia funziona');
} else {
    m('getUserMedia() is not supported in your browser');
}
*/


//var snd = new Audio("sound.mp3"); // buffers automatically when created

if (!window.indexedDB) {
    //m("Il tuo browser non supporta indexedDB");
}

if (navigator.onLine) {
//m('We are connected!');
} else {
 //m('We do not have connectivity ');
}








//***************************************************************************
//        YDN-DB
//****************************************************************************/

//      FX: CREA DATABASE 
// ---------------------------------
// TODO: creare schema per dati utente e url del server base e del Comune scelto
// TODO: recupera la versione di stradario e tipologie new_versione_configurazione

var db, schema;

schema = {
    version: 1,
    stores: [{
        name: 'stradario',    // required. object store name or TABLE name
        keyPath: 'strada',    // keyPath.
        autoIncrement: false, // if true, key will be automatically created
        indexes: [{
            keyPath: 'strada', // required.
            unique: true,      // unique constrain
            multiEntry: true   //
        }]
    }, {
        name: 'tipologie',
        keyPath: 'tipo',
        indexes: [{
            keyPath: 'tipo', // required.
            unique: true,      // unique constrain
            multiEntry: true   //
        }]
    }, {
        name: 'configurazione',
        keyPath: 'id'
    }]
};

db = new ydn.db.Storage(nomeDb, schema);

//m(db.getName() );

// ----------------------------
// FX: aggiorna_store_stradario 
// ----------------------------

function aggiorna_store_stradario(dati) {
    
    var objs = dati;   
    db.clear('stradario');
    db.put('stradario',objs);
}

function carica_store_stradario(dati) {
    
    var objs = dati;
    
    db.put('stradario',objs);
}


// -----------------------------
// FX: aggiorna_store_tipologie 
// ----------------------------
    
function aggiorna_store_tipologie(dati) {
    
    var objs = dati;
    db.clear('tipologie');
    db.put('tipologie', objs);
}


function carica_store_tipologie(dati) {
    
    var objs = dati;
    db.put('tipologie', objs);
}



// -----------------------------
// FX: DROP DATABASE 
// -----------------------------
// fx di test

function drop_db() {
    
    ydn.db.deleteDatabase('db-1');
    //controlla_iscrizione(null);
}


// -----------------------------
// FX: REGISTRA VALORE 
// -----------------------------
// registra_valore('configurazione', 1, 'idUtente', 20, fx_callback);


function registra_valore(store, keypath, oggetto, callback) {
    
    
    //m('[' + store + ']' + '[' + keypath + ']' + '[' + oggetto + ']' + '[' + callback.name + ']');
    
    var req = db.put({name: store, keyPath: 'id'}, oggetto);
    req.done(function (key) {
         //m('ok registra_valore key: ' + key);
        callback(key);
    });
    req.fail(function (e) {
        m('NO registra_valore key: ' + key);
        throw e;
    });
}


// -----------------------------
// FX: ESTRAI CONFIGURAZIONE > RECORD
// -----------------------------

function estrai_configurazione(callback) {
    
    req = db.get('configurazione', 1);
   
    req.done(function (record) {
         //m('170 problema ' + record);
        //m('estrai_configurazione .132 ok -> ' + callback.name);
       // m('estrai_configurazione .132 ok -> ' + record.idUtente);
        callback(record);
    });
    req.fail(function (e) {
        m('estrai_configurazione errore: ' + e.message + ' .135');
    });
}


// ------------------------------------------------------------------------------------------
//      FX: raccoglie gli eventi tap e li gira alla fx azione
// ------------------------------------------------------------------------------------------

document.on('tap', function (el) {
    
    var dati = el.target.id;
    var datiDivisi = dati.split('_');
    var azione = datiDivisi[0];
    var idRecord = datiDivisi[1];
    cattura_tap(azione, idRecord);
    //c(azione + idRecord);
});

document.on('submit', function (el) {
    
    c('submit!');
    el.preventDefault();
});




// -----------------------------------
//      FX: cattura_tap - sceglie tra tutti i tap quelli che corrispondono alle azioni configurate
// -----------------------------------


function cattura_tap(az, id) {
    
    var converti = {
        
        iscrizione: 1,
        edit: 2,
        cancItem: 3,
        cancellaDb: 4,
        aggiorna: 5,
        scatta: 7
    };
    var azione;
    azione = converti[az];
    if (!azione) {
        
        azione = 'azione non ancora configurata';
    }
        else {
        //snd.play();
    }
    //m('azione [azione]: ' + azione + ' sul [record]: ' + id);
    
    switch (azione) {
            
        case 1:
            
            iscriviti();    // A nomeUtente, email > S idUtente > A
            
        break;
    case 2:
        break;
    case 3:
        break;
    case 4:
            
            drop_db();
    
        break;
    case 5:
            
            recupera_stradario_dal_web();
            recupera_tipologie_dal_web();
            // cancella i dati in db e li ricarica dal server
            // TODO: fx che confronta la versione S con quella nella A, se S>A segnala la necessità di un aggiornamento.

        break;
    case 6:

            carica_stradario_e_tipologie(key);
            // cancella i dati in db e li ricarica dal server
            // TODO: fx che confronta la versione S con quella nella A, se S>A segnala la necessità di un aggiornamento.

        break;
    case 7:

            //inizializza_foto(); (da usare con connessione https altrimenti da errore: Only secure origins allowed)
        c('ok');
        inizializza_f();
        break;
    default:
        c('x');
        break;

    }
}




// ------------------------------
//      FX: FRAMEWORK PHONON
// ------------------------------

phonon.options({
    navigator: {
        defaultPage: 'splash', 
        hashPrefix: '!', // default !pagename
        animatePages: true, 
        enableBrowserBackButton: true, 
        templateRootDirectory: 'tpl/', 
        useHash: true // true to enable hash routing, false otherwise
    },
    i18n: null //if you do not want to use internationalization    }
});
var app = phonon.navigator();

app.on({
    page: 'splash',
    content: 'splash.html'
},
    function (activity) {
    
        activity.onReady(function () {
            //m('aperta pagina splash.html');
            estrai_configurazione(controlla_iscrizione);            
        });
    });


app.on({
    page: 'home', 
    content: 'home.html'
},
    function (activity) {
        activity.onReady(function () {
            
            estrai_configurazione(inizializza_home);
        });
    });

app.on({
    page: 'segnala',
    content: 'segnala.html'
},
    function (activity) {
        activity.onTransitionEnd(function () {
            
            inizializza_segnala();
        
            
            
		// Put event listeners into place
		//window.addEventListener("DOMContentLoaded", function() {
            

        });
    });

app.on({
    page: 'settings',
    content: 'settings.html'
},
    function (activity) {
        activity.onTransitionEnd(function () {
        });
    });

app.on({
    page: 'iscrizione',
    content: 'iscrizione.html' 
},
    function (activity) {
    
        activity.onTransitionEnd(function () { 
            //drop_db();
            
        });
    });

app.on({
    page: 'credit',
    content: 'credit.html'
});

app.on({
    page: 'archivio',
    content: 'archivio.html'
},
function (activity) {
    activity.onCreate(function () {
        var els = document.getElementsByClassName("dragEnd");
        Array.prototype.forEach.call(els, function (el) {
            var a = new Dragend(el, {
                onDragEnd: function () {
                    // inserire qui le azioni da compiere al termine del
                    //trascinamento degli elementi dell'archivio
                    //m(el.id);
                }
            });
        });
    });
});


// ------------------------------------
//      FX: CONTROLLA ISCRIZIONE
// ------------------------------------

function controlla_iscrizione(record){
    
   
    if(!record){
        m('controlla_iscrizione: negativo');
        phonon.navigator().changePage('iscrizione');         
        }
    else{
       m('controlla_iscrizione record:' + record.idUtente);
        phonon.navigator().changePage('home');   
    }  
}





// ---------------------------------------- 
//      FX: INIZIALIZZA HOME
// ----------------------------------------

function inizializza_home(record){
    
    idUtente = record['idUtente'];
    nomeUtente = record['nomeUtente'];
    document.getElementById('nomeUtente').innerHTML = nomeUtente + '.' + idUtente;
}





// ---------------------------------------- 
//  XX NON UTILIZZATO    FX: INIZIALIZZA FOTOCAMERA
// ----------------------------------------

function inizializza_foto(){
     /*  
                m('ok DOMContentLoaded');
			// Grab elements, create settings, etc.
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            var video = document.getElementById('video');
            var mediaConfig =  { video: true };
            var errBack = function(e) {
                

                var output = '';
                for (var property in e) {
                  output += property + ': ' + e[property]+'; ';
                }
                m(output);


                
            	m('fine');
            };

			// Put video listeners into place

            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia(mediaConfig).then(function(stream) {
                    video.src = window.URL.createObjectURL(stream);
                    video.play();
                }, errBack);
            }

            
            else if(navigator.getUserMedia) { // Standard
				navigator.getUserMedia(mediaConfig, function(stream) {
					video.src = stream;
					video.play();
				}, errBack);
			} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
				navigator.webkitGetUserMedia(mediaConfig, function(stream){
					video.src = window.webkitURL.createObjectURL(stream);
					video.play();
				}, errBack);
			} else if(navigator.mozGetUserMedia) { // Mozilla-prefixed
				navigator.mozGetUserMedia(mediaConfig, function(stream){
					video.src = window.URL.createObjectURL(stream);
					video.play();
				}, errBack);
			}

			// Trigger photo take
			document.getElementById('scatta_foto').addEventListener('click', function() {
				context.drawImage(video, 0, 0, 100, 100 * video.height / video.width);
                convertCanvasToImage(context, html_img)
            });
		//}, false);

       
            function convertCanvasToImage(canvas, callback) {
              var image = new Image();
              image.onload = function(){
                html_img(image);
              }
              canvas = document.getElementById("canvas");
              image.src = canvas.toDataURL("image/png");

            }            


               function html_img(image){
                document.getElementById('foto').style.backgroundImage = 'url(' + image.src + ')';
            //       sessionStorage.setItem("img_api",image);
              //      document.getElementById('foto').setAttribute('src','data:image/jpeg;base64,' + image.src);

               }         


            document.getElementById("downloader").addEventListener("click", function() {
                document.getElementById("downloader").download = "imageaaaa.png";
                document.getElementById("downloader").href = document.getElementById("canvas").toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
            }  );      
*/

}





function XXinizializza_f() {
    
    function handleFileSelect(evt) {
    
        var files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {
            
            // Only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
            
                //INSERIRE LA CREAZIONE DI UNA GALLERY           
                // Render thumbnail.

                    document.getElementById('foto').style.background = "url('" + e.target.result +"') no-repeat ";
                    document.getElementById('foto').style.backgroundSize = "cover";
                };
            })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
        }
    }

    document.getElementById('files').addEventListener('change', handleFileSelect, false);

}


function inizializza_f() {
    
    function handleFileSelect(evt) {
    
        var files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {
            
            // Only process image files.
            if (!f.type.match('image.*')) {
                
                continue;
            }

            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {

                    document.getElementById("box_galleria_foto").innerHTML = ['<div class="dragend-page">',
                                             '<div class="foto" style="background-image: url(\'', e.target.localName, '\')"></div>',
                                             '</div>','<div class="dragend-page">',
                                             '<div class="foto" style="background-image: url(\'', e.target.result, '\')"></div>',
                                             '</div>'].join('');

                };
            })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
        }
    }

    document.getElementById('files').addEventListener('change', handleFileSelect, false);

}




// ---------------------------------------- 
//      FX: INIZIALIZZA segnala
// ----------------------------------------

function inizializza_segnala() {    
    var myhtml_stradario = '';
    var myhtml_tipologie = '';
    var q = db.values('stradario');
    q.done(function(myArray){
        myArray.forEach(function (item, i) {
            myhtml_stradario += '<option value="' + item['strada'] + '" >' + item['strada'] + '</option>\n\r';
        });
        
        document.getElementById('select_stradario').innerHTML = myhtml_stradario;
    });
    
    var q = db.values('tipologie');
    q.done(function(myArray){
        myArray.forEach(function (item, i) {
            myhtml_tipologie += '<option value="' + item['tipo'] + '" >' + item['tipo'] + '</option>\n\r';
        });
        
        document.getElementById('select_tipologie').innerHTML = myhtml_tipologie;
    });
}








// ---------------------------------------- 
//      FX: AGGIORNA STRADARIO e TIPOLOGIE
// ----------------------------------------


function recupera_tipologie_dal_web() {

    var richiesta = urlSito + '/web_fornisci_dati.php?operazione=new_tipologie';
    recupera_tabella_dal_web(richiesta, aggiorna_store_tipologie);
}

function recupera_stradario_dal_web() {
    
    var richiesta = urlSito + '/web_fornisci_dati.php?operazione=new_stradario';
    recupera_tabella_dal_web(richiesta, aggiorna_store_stradario);
}




// -------------------------------------------------------------------------------------- 
//      FX: iscrizione 
// --------------------------------------------------------------------------------------
// A nome, mail > S idUtente > A
// A idUtente > DB 
// carica Home

function iscriviti(){
//m('...525');
    nomeUtente=document.form_iscrizione.nomeUtente.value;
    email= document.form_iscrizione.email.value;
    var richiesta = urlSito + '/web_fornisci_dati.php?operazione=new_iscrizione&nomeUtente='+ nomeUtente +'&email=' + email;
    invia_richiesta(richiesta, aggiorna_store_configurazione);

    
}

function carica_stradario_e_tipologie(key){
    //m('...535');
    recupera_stradario_dal_web(key);
    recupera_tipologie_dal_web(key);

    pagina_home;
    
}

function aggiorna_store_configurazione(r){
    
    nomeUtente=document.form_iscrizione.nomeUtente.value;
    email= document.form_iscrizione.email.value;
    //m('agg_store_conf idUt:' + r['idUtente']);
    var oggetto = {'id':1, idUtente: r['idUtente'], nomeUtente: nomeUtente, email: email }
    //m('aggiorna_store_configurazione oggetto.idUt:' + oggetto.idUtente);
    document.form_iscrizione.reset();//document.getElementById("myForm").reset()
    //nomeUtente=document.form_iscrizione.nomeUtente.value;
    //email= document.form_iscrizione.email.value;
    registra_valore('configurazione', 1, oggetto, carica_stradario_e_tipologie);
}

function pagina_home(){
    
    phonon.navigator().changePage('home');
}




// ------------------------------
// FX: recupera dati dal web
// ------------------------------

function recupera_tabella_dal_web(richiesta, callback) {
    
    var xmlhttp;
    var r = richiesta;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            
            var dati = xmlhttp.responseText;
            
            var myArr = JSON.parse(xmlhttp.responseText);
            callback(myArr);
        }
    };
    xmlhttp.open("POST", r, true);
    xmlhttp.send();
}


/*


estrai_config .122 -> controlla_iscrizione

(si apre iscrizione)

invia_richiesta richiesta:...

invia_richiesta cb: aggiorna_store_configurazione

*/

// ------------------------------
// FX: registrati sul server
// ------------------------------

function invia_richiesta(richiesta, callback) {

    c('invia_richiesta richiesta:' + richiesta);
    var xmlhttp;
    var r = richiesta;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            
            var dati = xmlhttp.responseText;
            //m('invia_richiesta responseText: [' + dati + '] invia_richiesta callback: ' + callback.name);
            var myArr = JSON.parse(xmlhttp.responseText);
            callback(myArr);
        }
    };
    xmlhttp.open("POST", r, true);
    xmlhttp.send();
}





//********************************************************************************************






/*
function scrivi_select_stradario(myArray) {
    
    var myhtml = '';
    var myArray = myArray;
    myArray.forEach(function (item, i) {
        myhtml += '<option value="' + item + '" >' + item + '</option>\n\r';
    });
    c(myhtml);
}



function elenca_le_tabelle(){
    html += '<li ><button id="cancDb_' + d + '" class="btn negative"><i class="icon i-cancella" ></i> ' + d + '</button></li>';
    
}
// ------------------------------------------------- 
// ELIMINATA   elenca paesi disponibili
// -------------------------------------------------
/*

function recupera_paesi_disponibili_dal_web() {
    
    var richiesta = urlSito + '/app_base.php?paese=fornisci_paesi_disponibili';
    recupera_tabella_dal_web(richiesta, scrivi_option);
}


function scrivi_option(myArray) {
    
    var myhtml = '';
    var myArray = myArray;
    myArray.forEach(function (item, i) {
        myhtml += '<option value="' + item + '" >' + item + '</option>\n\r';
    });
    document.getElementById('select_paesi').innerHTML += myhtml;
    //c('FX: scrivi_option: '+ myhtml);
}








*/

app.start();


