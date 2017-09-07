<?php

//setto una variabile nel caso in cui la ROOT del sistema sia diversa (ad es. reverseproxy)
$root_dir_html = '';

//Definisco percorsi in base al tipo di webgis:
$themes_path = "/mobile";//percorso dei tematismi
$scripts_path = "/common/scripts";//percorso di altri script js
$urllogo = "http://www.arpa.piemonte.gov.it/";
$map_path = "/var/www/html/common/mapfiles/"; //percorso dei file .map di mapserver
$url_tinyows = $root_dir_html . "/cgi-bin/tinyows"; //percorso eseguibile tinyows

?>

<HTML>
<HEAD>

<TITLE>Integrated Radar Information System (IRIS)</TITLE>

<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-32171991-5', 'auto');
  ga('send', 'pageview');
</script>

<script>
var root_dir_html = '<?php echo $root_dir_html; ?>';
var url_tinyows = '<?php echo $url_tinyows; ?>';
</script>

<?php

//Recupero alcuni fogli di stile con Minify:
$open_css = '<link rel="stylesheet" type="text/css" href="../minify-2.1.7/min/?f=';
$open_css .= '/OpenLayers-2.13.1/theme/default/style.mobile.css,';
$open_css .= '/sencha-touch-1.1.1/resources/css/sencha-touch.css,';
$open_css .= '/GXM-0.1/resources/css/gxm.css';
$open_css .= '">';
echo $open_css;

//Apro alcuni script che potrebbero avere indirizzi diversi con un eventuale ReverseProxy:
//$script_js = '<script type="text/javascript" src="'.$root_dir_html.'/OpenLayers-2.13.1/OpenLayers_mobile_ARPA.js"></script>';
//Per CLUSTER ho bisogno di OL completo:
$script_js = '<script type="text/javascript" src="'.$root_dir_html.'/OpenLayers-2.13.1/OpenLayers.js"></script>';
$script_js .= '<script type="text/javascript" src="'.$root_dir_html.'/common/proj4js-combined.js"></script>';
//JavaScript of Sencha Touch and OpenLayers:
$script_js .= '<script type="text/javascript" src="'.$root_dir_html.'/sencha-touch-1.1.1/sencha-touch.js"></script>';
//Provo la NUOVA VERSIONE 2:
//$script_js .= '<script type="text/javascript" src="'.$root_dir_html.'/sencha-touch-2.4.2/sencha-touch.js"></script>';
//This file loads all relevant files - Per sencha-touch v1:
$script_js .= '<script type="text/javascript" src="'.$root_dir_html.'/GXM-0.1/lib/GXM.loader.js"></script>';
//This file loads all relevant files - Per sencha-touch v2
//$script_js .= '<script type="text/javascript" src="'.$root_dir_html.'/GeoExt/GXM-master/src/GXM.loader.js"></script>';
//Per le applicazioni della bottombar: da view-source:http://openlayers.org/dev/examples/mobile-sencha.html:
$script_js .= '<script type="text/javascript" src="'.$root_dir_html.'/mobile/mobile-sencha.js"></script>';
$script_js .= '<script type="text/javascript" src="'.$root_dir_html.'/mobile/js_functions.js"></script>';
echo $script_js;

?>

<script type="text/javascript">
//creating source and destination Proj4js objects
var proj4326 = new Proj4js.Proj("epsg:4326"); //LatLon WGS84
var proj3785 = new Proj4js.Proj("epsg:3785"); //UTM Google 900913

var OL_4326 = new OpenLayers.Projection("epsg:4326");
var OL_900913 = new OpenLayers.Projection("epsg:900913");
var OL_23032 = new OpenLayers.Projection("epsg:23032");
var OL_32632 = new OpenLayers.Projection("epsg:32632");
var OL_3857 = new OpenLayers.Projection("epsg:3857");
var OL_3785 = OL_3857;

//var map, mapPanel, popup, selectControl;
</script>

