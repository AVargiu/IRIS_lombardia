/***************************************************************
* Name:        IRIS - Integrated Radar Information System
* Purpose:     WebGis System for Meteorological Monitoring
*
* Author:      Roberto Cremonini, Armando Gaeta, Rocco Pispico
* Email:       sistemi.previsionali@arpa.piemonte.it
*
* Created:     01/04/2016
* Licence:     EUPL 1.1 Arpa Piemonte 2016
***************************************************************/
//Changed by Vargiu on 21/08/2017

//inizializzo alcune variabili che serviranno anche in altri script:
var ctrl, toolbarItems = [], action, actions = {}, area, misura_lunghezza, misura_area, misura_heading;

//queste funzioni e queste variaibli ho bisogno che stiano fuori dalla macrofunzione toolbar_tools perche' devo usarle da altri script:
var ttips;
function toolTipsOut(feature){
    ttips.hide();
}


///////////////////////// DEFINIZIONE MAPPA OPENLAYERS ////////////////////////
////Adesso a seconda del layer di base che voglio caricare scelgo le opzioni della mappa.

//BASE_LAYERS=UNO --> caricamento per WMS Arpa WGS84-UTM
if (base_layers == 1) {
        options = {
                projection        : OL_32632,
                maxExtent         : new OpenLayers.Bounds(-2000000,3000000,3500000,7500000),
                restrictedExtent: new OpenLayers.Bounds(0,4000000,1500000,6000000),
                maxResolution     : "auto",
                scales            : [15000000, 8000000, 4000000, 2000000, 1000000, 500000, 250000, 100000, 50000, 25000, 10000, 5000],
                units             : "m",
                displayProjection: OL_32632
        };
} //Fine dell'IF se BASE_LAYERS=UNO

//BASE_LAYERS=ZERO --> caricamento classico per GoogleMap e OSM:
else {
        options = {
                projection: OL_900913
                ,maxResolution: "auto"
                //Provo a risettare alcuni valori iniziali per aiutare TileCache:
                ,maxExtent: new OpenLayers.Bounds(-2000000,3500000,4000000,7500000)
                ,resolutions:[156543.03390000001, 78271.516950000005, 39135.758475000002, 19567.879237500001, 9783.9396187500006, 4891.9698093750003, 2445.9849046875001, 1222.9924523437501, 611.49622617187504, 305.74811308593752, 152.87405654296876, 76.43702827148438, 38.21851413574219, 19.109257067871095, 9.5546285339355475, 4.7773142669677737, 2.3886571334838869, 1.1943285667419434, 0.59716428337097172, 0.29858214168548586]
                ,units: "m"
                ,numZoomLevels: 20
                ,tileSize: new OpenLayers.Size(256, 256)
                ,displayProjection: OL_4326
                ,allOverlays: false //e' un opzione di GeoExt messa a false, ma non ho ben capito a cosa serva...
                , theme: null //per non far ricaricare ad Openlayers lo style.css

        };
} //Fine dell'ELSE se BASE_LAYERS=ZERO

map = new OpenLayers.Map('map', options);

///////////////////// FINE DEFINIZIONE DELLA MAPPA OPENLAYERS //////////////////////////


