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

//Definisco prima di tutto il nome di default da assegnare ai nuovi layer Vector o Image o comuqneu gestiti da DB.
//Il loro "vero" nome verra' recuperato dal DB:
var default_layer_name = "Nuovo layer";


//Layers di base richiamati da geoext_general.js

//////////////////// CARTE DI BASE ///////////////////

	/*
        var gmap = new OpenLayers.Layer.Google("Google Streets",{sphericalMercator: true});
        var gsat = new OpenLayers.Layer.Google("Google Satellite",{type: G_SATELLITE_MAP, sphericalMercator: true, numZoomLevels: 22
        //, isBaseLayer:true, SingleTile:true
        });
        var ghyb = new OpenLayers.Layer.Google("Google Hybrid",{type: G_HYBRID_MAP, sphericalMercator: true});
        var gtop = new OpenLayers.Layer.Google("Google Topography",{type: G_PHYSICAL_MAP, sphericalMercator: true});
	*/

	//New GoogleMap Layers V3:
	var gsat = new OpenLayers.Layer.Google("Google Satellite",
		{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
	);
	var gter = new OpenLayers.Layer.Google("Google Rilievo",
                {type: google.maps.MapTypeId.TERRAIN, numZoomLevels: 16}
        );

        var osmLayer = new OpenLayers.Layer.OSM("OpenStreetMap");
	//var osmCycle = new OpenLayers.Layer.OSM.CycleMap("OpenCycleMap");
	var osmLandscape = new OpenLayers.Layer.OSM("OSM Landscape", [
		'http://a.tile.thunderforest.com/landscape/${z}/${x}/${y}.png',
                'http://b.tile.thunderforest.com/landscape/${z}/${x}/${y}.png',
                'http://c.tile.thunderforest.com/landscape/${z}/${x}/${y}.png'
	]);
	var osmSat = new OpenLayers.Layer.OSM("OSM Satellite",
	[
                "http://otile1.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
                "http://otile2.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
                "http://otile3.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png",
                "http://otile4.mqcdn.com/tiles/1.0.0/sat/${z}/${x}/${y}.png"
        ]);
	var osmMapQuest = new OpenLayers.Layer.OSM("OSM MapQuest", 
        [
                /*"http://otile1.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
                "http://otile2.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
                "http://otile3.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png",
                "http://otile4.mqcdn.com/tiles/1.0.0/map/${z}/${x}/${y}.png"*/
		"http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png"
        ]
	);
	var osmGray = new OpenLayers.Layer.OSM("OSM Grayscale",
	[
		/*"http://a.www.toolserver.org/tiles/bw-mapnik/${z}/${x}/${y}.png",
		"http://b.www.toolserver.org/tiles/bw-mapnik/${z}/${x}/${y}.png"*/
		"http://a.tile.stamen.com/toner/${z}/${x}/${y}.png"
	]
	, {tileOptions: {crossOriginKeyword: null}}
	);

	//Provo ad aggiungere una carta topografica per i rilievi:
	//var topoUrl = 'http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
	var topoUrl = "https://opentopomap.org/{z}/{x}/{y}.png";
	if(window.location.protocol == "https:") {
		topoUrl = "https://opentopomap.org/{z}/{x}/{y}.png"; //tiles are only for https directyl on opentopomap.org
	}
	var topoAttribution = 'Kartendaten: &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende, <a href="http://viewfinderpanoramas.org">SRTM</a> | Kartendarstellung: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
	var OpenTopoMap = new OpenLayers.Layer.OSM("OpenTopoMap",
        /*[
		//"a.tile.opentopomap.org/{z}/{x}/{y}.png",
		//"b.tile.opentopomap.org/{z}/{x}/{y}.png",
		//"c.tile.opentopomap.org/{z}/{x}/{y}.png"
		'http://{s}.tile.opentopomap.org/${z}/${x}/${y}.png'
	]*/
	topoUrl, {minZoom: 5, maxZoom: 15,  attribution: topoAttribution}
	);


        /*Proviamo a creare un layer tiles di OSM:*/
        //1- create OSM layer
        /*
        var osmarender = new OpenLayers.Layer.OSM(
                "OpenStreetMap (Tiles@Home)",
                "http://tah.openstreetmap.org/Tiles/tile/${z}/${x}/${y}.png"
        );
        */
        //2- altro metodo -- ma e' LENTO uguale:
        //var tileOSM = new OpenLayers.Layer.OSM("Tiles OSM", "http://tile.openstreetmap.org/${z}/${x}/${y}.png", {numZoomLevels: 19, sphericalMercator:true});
        //3- proviamo a caricare dal locale --al momento dovrebbe essere quella che piu' si avvicina alla soluzione:
        //var localOSM = new OpenLayers.Layer.OSM("Local OSM", "/mnt/radar/evento/riccardo/OSMTiles/tiles/${z}/${x}/${y}.png", {numZoomLevels: 16});


        // override default epsg code: non ho ben capito cosa faccia però...
        //aliasproj = new OpenLayers.Projection("epsg:3785");
        //gmap.projection = gsat.projection = ghyb.projection = osmLayer.projection = aliasproj;



//Proviamo a caricare il servizio WMS ARPA in UTM-32632:
//In teoria bisognerebbe far si che il sistema switchi da un SRS all'altro. In realta' questo non avviene cosi semplicemente.
//Inoltre, i file map non riconoscono piu' di uno SRS alla volta per i layer.
//Quindi l'unica soluzione e' caricare file map differenti a seconda dell'SRS che si vuole, ma soprattutto spostare il WMS su un'altra mappa, poiche' non potrebbe convivere insieme alla 900913, sia per lo switch fallito, sia per il mapfile.
/*
//Questo servizio non e' neanche piuì fornito da Arpa
var wms_arpa =  new OpenLayers.Layer.WMS("WMS Arpa", "http://webgis.arpa.piemonte.it/free/services/mappe_di_base/Topografica_Base_Multiscala_Transfrontaliera_WMS/MapServer/WMSServer",
        {layers: "0", format: "image/png", transparent: "true"},
        {sphericalMercator: false, isBaseLayer: true, projection: OL_32632}
);
*/
var wms_arpa = new OpenLayers.Layer.ArcGIS93Rest('Sfondo Arpa Piemonte',
  "http://webgis.arpa.piemonte.it/ags101free/rest/services/topografia_dati_di_base/Topografica_Base_Multiscala_WM/MapServer/export"
  ,{sphericalMercator: true}
);

var wms_lombardia_ctr = new OpenLayers.Layer.WMS('CTR Regione Lombardia 10k',
  "http://www.cartografia.servizirl.it/arcgis/services/wms/ctr_wms/MapServer/WMSServer",
        {layers: ["Sfondo C.T.R. 10000", "LIMITI AMMINISTRATIVI"], format: "image/png", transparent: "false", version:'1.3.0', styles:'', srs:OL_32632},
        {isBaseLayer: true, projection: OL_3857}
);
var wms_lombardia_ortofoto = new OpenLayers.Layer.WMS('Ortofoto Agea 2015 - Reg.Lombardia',
  "http://www.cartografia.servizirl.it/arcgis2/services/BaseMap/ortofoto2015UTM32N/ImageServer/WMSServer?",
        {layers: "ortofoto2015UTM32N", format: "image/png", transparent: "false", version:'1.3.0', styles:'', srs:OL_32632},
        {isBaseLayer: true, projection: OL_3857}
);

//NUOVI SERVIZI REGIONE:
var wms_regione_bn =  new OpenLayers.Layer.WMS("WMS Regione BN", "http://geomap.reteunitaria.piemonte.it/ws/taims/rp-01/taimsbasewms/wms_sfondo_cart_rif_bn?",
        {layers: "SfondoCartRifBN", format: "image/png", transparent: "false"},
        {sphericalMercator: true, isBaseLayer: true, projection: OL_3857}
);
var wms_regione_colore =  new OpenLayers.Layer.WMS("WMS Regione", "http://geomap.reteunitaria.piemonte.it/ws/taims/rp-01/taimsbasewms/wms_sfondo_cart_rif?",
        {layers: "SfondoCartRif", format: "image/png", transparent: "false"},
        {sphericalMercator: true, isBaseLayer: true, projection: OL_3857}
);
var wms_regione_raster =  new OpenLayers.Layer.WMS("WMS Regione - raster", "http://geomap.reteunitaria.piemonte.it/mapproxy/service?",
        {layers: "regp_basecarto10bn_2015", format: "image/png", transparent: "false"},
        {sphericalMercator: true, isBaseLayer: true, projection: OL_3857}
);

/*var url_ortofoto = "http://webgis.arpa.piemonte.it/ags101free/services/topografia_dati_di_base/Ortofoto_risknat_WM_Compact/MapServer/WMSServer?";
var ortofoto_wms = new OpenLayers.Layer.WMS("Ortofoto 2000 - Arpa Piemonte", url_ortofoto,
        {layers:"17", transparent:false, format: "image/png"}
        ,{sphericalMercator: true, isBaseLayer:true, projection: OL_3857}
);*/


//WMS MODIS fornito da Arpa:
/*var wms_modis =  new OpenLayers.Layer.WMS("WMS Modis", "http://webgis.arpa.piemonte.it/free/services/mappe_di_base/MODIS_multi/MapServer/WMSServer",
        {layers: "2", format: "image/png", transparent: "true"},
        {sphericalMercator: false, isBaseLayer: false, projection: OL_4326}
);
wms_modis.setVisibility(false);*/

//Di fatto e' una carta di sfondo:
//var wms_modis = new OpenLayers.Layer.ArcGIS93Rest(radar15,
var wms_modis = new OpenLayers.Layer.WMS("MODIS 24h",
  "http://webgis.arpa.piemonte.it/ags101free/services/topografia_dati_di_base/MODIS_multitemporale/MapServer/WMSServer?",
  {layers: "Modis_24h", format: "image/png", transparent: "true"},
        {sphericalMercator: true, isBaseLayer: true, projection: OL_3857}
);
//wms_modis.setVisibility(false);


/* IMPOSTAZIONI DA DB:
//Definiamo la variabile che verra' caricata sulla mappa:
if (base_layers == 1) {
        var baselayer_to_load = [wms_arpa];
}
else {
	if (webgis == "expo2015") {
		var baselayer_to_load = [ osmMapQuest, osmLayer, osmLandscape, osmGray, gsat, gter ];
	}
	else if (webgis == "expo2015_pub") {
                var baselayer_to_load = [ osmGray, osmLayer, gsat ];
        }
	else {
		var baselayer_to_load = [ osmLayer, osmLandscape, osmMapQuest, osmGray, gsat, gter
					, wms_regione_raster, wms_regione_colore, wms_regione_bn ];
	}
}
*/