<?php

$project_scripts = '<script type="text/javascript" src="../minify-2.1.7/min/?f=';
$lista_js2load = array();
/*THEMES da CARICARE:*/
array_push($lista_js2load, $themes_path . "/layers_names.js");
array_push($lista_js2load, $themes_path . "/theme_stili_mobile.js");
array_push($lista_js2load, $themes_path . "/theme_realtime_mobile.js");
array_push($lista_js2load, $themes_path . "/theme_rasters_mobile.js");

$project_scripts .= implode(",", $lista_js2load);

$project_scripts .= '">';
$project_scripts .= ' </script>';
echo $project_scripts;

?>

<script type="text/javascript">
var layers_to_load = [
/* METEO */
//mosaico, grandine, rain48h, rain6h, rain3h, rain1h, neve, bandax, 
//istantaneo, istantaneo_bis, dpc, neve, bandax, fulmini, temperatura_tiny
//zoneall,
aree_allert_raster,
msg, istantaneo, istantaneo_bis, dpc, neve, temperatura_tiny,
//neve_tiny,
nivo_tiny
,datistazioni_tiny
//raster_ist
//, layer

/* SISMICA */
//, sismi
//sismi_lastLow, sismi_lastMedium, sismi_lastHigh, sismiLow, sismiMedium, sismiHigh
];
var layers_to_select = [
//sismi
];
</script>

<?php
$loadmap = '<script type="text/javascript" src="'.$root_dir_html.'/mobile/load_map_devel.js"></script>';
echo $loadmap;

?>

<style type="text/css">
.searchList {
    min-height: 150px;
}
.close-btn {
    position: absolute;
    right: 10px;
    top: 10px;
}
img.minus {
    -webkit-mask-image: url(minus1.png);
}
img.layers {
    -webkit-mask-image: url(list.png);
}
.gx-layer-item {
    margin-left: 10px;
}
#map {
    width: 100%;
    height: 100%;
}
/*Per rendere la scritta di OSM in basso a destra e piu' piccola:*/
.olControlAttribution {
    font-size: 10px;
    bottom: 5px;
    right: 5px;
}
#title, #tags, #shortdesc {
    display: none;
}

.card {
    text-align: center;
    color: #204167;
    text-shadow: #3F80CA 0 1px 0;
    font-size: 72px;
    padding: 80px 40px;
}
.x-phone .card {
    padding: 15px;
    font-size: 36px;
}
.card p {
    font-size: 24px;
    line-height: 30px;
}

.x-phone .card p {
    font-size: 16px;
    line-height: 18px;
}
.card1, .card2, .card3 {
        background-color: #376daa;
        text-align: center;
        color: #204167;
        text-shadow: #3F80CA 0 1px 0;
        font-size: 72px;
        padding-top: 0px;
}
</style>

<script type="text/javascript">

//alert('OpenLayers: ' + OpenLayers.VERSION_NUMBER);
//alert('Sencha Touch: ' + Ext.version);
//alert('GXM: ' + GXM.version);

/*
//E' impostata in modo errato per questo non funziona....Sarebbe la componente che carica la mappa
var tab1 = new Ext.Panel ({
	xtype: "component",
        title: 'map',
            scroll: false,
            monitorResize: true,
            //id: "map_tab",
	//cls: 'card1', layout: 'card', layout: {type: 'vbox', align: 'stretch'}, iconMask: true, useCurrentLocation: true,

            listeners: {
                render: function() {
                    var self = this;
                        //Provo qui a caricare la mappa:
                        load_map();
                },
                resize: function() {
                    if (window.map) {
                        map.updateSize();
                    }
                },
                scope: {
                    featurePopup: null
                }
            }
});
*/
var tab2 = new Ext.Panel ({
    xtype: 'panel',
    title: 'risultati',
    id: 'results_tab',
    html: '2'
});