///////////////////// INIZIO DEFINIZIONE TOOLS DI DEFAULT PER TUTTI I WEBGIS //////////////////////////
function toolbar_tools_default() {

///////////////////// TOOLBAR ITEMS and MEASURE TOOLS ///////////////////
	//selectCtrl = new OpenLayers.Control.SelectFeature(regions); //stringa semplice di selezione
	selectCtrl = new OpenLayers.Control.SelectFeature(
        layers_to_select,
        {
        clickout: true, toggle: false,
        multiple: false, hover: false,
        toggleKey: "ctrlKey", // ctrl key removes from selection
        multipleKey: "shiftKey" // shift key adds to selection
		//,box: true
		//,hover: true //praticamente e' un TOOLTIP!!!!!!!!!!!!
        }
	);
	//Provo un workaround per draggare anche su feature selezionabili - FUNZIONA!
	selectCtrl.handlers['feature'].stopDown = false;
        //selectFeat.handlers['feature'].stopUp = false;
        //da: https://trac.osgeo.org/openlayers/wiki/SelectFeatureControlMapDragIssues


	/* TOOLTIPS!!! */

	ttips = new OpenLayers.Control.ToolTips({bgColor:"red",textColor:"black",bold:true,opacity:0.5});	
	//map.addControl(ttips); //pare che questa linea dia ERRORE!!!!! Perche'?? Nella funzione pero' funziona....
	
	
	//if(webgis=='sismi') {
		var yy=0;
		function toolTipsOver(feature, text_to_show) {
			if(yy==0) {map.addControl(ttips);} //andrebbe aggiunto fuori dalla funzione,ma in questo modo funziona!!
			//var html_feature =  feature.attributes.label;
			var html_feature =  text_to_show;
			//map.addControl(ttips); //andrebbe aggiunto fuori dalla funzione,ma in questo modo funziona!!
			ttips.show({html:html_feature});
			yy=1;
		}
		/*function toolTipsOut(feature){
			//map.addControl(ttips);
			ttips.hide();
		}*/

		var highlightCtrl = new OpenLayers.Control.SelectFeature(layers_to_highlight, {
        	        hover: true,
			multiple: true,
	                highlightOnly: true,
                	renderIntent: "temporary",
			eventListeners: {
	                	//beforefeaturehighlighted: report,
				featurehighlighted: function(e) {
				  if (typeof sismi00 !== 'undefined' && typeof sismi00b !== 'undefined') { //if doverosa in quanto carico le variaibli da DB e in questa fase non sono ancora pronte e/o il layer non e' caricato sul servizio dunque la variabile non esiste in javascript
				    if(e.feature.layer.name==sismi00 || e.feature.layer.name==sismi00b) toolTipsOver(e.feature, e.feature.attributes.label);
				  }
				},
				featureunhighlighted: function(e) {
				  if (typeof sismi00 !== 'undefined' && typeof sismi00b !== 'undefined') {
				    if(e.feature.layer.name==sismi00 || e.feature.layer.name==sismi00b) toolTipsOut(e.feature);
				  }
				    //else if(e.feature.layer.name==suolo15) toolTipsOut(e.feature);
				}
			}
		});
		map.addControl(highlightCtrl);
		highlightCtrl.activate();	
	//} //Fine dell'IF tooltip per il webgis sismico

	
	var options_measure = {
		displayUnits: 'm',
		handlerOptions: {
		    persist: true,
		    geodesic: true} //in realta' questa opzione geodesic non fa unulla...
	};	
	var length = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, options_measure);
	length.geodesic = true; //IMPORTANTE opzione per una corretta misura!!
	length.events.on({
		"measure": handleMeasurements
		//,"measurepartial": handleMeasurements
	});
	map.addControl(length);
	
	area = new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, options_measure);	
	area.geodesic = true; //IMPORTANTE opzione per una corretta misura!!
	area.events.on({
		"measure": handleMeasurements
		//,"measurepartial": handleMeasurements
	});
	map.addControl(area);

	//devi riuscire a passare 2 punti nella forma:
	//a = new OpenLayers.LonLat(7, 45)
	//b = new OpenLayers.LonLat(8, 45)
	//heading = OpenLayers.Spherical.computeHeading(a, b)
	//var heading = OpenLayers.Spherical.computeHeading(OpenLayers.Handler.Point);
	var heading = new OpenLayers.Control.Measure(OpenLayers.Handler.Path, options_measure);
        heading.geodesic = true; //IMPORTANTE opzione per una corretta misura!!
	heading.events.on({
                "measure": handleHeading
                //,"measurepartial": handleMeasurements
        });
        map.addControl(heading);
	
	function handleHeading(event) {
	a = event.geometry.components[0];
	aa = a.transform(OL_900913, OL_4326);
	aa_p = new OpenLayers.LonLat(aa.x, aa.y);
	b = event.geometry.components[1];
        bb = b.transform(OL_900913, OL_4326);
	bb_p = new OpenLayers.LonLat(bb.x, bb.y);
            var geometry = event.geometry;
            var units = event.units;
            var order = event.order;
            var measure = event.measure;
            var out = "";
	    out = -OpenLayers.Spherical.computeHeading(aa_p, bb_p);
	    var outs = "Azimuth: " + out.toFixed(3);
            alert(outs);
        }

	function handleMeasurements(event) {
            var geometry = event.geometry;
            var units = event.units;
            var order = event.order;
            var measure = event.measure;            
            var out = "";
            if(order == 1) {
                out += "measure: " + measure.toFixed(3) + " " + units;
            } else {
                out += "measure: " + measure.toFixed(3) + " " + units + "^2";
            }
	    //var element = document.getElementById('output');
            //element.innerHTML = out;
		alert(out);
	}

/*
    // ZoomToMaxExtent control, a "button" control
    action = new GeoExt.Action({
        control: new OpenLayers.Control.ZoomToMaxExtent(),
        map: map,
        text: "max extent",
        tooltip: "zoom to max extent"
    });
    actions["max_extent"] = action;
    toolbarItems.push(action);
*/

function initial_view() {
	var lonlat = new OpenLayers.LonLat(x_center, y_center);
        map.setCenter(lonlat,zoom_center);
}
var initial_view_btn = new Ext.Button({
	text: "",
	tooltip: "torna alla vista iniziale",
	handler: initial_view
	,xtype:'tbbutton'
        ,cls: 'x-btn-icon'
        ,icon: root_dir_html+'/common/icons/toolbar_icons/home-dav.png'
        ,scale: 'medium'
});
toolbarItems.push(initial_view_btn);

toolbarItems.push("-");


    // Navigation history - two "button" controls
    ctrl = new OpenLayers.Control.NavigationHistory();
    map.addControl(ctrl);
    previous_zoom = new GeoExt.Action({
        text:"",
        control: ctrl.previous,
        disabled: true,
        tooltip: "zoom precedente"
	//,xtype:  'button'
	//,cls:  'x-btn-text-icon'
	,xtype:'tbbutton'
	,cls: 'x-btn-icon'
	,icon: root_dir_html+'/common/icons/toolbar_icons/indietro-dav.png'
	,scale: 'medium'
    });
    actions["previous"] = previous_zoom;
    toolbarItems.push(previous_zoom);

    next_zoom = new GeoExt.Action({
        text: "",
        control: ctrl.next,
        disabled: true,
        tooltip: "zoom successivo"
	,xtype:'tbbutton'
        ,cls: 'x-btn-icon'
        ,icon: root_dir_html+'/common/icons/toolbar_icons/avanti-dav.png'
        ,scale: 'medium'
    });
    actions["next"] = next_zoom;
    toolbarItems.push(next_zoom);

toolbarItems.push(new Ext.Toolbar.Spacer({width:10}));

///////////// CONTROL TOOLS ////////////

        // SelectFeature control, a "toggle" control
        select_control = new GeoExt.Action({
                text: "",
                control: new OpenLayers.Control.SelectFeature(
                        layers_to_select,
                                {
                                clickout: true, toggle: false,
                                multiple: false, hover: false
                                //toggleKey: "ctrlKey", // ctrl key removes from selection
                                //multipleKey: "shiftKey" // shift key adds to selection
                                }
                ),
                //control: selectCtrl,
                map: map, pressed: true,
                // button options:
                toggleGroup: "controls", //group: "controls",
                //allowDepress: false,
                tooltip: "select feature"
                // check item options:
                ,enableToggle: true
                ,checked: true
                ,xtype:'tbbutton', cls:'x-btn-icon'
                ,icon:root_dir_html+'/common/icons/toolbar_icons/cselect.png', scale:'medium'
                ,hidden:true
        });
        actions["select"] = select_control;

        /* Navigation control and MeasureTools controls in the same toggle group: */
        //Button for PAN control:
        pan_control = new GeoExt.Action({
                text: "",
                control: new OpenLayers.Control.Navigation(),
                map: map,
                pressed: true, //in origine false
                // button options:
                //toggleGroup: "controls", group: "controls",
                allowDepress: false, tooltip: "navigate the map"
                // check item options:
                ,enableToggle:true //in origine false
                ,checked:true //in origine false
                ,xtype:'tbbutton', cls:'x-btn-icon'
                ,icon:root_dir_html+'/common/icons/toolbar_icons/cpan.png', scale:'medium'
                ,hidden:true
        });
        actions["pan"] = pan_control;

	//toolbarItems.push(select_control); //cazzo lo aggiungevo 2 volte alla mappa, forse questa no e' necessaria
        toolbarItems.push(pan_control);

//toolbarItems.push("-");

        // Button for Measure-distance controls
        misura_lunghezza = new GeoExt.Action({
                text: "",
                //enableToggle: true,
                toggleGroup: "controls", group: "controls",
                control: length,
                map: map,
                tooltip: "misura una lunghezza"
                ,xtype:'tbbutton', cls:'x-btn-icon'
                ,icon:root_dir_html+'/common/icons/toolbar_icons/misuralinea.png', scale:'medium'
        });
        actions["distanza"] = action;
        //toolbarItems.push(action); //li aggiungo alla fine per ragioni di estetica

        // Button for Measure-area controls
        misura_area = new GeoExt.Action({
                text: "",
                //enableToggle: true,
                toggleGroup: "controls", group: "controls",
                control: area,
                map: map,
                tooltip: "misura un'area"
                ,xtype:'tbbutton', cls:'x-btn-icon'
                ,icon:root_dir_html+'/common/icons/toolbar_icons/misuraarea.png', scale:'medium'
        });
        actions["area"] = action;
        //toolbarItems.push(action); //li aggiungo alla fine per ragioni di estetica

	// Button for Measure-area controls
	misura_heading = new GeoExt.Action({
                text: "",
                toggleGroup: "controls", group: "controls",
                control: heading,
                map: map,
                tooltip: "misura un angolo"
                ,xtype:'tbbutton', cls:'x-btn-icon'
                ,icon:root_dir_html+'/common/icons/toolbar_icons/misuraheading.png', scale:'medium'
        });
        actions["heading"] = action;


}
/////////// FINE FUNZIONE TOOLBAR_TOOLS_DEFAULT ////////////


//Metto fuori queste funzioni in modo tale da poterle richiamare anche passadno un indirizzo da URL:
function showBasicURL(address) {
	address = typeof address !== 'undefined' ? address : null; //definisco valore di default
        advancedOptions = EXAMPLE_BASIC;
	//var query = search_OSM.getValue();
	if (address!="" && address) {
	  var address = address.replace(/_/g, " ");
	  var query = address;
console.log("Address for nominatim: "+address);
	}
	else var query = $('#indirizzo_OSM').val();
        if (query == "")
            {
                advancedOptions='';
                markers.removeMarker(marker);
            }
        else {
           var address = 0;
           var limit = 1;
           advancedOptions += "&q=" + query + "&countrycodes=IT,FR,CH,AT,ES,PT,DE,SI,HR";
           if(address != ""){advancedOptions += "&addressdetails=" + address;}
           if(limit != ""){advancedOptions += "&limit=" + limit;}
           var safe = advancedOptions; //safe e' l'url richiamata
        }
};
function doBasicClick(address) {
	address = typeof address !== 'undefined' ? address : null; //definisco valore di default
        searchType = 'basic';
        var script = document.createElement('script');
        script.type = 'text/javascript';
        showBasicURL(address);
        if (advancedOptions!='') {
            var newURL = advancedOptions;
            script.src = newURL;
            document.body.appendChild(script);
        }
};