/*
//var carousel1 = new Ext.Carousel({
var carousel1 = new Ext.TabPanel({
	fullscreen: true,
	//type: 'dark',
	//tabBarPosition: 'bottom',
	//sortable: true,

	//defaults: {
	//    cls: 'card'
	//},

            items: [
		tab1
            ,
            {
                title: 'Tab 2',
                html: '2',
		cls: 'card2'
		,layout: {type: 'vbox', align: 'stretch'}
            },
            {
                title: 'Tab 3',
                html: '3',
		cls: 'card3'
            }
	]
});
*/


///////// da view-source:http://openlayers.org/dev/examples/mobile-sencha.html //////
var app = new Ext.Application({
    name: "ol",
    icon: 'resources/images/icon.png',
    tabletStartupScreen: 'resources/images/tablet_startup.png',
    phoneStartupScreen: 'resources/images/phone_startup.png',
    glossOnIcon: false,
    viewport: {
	autoMaximize: true
    },

    launch: function() {

        //this.viewport = new Ext.Panel({
	this.viewport = new Ext.TabPanel({

	    layout: {type: 'card'},
	    id: 'tab_panel',
	    //hidden: 'true',
            fullscreen: true,
            dockedItems: [{
                dock: "bottom",
                xtype: "toolbar",
                ui: "light",
                layout: {
                    pack: "center"
                },
                items: [{
                    iconCls: "search",
                    iconMask: true,
                    handler: function() {
                        // this is the app
                        if (!app.searchFormPopupPanel) {
                            app.searchFormPopupPanel = new App.SearchFormPopupPanel({
                                map: map
                            });
                        }
                        app.searchFormPopupPanel.show('pop');
                    }
                }, {
                    iconCls: "locate",
                    iconMask: true,
                    handler: function() {
                        var geolocate = map.getControlsBy("id", "locate-control")[0];
                        if (geolocate.active) {
                            geolocate.getCurrentLocation();
                        } else {
                            geolocate.activate();
                        }
                    }
                }, {
                    xtype: "spacer"
                }, {
                    iconMask: true,
                    iconCls: "add",
                    handler: function() {
                        map.zoomIn();
                    }
                }, {
                    iconMask: true,
                    iconCls: "minus",
                    handler: function() {
                        map.zoomOut();
                    }
                },
 
                {
                    xtype: "spacer"
                }, {
			id: 'btn_map',
			iconCls: 'maps', iconMask: true, disabled: 'true',
			handler: function() {
				Ext.getCmp('tab_panel').setActiveItem('map');
				this.disable();
			}
		},

		{
                    xtype: "spacer"
                }, {
                    iconMask: true,
                    iconCls: "layers",
                    handler: function() {
                        if (!app.popup) {
                            app.popup = new Ext.Panel({
                                floating: true,
                                modal: true,
                                centered: true,
                                hideOnMaskTap: true,
                                width: 240,
                                items: [{
                                    xtype: 'app_layerlist',
                                    map: map
                                }],
                                scroll: 'vertical'
                            });
                        }
                        app.popup.show('pop');
                    }
                }]
            }],
            items: [
		//carousel1
		//tab1,
		{
		title: 'mappa',
                    xtype: "component",
                    scroll: false,
                    monitorResize: true,
                    id: "map",
                    listeners: {
                        render: function() {
                            var self = this;
				//Provo qui a caricare la mappa:
				load_map();
                        },
                        resize: function() {
                            if (window.map) {
                                map.updateSize();
                            }
                        },
                        scope: {
                            featurePopup: null
                        }
                    }
		}
		, tab2
	    ] //fine degli items principali
	
        }); //fine definizione del TabPanel "tab_panel" nel viewport

	//Nascondo gli item della barra in alto:
	this.viewport.getTabBar().hide();
	this.viewport.componentLayout.childrenChanged = true;
	this.viewport.doComponentLayout();

    } //fine della funzione che si carica dentro "launch"
});


</script>
        
</HEAD>
<BODY>

</BODY>
</HTML>