/////////// INIZIO TOOLS AGGIUNTIVI DA RICHIAMARE SECONDO DB ////////////
function toolbar_tools_extension() {

	//// SEARCH /////
//Search con NOMINATIM-OSM:
//URL di Nominatim che richiama la funzione "get_latlon_nominatim":
/*function showBasicURL() {
        advancedOptions = EXAMPLE_BASIC;
        //var query = document.getElementById("e1_query").value;
        var query = search_OSM.getValue();
	if (query == "")
	    {
		advancedOptions='';
		markers.removeMarker(marker);
	    }
	else {
           var address = 0;
           var limit = 1;
           advancedOptions += "&q=" + query + "&countrycodes=IT,FR,CH,AT,ES,PT,DE,SI,HR";
           if(address != ""){advancedOptions += "&addressdetails=" + address;}
           if(limit != ""){advancedOptions += "&limit=" + limit;}
           var safe = advancedOptions; //safe e' l'url richiamata
	}
};
//Richiama l'url di Nominatim
function doBasicClick() {
        searchType = 'basic';
	var script = document.createElement('script');
	script.type = 'text/javascript';
	showBasicURL();
	if (advancedOptions!='') {
	    var newURL = advancedOptions;
	    script.src = newURL;
            document.body.appendChild(script);
	}
};
*/
var search_OSM = new Ext.form.TextField({
        id:"indirizzo_OSM",
        name:"indirizzo_OSM",
        name:"indirizzo_OSM",
        tag: "input",
        value:"",
        emptyText:"Cerca un indirizzo: CITTA', NAzione...",
        width: 200,
        selectOnFocus: true,
        focus: true,
	hidden: search_OSM_hidden,
        listeners: {
        specialkey: function(f,e){
                if (e.getKey() == e.ENTER) {
                        //alert("about to submit");
                        doBasicClick();
                        //myform.getForm().submit();
                }
        }
        }
});
search_OSM.on('afterrender', function(){
    Ext.QuickTips.register({ target: search_OSM.getEl(), text: "Ricerca con Nominatim di OSM" });
});
toolbarItems.push(search_OSM);


toolbarItems.push(new Ext.Toolbar.Spacer({width:10}));



///// COMBO BOX per la scelta di una stazione meteo e zoom: /////
//Dovresti capire come caricare da subito i dati nello store...
//if (webgis=='expo2015') store_combo='store_meteoidrolm';
tooltip_combo = "Prima di poter selezionare una stazione meteo e' necessario attivare il layer";
emptytext_combo = "Seleziona una stazione...";
displayField_combo = "denominazione";

if (webgis.indexOf("expo2015")>=0 || webgis.indexOf("arpalombardia")>=0 || webgis.indexOf("thefloatingpiers")>=0) {
    //store_combo='store_meteoidrolm';
    store_combo='store_last_termalm';
}
else if (webgis.indexOf("rischioindustriale") >= 0) {
    store_combo='store_stabrir';
    tooltip_combo = "Prima di poter selezionare uno stabilimento e' necessario attivarne il layer";
    emptytext_combo = "Seleziona uno stabilimento...";
    displayField_combo = "nome_stabilimento";
}
else {store_combo='store_staz_lm';}
var combo = new Ext.form.ComboBox({
    xtype: 'combo',
    mode: 'local',
    tooltip: tooltip_combo,
    store: eval(store_combo),
    displayField: displayField_combo,
    valueField: "feature",
    // The minimum number of characters the user must type before autocomplete and typeAhead activate 
    //minChars: 1,
    emptyText: emptytext_combo,
    //mode: "local",
    forceSelection: true,
    selectOnFocus:true,
    typeAhead: true,
    triggerAction: "all"
    ,hidden: combo_hidden
    // set this to true if the map should automatically zoom in to the selected feature
    ,autoZoomIn: true
    //method: 'GET',
    //enableKeyEvents: true
    //,renderTo: document.body
    ,listeners:{
	select:function(combo,record,index){
	    var key = record.get(combo.valueField);
            mapPanel.map.setCenter(key.geometry.getBounds().getCenterLonLat(), 11);
	}
    }
});
combo.on('afterrender', function(){
    Ext.QuickTips.register({ target: combo.getEl(), text: tooltip_combo });
});
toolbarItems.push(combo);


//// PANNELLO DI HELP E INFORMATIVO: ////

function piene_panel() {
        var panel5 = new Ext.Panel({title:"Po", html: content_panel5});
        var panel6 = new Ext.Panel({title:"Tanaro", html: content_panel6});

        var tabs = new Ext.TabPanel({
                activeTab: 0,
                defaults: {//autoHeight: true,
			height:'100%', bodyStyle: 'padding:10px',
                autoScroll:true},
                items:[
                        panel5
                        ,panel6
                ]
        });

  new Ext.Window({
        title            : 'Informazioni sulle piene'
        ,width           : mapPanel.getWidth() * 0.68
        ,height          : mapPanel.getHeight() * 0.70
        ,hideMode        : 'visibility'
        ,id              : 'myFrameWin'
        ,hidden          : true   //wait till you know the size
        ,plain           : true
        ,constrainHeader : true
        ,minimizable     : true
        ,ddScroll        : false
        ,border          : false
        ,bodyBorder      : false
        ,layout          : 'fit'
        ,plain           : true
        ,maximizable     : true
        ,buttonAlign     : 'center'
        ,modal           : true
        //,html          : content
        ,items           : tabs
        ,fbar: [{
                text: 'Ok, chiudi',
                handler: function () {
                        Ext.getCmp('myFrameWin').close();
                }
        }]
  }).show();

} //Fine della funzione che apre una window di PIENE


function info_panel() {
	var panel2 = new Ext.Panel({title:"Crediti", html: content_panel2});
        var panel1 = new Ext.Panel({title:"Help", html: content_panel1});
	var panel0 = new Ext.Panel({title:"Avvisi", html: content_panel0});
	var panel_expo1 = new Ext.Panel({title:"Help", html: content_panel_expo1});
	var panel_tfp = new Ext.Panel({title:"Help", html: content_panel_tfp});
	var panel_expo2 = new Ext.Panel({title:"Crediti", html: content_panel_expo2});
	//var panel3 = new Ext.Panel({title:"Credits", html: content_panel3});
	if (webgis=="expo2015") {
	    items_panels = [panel_expo2, panel_expo1];
	}
	else if (webgis=="thefloatingpiers") {
            items_panels = [panel_expo2, panel_tfp];
        }
	else items_panels = [panel0, panel1, panel2];
	var tabs = new Ext.TabPanel({
		activeTab: 0,
		defaults: {//autoHeight: true,
		height:'100%', bodyStyle: 'padding:10px',
		autoScroll:true},
		//items:[	panel0	,panel1	,panel2
			//,panel3			
			/*New tab of type "textfield:
			,{title: 'Vehicle',
				layout: 'form',
				//defaults: {width: 230},
				defaultType: 'textfield',
				items: [{}]
			}*/
		//]
		items: items_panels
	});
	
  new Ext.Window({
        title            : 'Avvisi ed informazioni sul WebGIS "IRIS" '
        ,width           : mapPanel.getWidth() * 0.68, height:mapPanel.getHeight() * 0.70
        ,hideMode        : 'visibility', id:'myFrameWin'
        ,hidden          : true   //wait till you know the size
        ,plain           : true, constrainHeader:true
        ,minimizable     : true, ddScroll:false
        ,border          : false, bodyBorder:false
        ,layout          : 'fit', plain:true
        ,maximizable     : true, buttonAlign:'center'
	,modal		 : true
        //,html		 : content
        ,items		 : tabs
	,fbar: [{
		text: 'Ok, chiudi',  
		handler: function () {  
			Ext.getCmp('myFrameWin').close();  
		}  
	}]
  }).show();

} //Fine della funzione che apre una window di HELP


var dialog = new Ext.Button({
	text: "",
	handler: info_panel,
	tooltip: "avvisi e informazioni su IRIS"
	,xtype:'tbbutton'
        ,cls: 'x-btn-icon'
        ,icon: root_dir_html+'/common/icons/toolbar_icons/info2-dav.png'
        ,scale:  'medium'
	,hidden: dialog_hidden
});
toolbarItems.push(dialog);


//Provo ad aggiungere una finestra NON modale per ospitare in futuro l'animazione dei layer:
var win;
var restore_closed_raster = []; //qui ospito la lista dei layer raster eventualmente chiusi all'apertura dell'animazione
function get_active_layer() {
	//Individuo i raster accesi per spegnerli e ripristinarli successivamente alla chiusura dell'anime_panel:
	//NB: non giro sui layer_vector perche' il sistema sclera non ho capito perche'...
	for (var i=0; i < mapPanel.map.layers.length; i++) {
		var layers_to_remove = mapPanel.map.layers[i];
		var width_image = layers_to_remove.getImageSize().w;
		if (width_image != 256) { //256 e' la dimensione di tutti i layer NON raster
			var image_visibility = layers_to_remove.getVisibility();
			if (image_visibility==true) {
				//Aggiungo il layer nella lista dei layer da riaccendere alla chiusura dell'anime_panel:
				restore_closed_raster.push(layers_to_remove.name);
				layers_to_remove.setVisibility(false);
			}
		}
	} //fine del ciclo for
}

/* Vargiu 21/08/2017. Utilizzo la variabile restore_old_layer per saltare alcune parti di codice che creano problemi nelle animazioni radar.
Il comportamento originario e' ottenuto lasciando restore_old_layer = true. Il primo errore che si presenta (variabile hg700), determina restore_old_layer = false. 
*/      

var restore_old_layer = true;

//Rimuovo il layer d'animazione alla chiusura della finestra o lo riattivo alla riapertura:
function remove_anime_layer(visibility) {
	for (var i=0; i < mapPanel.map.layers.length; i++) {
		var anime_layer = mapPanel.map.layers[i];
		if ( anime_layer.name.indexOf('animazione2') > -1 ) {
			//mapPanel.map.removeLayer(anime_layer);
			anime_layer.setVisibility(visibility);
		//non lo elimino perche dopo un altra apertura della finestra resta attiva la variabile anime_rain e mi da un errore sulla rimozione di questo layer, che in realta non esiste piu in mappa. cosi lo nascondo solamente
		}
	}
	//Ripristino eventuali raster spenti per l'animazione alla chiusura del pannello:
	if (visibility==false) {
	   var layer_to_restore;
	   for (var j=0; j < restore_closed_raster.length; j++) {
		layer_to_restore = map.getLayersByName(restore_closed_raster[j])[0];
		layer_to_restore.setVisibility(true);
           }
	   restore_closed_raster = []; //resetto l'array dei layer da riattivare
	}

      //Vargiu 21/08/2017. Gestisco l'errore su hg700 col try: 
      try {
	//In ogni caso spengo il layer sui livelli geopotenziali:
	hg700.setVisibility(false);
        }

      catch(e)  {
        restore_old_layer = false;
        }
       //end try

      //Vargiu 21/08/2017. Salto anche questi setting poiche' alcune variabili non sono definite
      if (restore_old_layer){
	//Resetto e visualizzo tutti i temporali e i fulmini:
	if (webgis != 'rischioindustriale') {
		filterStorm.lowerBoundary = last3h_string;
		filterStorm.upperBoundary = lastStorm_string;
		filterStrategyStorm.setFilter(filterStorm);
		filterFulmini.lowerBoundary = last3h_string;
		filterFulmini.upperBoundary = lastStorm_string;
		filterStrategyFulmini.setFilter(filterFulmini);
	}
	
	bboxStrategy = new OpenLayers.Strategy.BBOX();
	bboxStrategy.setLayer(ellipse);
	bboxStrategy.activate();
	refreshStrategy = new OpenLayers.Strategy.Refresh({interval: 150000, force: true});
	refreshStrategy.setLayer(ellipse);
	refreshStrategy.activate();
	refreshStrategy.refresh();
	ellipse.refresh({ force: true });
     } //end if restore_old_layer
}
function anime_panel() {
//spengo i layer-raster accesi e ne recupero i nomi per ripristinarli successivamente alla chiusura del pannello:
get_active_layer();
if(!win){
        win = new Ext.Window({
                //applyTo:'hello-win',
                title: "Animazione (chiudere per spegnere il layer)",
                layout:'fit',
                width:330,
                height:250,
		x:5, y:150,
		closable:false, //la finestra si chiude solo tramite il pulsante 'close'
                closeAction:'hide',
                plain: true,
                html: content_panel_anime,
                buttons: [
		/*
		{
                    text:'Submit',
                    disabled:true
                },
		*/
		{
                    text: 'Close',
                    handler: function(){
			remove_anime_layer(false);
                        win.hide();
			//win.update(content_panel_anime);
                    }
                }]
		, listeners:{
            	    close: function(){alert('ciao');}
            	    //,scope:this
        	}
            });
        }
else {
	//remove_anime_layer(true);
	win.update(content_panel_anime);
}
win.show(this);
}
var anime = new Ext.Button({
        text: "",
        handler: anime_panel,
        tooltip: "Animazione radar"
        ,xtype:'tbbutton'
        ,cls: 'x-btn-icon'
        ,icon: root_dir_html+'/common/icons/toolbar_icons/film2-26.png'
        ,scale:  'medium'
	,hidden: anime_hidden
});
//if (webgis!="pubblico") {
    toolbarItems.push(anime);
//}
//FINE prova pannello ANIMAZIONE


var dialog0 = new Ext.Button({
	text: "",
	handler: piene_panel,
	tooltip: "strumenti: gestione PIENE"
	,xtype:'tbbutton'
        ,cls: 'x-btn-icon'
        ,icon: root_dir_html+'/common/icons/toolbar_icons/flood_dav.png'
        ,scale:  'medium'
	,hidden: dialog0_hidden
});
//if (webgis=="centrofunzionale") {
	toolbarItems.push(dialog0);
//}

var content_panel_upload = "<iframe width='100%' height='90%' src='"+root_dir_html+"/common/scripts/upload_doc.php?webgis="+webgis+"&type=upload&root_dir_html="+root_dir_html+"' seamless><p>Your browser does not support iframes.</p></iframe>";
var content_panel_download = "<iframe width='100%' height='90%' src='"+root_dir_html+"/common/scripts/upload_doc.php?webgis="+webgis+"&type=download&root_dir_html="+root_dir_html+"' seamless><p>Your browser does not support iframes.</p></iframe>";
function upload_panel() {
        var panel0 = new Ext.Panel({title:"Sezione Upload", html: content_panel_upload});
	var panel1 = new Ext.Panel({title:"Sezione Download", html: content_panel_download});
        var tabs = new Ext.TabPanel({
                activeTab: 0,
                defaults: {//autoHeight: true,
			height:'100%', bodyStyle: 'padding:10px',
                autoScroll:true},
                items:[panel0, panel1]
        });

new Ext.Window({
        title            : 'Carica documentazione sul server e sul DB'
        ,width           : mapPanel.getWidth() * 0.68, height:mapPanel.getHeight() * 0.70
        ,hideMode        : 'visibility', id:'myFrameWin'
        ,hidden          : true   //wait till you know the size
        ,plain           : true, constrainHeader:true
        ,minimizable     : true, ddScroll:false
        ,border          : false, bodyBorder:false
        ,layout          : 'fit', plain:true
        ,maximizable     : true, buttonAlign:'center'
        ,modal           : true
        //,html          : content
        ,items           : tabs
        ,fbar: [{
                text: 'Ok, chiudi',
                handler: function () {
                        Ext.getCmp('myFrameWin').close();
                }
        }]
}).show();

} //Fine della funzione che apre una window di UPLOAD

var dialog_upload = new Ext.Button({
        text: "",
        handler: upload_panel,
        tooltip: "carica file sul server e sul DB"
        ,xtype:'tbbutton'
        ,cls: 'x-btn-icon'
        ,icon: root_dir_html+'/common/icons/toolbar_icons/up_and_download-dav.png'
        ,scale:  'medium'
	,hidden: dialog_upload_hidden
});
//if (webgis=="rischioindustriale") {
toolbarItems.push(dialog_upload);
//}


list_alert_disable = true;
list_alert_tooltip = "Funzione avvisi temporali non attiva";
if (alert_system==1) {
    list_alert_disable = false;
    list_alert_tooltip = "Apri la finestra degli avvisi sui temporali";
}
var list_alert = new Ext.Button({
        handler: function() { closed_from_user=0; listCheck(); }
        ,tooltip: list_alert_tooltip
        //,xtype:'tbbutton'
        //,text: "Storm Alert"
        //,autoWidth: true
        //,ctCls: 'x-btn-over'
        ,disabled: list_alert_disable
	,icon: root_dir_html+'/common/icons/toolbar_icons/storm_intenso_lightning_black.png'
	,scale:  'medium'
	,cls: 'x-btn-icon'
	,hidden: list_alert_hidden
});
//if (webgis=="expo2015" || devel==1 || alert_system==1) {
    toolbarItems.push(list_alert);
//}

var flanis_anime = new Ext.Button({
        handler: function() { flanis_animation(); }
        ,tooltip: "Apri/Chiudi finestra anteprima animazione radar"
	,icon: root_dir_html+'/common/icons/toolbar_icons/radar_flanis.png'
        ,scale:  'medium'
        ,cls: 'x-btn-icon'
	,hidden: flanis_anime_hidden
});
//if (webgis=="expo2015" && devel==1) {
    toolbarItems.push(flanis_anime);
    toolbarItems.push(new Ext.Toolbar.Spacer({width: 5}));
//}

var expo_bullettin = new Ext.Button({
        handler: function() {window.open(root_dir_html+'/common/DATA/expo2015/bollettino_prob.pdf');}
        ,tooltip: "Apri previsioni probabilistiche"
        ,xtype:'tbbutton'
	//PER ICONA:
	//,text: ""
        //,cls: 'x-btn-icon'
        //,icon: root_dir_html+'/common/icons/toolbar_icons/bar_report26.png'
        //,scale:  'medium'
        //PER TESTO:
        ,text: "Previsioni Probabilistiche"
	,autoWidth: true
	,ctCls: 'x-btn-over'
	,hidden: expo_bullettin_hidden
});
//if (webgis=="expo2015") {
toolbarItems.push(expo_bullettin);
toolbarItems.push(new Ext.Toolbar.Spacer({width: 5}));
//}

var expo_meteo = new Ext.Button({
        handler: function() {window.open(root_dir_html+'/common/DATA/expo2015/bollettino_meteo.pdf');}
        ,tooltip: "Apri bollettino meteo"
        ,xtype:'tbbutton'
        ,text: "Bollettino Meteo"
        ,autoWidth: true
        ,ctCls: 'x-btn-over'
	,hidden: expo_meteo_hidden
});
//if (webgis=="expo2015") {
toolbarItems.push(expo_meteo);
//}


function cookies_panel() {
        var panel_map = new Ext.Panel({title:"Generale", html: cookie_map});
        var panel_layers = new Ext.Panel({title:"Layers", html: cookie_layers});
	var panel_baselayers = new Ext.Panel({title:"Base Layers", html: cookie_baselayers});
	var panel_warning = new Ext.Panel({title:"Warning", html: cookie_warning});

        var tabs = new Ext.TabPanel({
                activeTab: 0,
                defaults: {//autoHeight: true,
                  height:'100%', bodyStyle: 'padding:10px',
                  autoScroll:true},
                items:[
                        panel_map
                        ,panel_layers
			,panel_baselayers
			,panel_warning
                ]
        });
new Ext.Window({
        title            : 'Impostazioni WebGIS personalizzate (tramite uso di cookie tecnici)'
        ,width           : mapPanel.getWidth() * 0.68
        ,height          : mapPanel.getHeight() * 0.70
        ,hideMode        : 'visibility'
        ,id              : 'myCookieWin'
        ,hidden          : true   //wait till you know the size
        ,plain           : true
        ,constrainHeader : true
        ,minimizable     : true
        ,ddScroll        : false
        ,border          : false
        ,bodyBorder      : false
        ,layout          : 'fit'
        ,plain           : true
        ,maximizable     : true
        ,buttonAlign     : 'center'
        ,modal           : true
        //,html          : content
        ,items           : tabs
        ,fbar: [{
                text: 'chiudi questa finestra',
                handler: function () {
                        Ext.getCmp('myCookieWin').close();
                }
        }]
}).show();
} //Fine della funzione che apre una window di COOKIE

var cookies_diy = new Ext.Button({
        handler: cookies_panel
        ,tooltip: "Impostazioni utente"
        ,icon: root_dir_html+'/common/icons/toolbar_icons/mixer.png'
        ,scale:  'medium'
        ,cls: 'x-btn-icon'
	,hidden: cookies_diy_hidden
});
//if (devel==1) {
    toolbarItems.push(cookies_diy);
    toolbarItems.push(new Ext.Toolbar.Spacer({width: 5}));
//}

var news_btn = new Ext.Button({
	id:'news_ext_btn',
        handler: function() { news_message(); }
        ,tooltip: "Mostra ultime novita' del WebGIS IRIS"
        ,icon: root_dir_html+'/common/icons/toolbar_icons/news.png'
        ,scale:  'medium'
        ,cls: 'x-btn-icon'
	,hidden: news_btn_hidden
});
//if (devel==1) {
    toolbarItems.push(news_btn);
    //toolbarItems.push(new Ext.Toolbar.Spacer({width: 5}));
//}

/*
//EXPORT MAP: sviluppo lasciato cadere, troppo complesso
var export_btn = new Ext.Button({
        id:'export_btn',
        handler: function() { exportMap(); }
        ,tooltip: "Esporta Mappa"
        ,icon: root_dir_html+'/common/icons/toolbar_icons/news.png'
        ,scale:  'medium'
        ,cls: 'x-btn-icon'
        //,hidden: news_btn_hidden
});
if (devel==1) {
    toolbarItems.push(export_btn);
    toolbarItems.push(new Ext.Toolbar.Spacer({width: 5}));
}
*/

// MENU A TENDINA con LINK a siti esterni:
/*var combo_link = new Ext.form.ComboBox({
    xtype: 'combo',  typeAhead: true,  triggerAction: 'all',  lazyRender:true,
    mode: 'local',  valueField: 'link',  displayField: 'name',
    store: new Ext.data.ArrayStore({
	id: 0,
	fields: ['id', 'name', 'link'],
	data: [
	    [0, 'ODINO', 'http://odino.arpa.piemonte.it/?q=node/236'],
	    [1, 'DPC', 'https://sc05.arpa.piemonte.it/sc05/pioggia.jsp']
	]
    }),
    width:75
    ,listeners:{
        select:function(combo,record,index){
            var key = record.get(combo.valueField);
	    var win = window.open(key, '_blank');
	    win.focus();
        }
    }
});
if (devel==1) toolbarItems.push(combo_link);
combo_link.on('afterrender', function(){
    Ext.QuickTips.register({ target: combo_link.getEl(), text: "Link a risorse esterne" });
});
*/
//oppure uso menu item??
function onItemClick(item){
  var win = window.open(item.url, '_blank');
  win.focus();
}
//var split_link = new Ext.Toolbar.SplitButton({
var split_link = new Ext.Button({
    text: 'Links',
    //handler: onButtonClick,
    tooltip: {text:'Link a risorse esterne', title:'Links'},
    //,xtype:'tbbutton', cls: 'x-btn-icon', icon: root_dir_html+'/common/icons/toolbar_icons/flood_dav.png'
    hidden: split_link_hidden,
    //iconCls: 'blist',
    listeners : {
        mouseover: function(){
            hideTask.cancel();
            if(!this.hasVisibleMenu()){
                this.showMenu();
            }
        },
        mouseout: function(){
            hideTask.delay(250);
        }
    },
    //Menus can be built/referenced by using nested menu config objects
    menu: {
	plain: true,
	showSeparator: false, //per non mostrare la icona separatrice a sinistra, ma non funziona
	listeners: {
	  //Azzero o reimposto il ritardo di chiusura del pulsante se sono dentro al menu:
          mouseover: function(){
                hideTask.cancel();
            },
            mouseout: function(){
                hideTask.delay(250);
            }
        },
        items: [{
            text: '<i>Odino</i>', url: 'http://odino.arpa.piemonte.it/?q=node/236', handler: onItemClick
        }, {
            text: '<i>SC05</i>', url: 'https://sc05.arpa.piemonte.it/sc05/pioggia.jsp', handler: onItemClick
        }
	]
    }
});
var hideTask = new Ext.util.DelayedTask(split_link.hideMenu, split_link);
toolbarItems.push(split_link);


toolbarItems.push(new Ext.Toolbar.Spacer({width: 10}));


////////////////// ANIMAZIONE DEI LAYER SISMI E METEO ///////////////////

//Inserisco gli elementi definiti in "filter_strategy.js":
//SOSTITUITI ORMAI DAL NUOVO PANNELLO DI ANIMAZIONE!

toolbarItems.push("->");	


//Provo ad inserire la combo box per la scelta della scala:
var scaleStore = new GeoExt.data.ScaleStore({map: map});
var zoomSelector = new Ext.form.ComboBox({
    store: scaleStore,
    emptyText: "Zoom Level",
    tpl: '<tpl for="."><div class="x-combo-list-item">1 : {[parseInt(values.scale)]}</div></tpl>',
    editable: false,
    triggerAction: 'all', // needed so that the combo box doesn't filter by its current content
    mode: 'local' // keep the combo box from forcing a lot of unneeded data refreshes
    ,width:100
    ,hidden: zoomSelector_hidden
});
zoomSelector.on('select',
    function(combo, record, index) {
        map.zoomTo(record.data.level);
    },
    this
);
map.events.register('zoomend', this, function() {
    var scale = scaleStore.queryBy(function(record){
        return this.map.getZoom() == record.data.level;
    });

    if (scale.length > 0) {
        scale = scale.items[0];
		//Provo a visualizzare dei numeri piu' significativi ma non serve a molto...
		//var scala_num = parseInt(scale.data.scale);
		//var digit_num = scala_num.toString().length;
		//if (digit_num>=5) {var migliaia = (scala_num/10000).toFixed(1);var zoom=migliaia*10000;}
		//else {var migliaia = (scala_num/1000).toFixed(2); var zoom=migliaia*1000;}
        zoomSelector.setValue("1 : " + parseInt(scale.data.scale));
	        //zoomSelector.setValue("1 : " + zoom);
    } else {
        if (!zoomSelector.rendered) return;
        zoomSelector.clearValue();
    }
});
toolbarItems.push(zoomSelector);

toolbarItems.push(new Ext.Toolbar.Spacer({width: 10}));


///////// PANNELLO GESTIONE DEI TICKETS: ///////

function tickets_panel() {
    var ticket0 = new Ext.Panel({title:"Tickets aperti", html: content_ticket0});
    //var ticket1 = new Ext.Panel({title:"Tickets chiusi", html: content_ticket1});
    var ticket2 = new Ext.Panel({title:"Inserire un ticket", html: content_ticket2});

    var ticket_tabs = new Ext.TabPanel({
		activeTab: 0,
		defaults: {//autoHeight: true,
			height:'100%', bodyStyle: 'padding:10px', autoScroll:true},
		items:[
			ticket0
			//,ticket1
			,ticket2
		]
    });

new Ext.Window({
	title            : 'Tickets WebGIS "IRIS"'
	,width           : mapPanel.getWidth() * 0.68, height:mapPanel.getHeight() * 0.70
	,hideMode        : 'visibility', id: 'myFrameWin'
	,hidden          : true   //wait till you know the size
	,plain           : true, constrainHeader:true, minimizable:true
	,ddScroll        : false, border:false
	,bodyBorder      : false, layout:'fit'
	,plain           : true, maximizable:true
	,buttonAlign     : 'center', modal:true
	//,html          : content
	,items           : ticket_tabs
	,fbar: [{
		text: 'Chiudi',
		handler: function () {
			Ext.getCmp('myFrameWin').close();
		}
	}]

}).show();

} //Fine della funzione che apre una window di TICKETS

/* Nella versione PUBBLICO lo disattivo:*/
var tickets = new Ext.Button({
	text: "",
	handler: tickets_panel,
	tooltip: "lascia un ticket"
	,xtype:'tbbutton'
        ,cls: 'x-btn-icon'
	,icon: root_dir_html+'/common/icons/toolbar_icons/ticket_davide.png'
        ,scale:  'medium'
	,hidden: tickets_hidden
});
//if (webgis=="centrofunzionale" || webgis=="rischioindustriale") {
toolbarItems.push(tickets);
//}


toolbarItems.push("-");


////////////// MEASURE TOOLS //////////////////////
//In teoria sarebbero dei tools di default ma per mantenere l'ordine sulla toolbar li devo scrivere qui in fondo:
toolbarItems.push(misura_lunghezza);
toolbarItems.push(misura_area);
toolbarItems.push(misura_heading);


////////////// END OF TOOLBAR ITEMS //////////////////////

}
