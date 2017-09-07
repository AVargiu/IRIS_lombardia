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

var last1h = new Date(currentTimeUTC.getTime() - 3600000); //recupero 1 ora fa
var last3h = new Date(currentTimeUTC.getTime() - 10800000); //recupero 3 ore fa
var last15min = new Date(currentTimeUTC.getTime()); //recupero l'ultimo disponibile

//Variabili per costruire il filtro filterStrategyStorm:
//var last3h_string = l3_dy.toString() + l3_mm + l3_dd + l3_hh + l3_min; //nella forma "yyyymmddhhmm"
var last1h_string = get_dateString(last1h);
var last3h_string = get_dateString(last3h); //recupero il primo ellipse di 3 ore fa
var lastStorm_string = get_dateString(last15min); //recupero l'ultimo ellipse disponibile



///////////////// DEFINIZIONE WFS VECTOR LAYER //////////////////////

/*ELLIPSE-TEMPORALI ellissi*/
var style_ellipse = new OpenLayers.Style();
var ellipse_0 = new OpenLayers.Rule({
	title: "0 - non classificato",
	filter: new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		property: "si", value: 0
	}),
    symbolizer: {strokeColor: "black", strokeWidth: 0.5, fillColor: "white", fillOpacity: 0.4, label: " ${ora}", labelAlign: "cm", fontSize: "8px", fontColor: 'black', fontWeight: "normal", fontFamily: 'Comic Sans MS'}
});
var ellipse_1 = new OpenLayers.Rule({
	title: "1 - prob. occ. > 50%",
	filter: new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		property: "si", value: 1
	}),
    symbolizer: {strokeColor: "black", strokeWidth: 0.5, fillColor: "#347C17", fillOpacity: 0.4, label: " ${ora}", labelAlign: "cm", fontSize: "8px", fontColor: 'black', fontWeight: "normal", fontFamily: 'Comic Sans MS'}
});
var ellipse_2 = new OpenLayers.Rule({
	title: "2 - prob. occ. < 50%",
	filter: new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		property: "si", value: 2
	}),
    symbolizer: {strokeColor: "black", strokeWidth: 0.5, fillColor: "#52D017", fillOpacity: 0.45, label: " ${ora}", labelAlign: "cm", fontSize: "8px", fontColor: 'black', fontWeight: "normal", fontFamily: 'Comic Sans MS'}
});
var ellipse_3 = new OpenLayers.Rule({
	title: "3 - prob. occ. < 30%",
	filter: new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		property: "si", value: 3
	}),
    symbolizer: {strokeColor: "black", strokeWidth: 0.5, fillColor: "yellow", fillOpacity: 0.5, label: " ${ora}", labelAlign: "cm", fontSize: "8px", fontColor: 'black', fontWeight: "normal", fontFamily: 'Comic Sans MS'}
});
var ellipse_4 = new OpenLayers.Rule({
	title: "4 - prob. occ. < 15%",
	filter: new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		property: "si", value: 4
	}),
    symbolizer: {strokeColor: "black", strokeWidth: 0.5, fillColor: "orange", fillOpacity: 0.55, label: " ${ora}", labelAlign: "cm", fontSize: "8px", fontColor: 'black', fontWeight: "normal", fontFamily: 'Comic Sans MS'}
});
var ellipse_5 = new OpenLayers.Rule({
	title: "5 - prob. occ. < 3%",
	filter: new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		property: "si", value: 5
	}),
    symbolizer: {strokeColor: "black", strokeWidth: 0.5, fillColor: "red", fillOpacity: 0.6, label: " ${ora}", labelAlign: "cm", fontSize: "8px", fontColor: 'black', fontWeight: "normal", fontFamily: 'Comic Sans MS'}
});
var ellipse_6 = new OpenLayers.Rule({
	title: "6 - temporale forte mai osservato",
	filter: new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		property: "si", value: 6
	}),
    symbolizer: {strokeColor: "black", strokeWidth: 0.5, fillColor: "#B93B8F", fillOpacity: 0.65, label: " ${ora}", labelAlign: "cm", fontSize: "8px", fontColor: 'black', fontWeight: "normal", fontFamily: 'Comic Sans MS'}
});
style_ellipse.addRules([ellipse_0, ellipse_1, ellipse_2, ellipse_3, ellipse_4, ellipse_5, ellipse_6]);
var styleMap_ellipse = new OpenLayers.StyleMap({
"default": style_ellipse,
"temporary": new OpenLayers.Style({fontSize: 19, cursor: "pointer"})
});
var filterStorm = new OpenLayers.Filter.Comparison({
	type: OpenLayers.Filter.Comparison.BETWEEN,
	//type: OpenLayers.Filter.Comparison.EQUAL_TO,
	property: "data_num",
	//value: dateString
	lowerBoundary: last3h_string,
	upperBoundary: lastStorm_string
});
var filterStrategyStorm = new OpenLayers.Strategy.Filter({filter: filterStorm});
//var ellipse = new OpenLayers.Layer.Vector(temporali00, {
var ellipse = new OpenLayers.Layer.Vector(default_layer_name, {
	styleMap: styleMap_ellipse,
	strategies: [new OpenLayers.Strategy.Fixed()
	//,new OpenLayers.Strategy.Refresh({force: true, interval: 150000})
	, filterStrategyStorm
	],
	protocol: new OpenLayers.Protocol.WFS({
		url: urlMS_realtime,
		version: "1.1.0",
		featureType: "ellipse3h",
	        featureNS: "http://mapserver.gis.umn.edu/mapserver",
		geometry: "msGeometry", srsName: "epsg:23032"
	})
});
var store_storm = new GeoExt.data.FeatureStore({
	fields: [
		{name: "id", type: "string"},
		{name: "data", type: "string"},
		{name: "ora", type: "string"},
		{name: "lifetime", type: "integer"},
		{name: "si", type: "integer"},
		{name: "vil", type: "float"},
		{name: "area", type: "float"},
		{name: "comune", type: "string"},
		{name: "tmin", type: "float"},
		{name: "cltop", type: "float"},
		{name: "top", type: "float"},
		{name: "vv", type: "integer"},
		{name: "dd", type: "integer"},
		{name: "max", type: "float"},
		{name: "mean", type: "float"}
		//{name: "provincia", type: "string"}
	],
	layer: ellipse
	//,sortInfo: { field: "DATA_ORIGINE", direction: "ASC" } //pare non funzionare...
});
store_storm.on('load', function(store){
	store.sort('data', 'DESC');
});
var columns_storm = new Ext.grid.ColumnModel({
	defaults: {
		sortable: true
	},
	columns: [
		{header: "Id", dataIndex: "id",  width: 90},
		{id: "Date", header: "Data", dataIndex: "data", sortable: true, width: 70},
		{header: "Ora", dataIndex: "ora", width: 40},
		{header: "SSI", dataIndex: "si", align: "center", width: 40},
		{header: "Vita [min]", dataIndex: "lifetime", align: "center", width: 60},
		{header: "Vel [km/h]", dataIndex: "vv", align: "center", width: 60},
		{header: "Dir [&deg;]", dataIndex: "dd", align: "center", width: 60},
		{header: "Comune", dataIndex: "comune", width: 100},
		//{header: "Provincia", dataIndex: "provincia"},
		{xtype: "numbercolumn", header: "Area [km2]", dataIndex: "area", decimalPrecision: 1, align: "center", width: 60},
		{xtype: "numbercolumn", header: "Max [dBZ]", dataIndex: "max", decimalPrecision: 1, align: "center", width: 60},
		{xtype: "numbercolumn", header: "Mean [dBZ]", dataIndex: "mean", decimalPrecision: 1, align: "center", width: 60},
		{xtype: "numbercolumn", header: "Vil [kg/m2]", dataIndex: "vil", decimalPrecision: 1, align: "center", width: 60},
		{xtype: "numbercolumn", header: "Tmin [&deg;C]", dataIndex: "tmin", decimalPrecision: 1, align: "center", width: 60},
		{xtype: "numbercolumn", header: "ClTop [100m]", dataIndex: "cltop", decimalPrecision: 1, align: "center", width: 60},
		{xtype: "numbercolumn", header: "Top [100m]", dataIndex: "top", decimalPrecision: 1, align: "center", width: 60}
	]
});
ellipse.setVisibility(false);


/*ELLIPSE ultime 24H - per animazione*/
var filterStorm24 = new OpenLayers.Filter.Comparison({
        type: OpenLayers.Filter.Comparison.BETWEEN,
        property: "data",
        lowerBoundary: last3h_string,
        upperBoundary: lastStorm_string
});
var filterStrategyStorm24 = new OpenLayers.Strategy.Filter({filter: filterStorm24});
var ellipse_24h = new OpenLayers.Layer.Vector(default_layer_name, {
          styleMap: styleMap_ellipse,
          strategies: [
                new OpenLayers.Strategy.Fixed()
                , filterStrategyStorm24
          ],
          projection: OL_23032,
          protocol: new OpenLayers.Protocol.WFS({
                url: url_tinyows,
                featureType: "ellipse_oggi",
                featureNS: "http://www.tinyows.org/",
                geometryName: "the_geom"
          })
});
ellipse_24h.setVisibility(false);


/*FULMINI*/
OpenLayers.Renderer.symbol.cross2 = [4,0, 5,0, 5,4, 9,4, 9,5, 5,5, 5,9, 4,9, 4,5, 0,5, 0,4, 4,4, 4,0];
var style_fulmini_default = new OpenLayers.Style();
var fulmini_default_rule = new OpenLayers.Rule({
        title: "Fulmini ultime 3h",
	symbolizer: {pointRadius: 8, graphicName: "cross2", fillColor: "#ee0099", fillOpacity: 0.5, strokeColor:"black", rotation: 45, strokeWidth: 0.4}
        //"externalGraphic": "meteo/fulmine.gif"
});
var ccfulmini_rule = new OpenLayers.Rule({
        title: "C-C Fulmini ultime 3h",
	filter: new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		property: "tipo", value: "C"
	}),
		symbolizer: {pointRadius: 8, graphicName: "cross2", fillColor: "#777777", fillOpacity: 0.5, strokeColor:"black", rotation: 45, strokeWidth: 0.4}
});
var cgfulmini_rule = new OpenLayers.Rule({
        title: "C-G Fulmini ultime 3h",
	filter: new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		property: "tipo", value: "G"
	}),
		symbolizer: {pointRadius: 8, graphicName: "cross2", fillColor: "#ee0099", fillOpacity: 0.5, strokeColor:"black", rotation: 45, strokeWidth: 0.4}
});
var style_fulmini_select = new OpenLayers.Style();
var fulmini_select_rule = new OpenLayers.Rule({
        symbolizer: {pointRadius: 14, graphicName: "cross2", fillColor: "blue", fillOpacity: 0.7, strokeWidth: 0.1}
        //"externalGraphic": "meteo/fulmine.gif"
});
style_fulmini_default.addRules([ccfulmini_rule, cgfulmini_rule]);
// style_fulmini_default.addRules([fulmini_default_rule]);
style_fulmini_select.addRules([fulmini_select_rule]);
var styleMap_fulmini = new OpenLayers.StyleMap({
        "default": style_fulmini_default,
        "select": style_fulmini_select
	,"temporary": new OpenLayers.Style({pointRadius: 16, cursor: "pointer"})
});
var filterFulmini = new OpenLayers.Filter.Comparison({
        type: OpenLayers.Filter.Comparison.BETWEEN,
        //type: OpenLayers.Filter.Comparison.EQUAL_TO,
        property: "data_num",
        //value: dateString
        lowerBoundary: last3h_string,
        upperBoundary: lastStorm_string
});
var filterStrategyFulmini = new OpenLayers.Strategy.Filter({filter: filterFulmini});
var fulmini = new OpenLayers.Layer.Vector(default_layer_name, {
	styleMap: styleMap_fulmini,
	strategies: [new OpenLayers.Strategy.Fixed(),
	new OpenLayers.Strategy.Refresh({force: true, interval:150000})
	, filterStrategyFulmini
	],
	projection: new OpenLayers.Projection("epsg:4326"),
        protocol: new OpenLayers.Protocol.WFS({
                url: url_tinyows,
                featureType: "g_fulmini_3ore",
                featureNS: "http://www.tinyows.org/"
                ,readFormat: new OpenLayers.Format.GML({
                        'internalProjection': OL_4326,
                        'externalProjection': OL_4326
                })
        })
});
fulmini.setVisibility(false);


//FULMINI 24h - solo per animazione//
var filterFulmini24 = new OpenLayers.Filter.Comparison({
        type: OpenLayers.Filter.Comparison.BETWEEN,
        property: "data_num",
	lowerBoundary: last3h_string,
        upperBoundary: lastStorm_string
});
var filterStrategyFulmini24 = new OpenLayers.Strategy.Filter({filter: filterFulmini24});
var fulmini24h = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_fulmini,
        strategies: [new OpenLayers.Strategy.Fixed()
        , filterStrategyFulmini24
        ],
        projection: OL_4326,
        protocol: new OpenLayers.Protocol.WFS({
                url: url_tinyows,
                featureType: "g_fulmini_oggi",
                featureNS: "http://www.tinyows.org/",
                geometryName: "the_geom"
        })
});
fulmini24h.setVisibility(false);


/*FILTRO RUPAR*/
var filter_rupar = new OpenLayers.Filter.Comparison({
	type: OpenLayers.Filter.Comparison.EQUAL_TO,
	property: "flag_rupar",
	value: 'S'
});

/*NEVE*/
OpenLayers.Renderer.symbol.rectangle1 = [0, -50, 45, -50, 45, 50, 0, 50, 0, -50]; //sul punto
var style_neve = new OpenLayers.Style({
	//fill: 0, stroke: 0,
        label: " ${ultimovalore}\n${neve0suolo}\n${neve0fresca}", fontWeight: "bold", labelAlign: "cm", fontSize: "12px", fontColor: 'blue'
        }, {
        rules: [
		new OpenLayers.Rule({
        	title: "hs-ultimo dato<br />hs-altezza neve h8<br />hn-neve fresca h8",
        	maxScaleDenominator: 250000,
		symbolizer: {fontSize: "16px", graphicName: "rectangle1", pointRadius: 25, strokeColor: "black", strokeWidth: 1, fillColor: "white", fillOpacity: 0.8}
        	//symbolizer: {externalGraphic: "/common/icons/rectangle.png", labelOutlineColor: "white", labelOutlineWidth: 0, labelYOffset: 20, fontSize: "16px", graphicWidth: 35, graphicHeight: 19, graphicYOffset: -24, graphicOpacity:0.8}
		}),
		new OpenLayers.Rule({
		title: " ",
		minScaleDenominator: 250000,
		symbolizer: {graphicName: "rectangle1", pointRadius: 22, strokeColor: "black", strokeWidth: 1, fillColor: "white", fillOpacity: 0.8}
		})
	]}
);
var styleMap_neve = new OpenLayers.StyleMap({
	"default": style_neve
	, "temporary": new OpenLayers.Style({strokeWidth:4, strokeOpacity:1, fillOpacity: 1, cursor: "pointer"})
});
var filterStrategy_neve = new OpenLayers.Strategy.Filter({filter: filter_rupar});
var neve_tiny = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_neve,
        //minScale: 250000,
        strategies: [new OpenLayers.Strategy.Fixed()
        //,new OpenLayers.Strategy.Refresh({force: true, interval:150000})
        ,filterStrategy_neve
        ],
        projection: OL_23032,
        protocol: new OpenLayers.Protocol.WFS({
		//version: "1.1.0", srsName: "epsg:23032", geometryName: "the_geom",
		url: url_tinyows,
		featureNS: "http://www.tinyows.org/",
		featureType: "v_neve",
		//featurePrefix: "tows",
                readFormat: new OpenLayers.Format.GML({
			'internalProjection': OL_23032,
			'externalProjection': OL_23032
                })
        })
});
neve_tiny.setVisibility(false);


/*TEMPERATURE LOMBARDIA*/
//Provo tematizzazione con CLUSTER e cerchi colorati - devo definire un cluster strategy per ogni layer altrimenti non so perche sballa e lo fa solo sull'ultimo layer per cui e' definito!
var clust_temp_lm = new OpenLayers.Strategy.Cluster({
    distance: 30 //pixel
    , threshold: 2
});
var context_temp_lm = {
    getLabel: function(feature){
        //Gestisco le label nel caso di clusterizzazione:
        if (feature.cluster) { //se interrogo un cluster e non la singola feature
            //Se il cluster non e' per attributi:
            /*valore = [];
            for (var i = 0; i < feature.cluster.length; i++) {
                if (feature.cluster[i].attributes.ultimovalore) valore.push(feature.cluster[i].attributes.ultimovalore);
            }
            valore.sort(); //alphabetical order: dunque con i numeri sballa!
            valore.reverse();
	    return label_scaled(valore[0]);*/
	    feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
		if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
		if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
		return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
	    });
	//console.log(feature.cluster);
	    return label_scaled(feature.cluster[0].attributes.ultimovalore,'\xB0');
            //Se il cluster e' per attributi allora:
            //return feature.cluster[0].attributes.dir_class;
        }
        else { //se invece interrogo la singola feature
            //Se il cluster non e' per attributi:
            return label_scaled(feature.attributes.ultimovalore,'\xB0');
            //Se il cluster e' per attributi allora:
            //return feature.attributes.dir_class;
        }
    }
    ,getLabel_nivo: function(feature){
    //Gestisco le label nel caso di clusterizzazione:
    if (feature.cluster) { //se interrogo un cluster e non la singola feature
            feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
            });
            return label_scaled(feature.cluster[0].attributes.ultimovalore,'');
        }
        else { //se invece interrogo la singola feature
            return label_scaled(feature.attributes.ultimovalore,'');
        }
    }
    ,getLabel_gamma: function(feature){
        //Gestisco le label nel caso di clusterizzazione:
                if (feature.cluster) { //se interrogo un cluster e non la singola feature
            feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
            });
            return label_scaled(feature.cluster[0].attributes.ultimovalore,'');
        }
        else { //se invece interrogo la singola feature
            return label_scaled(feature.attributes.ultimovalore,'');
        }
    }
    //per gestire la dimensione in base alla scala visto che Rules e Context non vanno d'accordo:
    ,getRadius: function() {
        if (mapPanel.map.getScale() > 500000 && mapPanel.map.getScale() < 2500000) return 12;
        else if (mapPanel.map.getScale() > 2500000) return 4;
        else return 16;
    }
    ,getWidth: function(feature) {
        return (feature.cluster) ? 1.5 : 0.5; //se l'elemento e' clusterzizato il suo bordo e' piu' spesso
    }
    //per gestire il colore del cerchio contenente la label visto che Rules e Context non vanno d'accordo:
    ,getFillColor: function(feature) {
	if (mapPanel.map.getScale() > 2500000) return colors.neutral;
	else {
	    if (feature.cluster) { //se interrogo un cluster e non la singola feature
		feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                  if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                  if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                  return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
            	});
		return give_color(label_scaled(feature.cluster[0].attributes.ultimovalore,''), 'temp');
    	    }
	    else return give_color(label_scaled(feature.attributes.ultimovalore,''), 'temp');
	} //fine dell'else sul valore di scala della mappa
    }
    ,getFillColor_nivo: function(feature) {
        if (mapPanel.map.getScale() > 2500000) return colors.neutral;
        else {
            if (feature.cluster) { //se interrogo un cluster e non la singola feature
                feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                  if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                  if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                  return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
                });
                return give_color(label_scaled(feature.cluster[0].attributes.ultimovalore,''), 'nivo');
            }
            else return give_color(label_scaled(feature.attributes.ultimovalore,''), 'nivo');
        } //fine dell'else sul valore di scala della mappa
    }
    //Per dare un ALT col nome della stazione
    ,getTitle: function(feature) {
	if (feature.cluster) { //se interrogo un cluster e non la singola feature
	    feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
            });
	    return feature.cluster[0].attributes.denominazione;
	}
	else { //se invece interrogo la singola feature
	    //Se il cluster non e' per attributi:
	    return feature.attributes.denominazione;
            //Se il cluster e' per attributi allora:
            //return feature.attributes.dir_class;
        }
    }
};
var style_temp_clust_lm = new OpenLayers.Style(
    {   title: "${getTitle}",
        label: "${getLabel}", labelAlign: "cm", fontWeight: "bold", fontFamily: "sans-serif", fontSize: 15
        ,graphicName: "circle", fillColor: "${getFillColor}", fillOpacity: 0.8, strokeColor:"black", pointRadius: "${getRadius}", strokeWidth: "${getWidth}"
    }
    //A quanto pare il context non funzione se c'e una Rule
    ,{context: context_temp_lm} //context dentro allo style
);
var styleMap_temp_clust_lm = new OpenLayers.StyleMap({
    "default": style_temp_clust_lm,
    "select": new OpenLayers.Style({fontSize: 19, pointRadius: 18, fillColor: "blue", fillOpacity: 0.8}),
    "temporary": new OpenLayers.Style({pointRadius: 20, fontSize: 19, cursor: "pointer"})
});
var temperatura_lm = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_temp_clust_lm,
        //minScale: 250000,
        strategies: [new OpenLayers.Strategy.Fixed()
            ,new OpenLayers.Strategy.Refresh({force: true, interval:150000})
            //,filterStrategy_temp
	    ,clust_temp_lm
        ],
        projection: OL_32632,
        protocol: new OpenLayers.Protocol.WFS({
		//version: "1.1.0", srsName: "epsg:23032", geometryName: "the_geom",
		url: url_tinyows,
		featureNS: "http://www.tinyows.org/",
		//featureType: "v_datistazioni", //vecchia logica
		featureType: "v_last_terma_lombardia", //nuova logica dati da meteo_real_time
		//featurePrefix: "tows",
                readFormat: new OpenLayers.Format.GML({
			'internalProjection': OL_32632,
			'externalProjection': OL_32632
                })
        })
});
temperatura_lm.setVisibility(false);
var store_terma_lm = new GeoExt.data.FeatureStore({
        fields: [
                {name: "idstazione", type: "integer"},
                {name: "denominazione", type: "string"},
                {name: "idsensore", type: "integer"},
                {name: "utm_nord", type: "integer"},
                {name: "utm_est", type: "integer"},
                {name: "ultimovalore", type: "float"},
                {name: "timeultimovalore", type: "string"}
        ],
        layer: temperatura_lm
});
store_terma_lm.on('load', function(store){
        store.sort('timeultimovalore', 'ASC');
});
var columns_terma_lm = new Ext.grid.ColumnModel({
        defaults: {
                sortable: true
        },
        columns: [
                {header: "Id sensore", dataIndex: "idsensore",  width: 90},
		{header: "Denominazione", dataIndex: "denominazione", width: 100},
		{xtype: "numbercolumn", header: "Valore [&deg;C]", dataIndex: "ultimovalore", decimalPrecision: 1, align: "center", width: 60},
                {id: "Date", header: "Data ora", dataIndex: "timeultimovalore", sortable: true, width: 70},
		{header: "UTM X", dataIndex: "utm_est",  width: 90},
		{header: "UTM Y", dataIndex: "utm_nord",  width: 90}
        ]
});



/*LIVELLI IDROMETRICI LOMBARDIA*/
//Provo tematizzazione con CLUSTER e cerchi colorati - devo definire un cluster strategy per ogni layer altrimenti non so perche sballa e lo fa solo sull'ultimo layer per cui e' definito!
var clust_temp_lm = new OpenLayers.Strategy.Cluster({
    distance:0 //pixel
    , threshold: 2
});
var context_temp_lm = {
    getLabel: function(feature){
        //Gestisco le label nel caso di clusterizzazione:
       if (feature.cluster) { //se interrogo un cluster e non la singola feature
            //Se il cluster non e' per attributi:
            /*valore = [];
            for (var i = 0; i < feature.cluster.length; i++) {
                if (feature.cluster[i].attributes.ultimovalore) valore.push(feature.cluster[i].attributes.ultimovalore);
            }
            valore.sort(); //alphabetical order: dunque con i numeri sballa!
            valore.reverse();
	    return label_scaled(valore[0]);*/
	    feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
		if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
		if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
		return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
	    });
	//console.log(feature.cluster);
	    return label_scaled(feature.cluster[0].attributes.ultimovalore,'');
            //Se il cluster e' per attributi allora:
            //return feature.cluster[0].attributes.dir_class;
       }
       else { //se invece interrogo la singola feature
            //Se il cluster non e' per attributi:
            return label_scaled(feature.attributes.ultimovalore,'');
            //Se il cluster e' per attributi allora:
            //return feature.attributes.dir_class;
        }
    }
    ,getLabel_nivo: function(feature){
    //Gestisco le label nel caso di clusterizzazione:
    if (feature.cluster) { //se interrogo un cluster e non la singola feature
            feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
            });
            return label_scaled(feature.cluster[0].attributes.ultimovalore,'');
        }
        else { //se invece interrogo la singola feature
            return label_scaled(feature.attributes.ultimovalore,'');
        }
    }
    ,getLabel_gamma: function(feature){
        //Gestisco le label nel caso di clusterizzazione:
                if (feature.cluster) { //se interrogo un cluster e non la singola feature
            feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
            });
            return label_scaled(feature.cluster[0].attributes.ultimovalore,'');
        }
        else { //se invece interrogo la singola feature
            return label_scaled(feature.attributes.ultimovalore,'');
        }
    }
    //per gestire la dimensione in base alla scala visto che Rules e Context non vanno d'accordo:
    ,getRadius: function() {
        if (mapPanel.map.getScale() > 500000 && mapPanel.map.getScale() < 2500000) return 12;
        else if (mapPanel.map.getScale() > 2500000) return 4;
        else return 16;
    }
    ,getWidth: function(feature) {
        return (feature.cluster) ? 1.5 : 0.5; //se l'elemento e' clusterzizato il suo bordo e' piu' spesso
    }
    //per gestire il colore del cerchio contenente la label visto che Rules e Context non vanno d'accordo:
    ,getFillColor: function(feature) {
	if (mapPanel.map.getScale() > 2500000) return colors.neutral;
	else {
	    if (feature.cluster) { //se interrogo un cluster e non la singola feature
		feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                  if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                  if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                  return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
            	});
		return give_color(label_scaled(feature.cluster[0].attributes.ultimovalore,''), 'idro');
    	    }
	    else return give_color(label_scaled(feature.attributes.ultimovalore,''), 'idro');
	} //fine dell'else sul valore di scala della mappa
    }
    ,getFillColor_nivo: function(feature) {
        if (mapPanel.map.getScale() > 2500000) return colors.neutral;
        else {
            if (feature.cluster) { //se interrogo un cluster e non la singola feature
                feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                  if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                  if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                  return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
                });
                return give_color(label_scaled(feature.cluster[0].attributes.ultimovalore,''), 'nivo');
            }
            else return give_color(label_scaled(feature.attributes.ultimovalore,''), 'nivo');
        } //fine dell'else sul valore di scala della mappa
    }
    //Per dare un ALT col nome della stazione
    ,getTitle: function(feature) {
	if (feature.cluster) { //se interrogo un cluster e non la singola feature
	    feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
            });
	    return feature.cluster[0].attributes.denominazione;
	}
	else { //se invece interrogo la singola feature
	    //Se il cluster non e' per attributi:
	    return feature.attributes.denominazione;
            //Se il cluster e' per attributi allora:
            //return feature.attributes.dir_class;
        }
    }
};
var style_temp_clust_lm = new OpenLayers.Style(
    {   title: "${getTitle}",
        label: "${getLabel}", labelAlign: "cm", fontWeight: "bold", fontFamily: "sans-serif", fontSize: 15
        ,graphicName: "circle", fillColor: "${getFillColor}", fillOpacity: 0.8, strokeColor:"black", pointRadius: "${getRadius}", strokeWidth: "${getWidth}"
    }
    //A quanto pare il context non funzione se c'e una Rule
    ,{context: context_temp_lm} //context dentro allo style
);
var styleMap_temp_clust_lm = new OpenLayers.StyleMap({
    "default": style_temp_clust_lm,
    "select": new OpenLayers.Style({fontSize: 19, pointRadius: 18, fillColor: "blue", fillOpacity: 0.8}),
    "temporary": new OpenLayers.Style({pointRadius: 20, fontSize: 19, cursor: "pointer"})
});
var livello_lm = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_temp_clust_lm,
        //minScale: 250000,
        strategies: [new OpenLayers.Strategy.Fixed()
            ,new OpenLayers.Strategy.Refresh({force: true, interval:150000})
            //,filterStrategy_temp
	    ,clust_temp_lm
        ],
        projection: OL_32632,
        protocol: new OpenLayers.Protocol.WFS({
		//version: "1.1.0", srsName: "epsg:23032", geometryName: "the_geom",
		url: url_tinyows,
		featureNS: "http://www.tinyows.org/",
		//featureType: "v_datistazioni", //vecchia logica
		featureType: "v_last_idro_lombardia", //nuova logica dati da meteo_real_time
		//featurePrefix: "tows",
                readFormat: new OpenLayers.Format.GML({
			'internalProjection': OL_32632,
			'externalProjection': OL_32632
                })
        })
});
livello_lm.setVisibility(false);
var store_idro_lm = new GeoExt.data.FeatureStore({
        fields: [
                {name: "idstazione", type: "integer"},
                {name: "denominazione", type: "string"},
                {name: "idsensore", type: "integer"},
                {name: "utm_nord", type: "integer"},
                {name: "utm_est", type: "integer"},
                {name: "ultimovalore", type: "float"},
                {name: "timeultimovalore", type: "string"}
        ],
        layer: livello_lm
});
store_idro_lm.on('load', function(store){
        store.sort('timeultimovalore', 'ASC');
});
var columns_idro_lm = new Ext.grid.ColumnModel({
        defaults: {
                sortable: true
        },
        columns: [
                {header: "Id sensore", dataIndex: "idsensore",  width: 90},
		{header: "Denominazione", dataIndex: "denominazione", width: 100},
		{xtype: "numbercolumn", header: "Valore [cm]", dataIndex: "ultimovalore", decimalPrecision: 1, align: "center", width: 60},
                {id: "Date", header: "Data ora", dataIndex: "timeultimovalore", sortable: true, width: 70},
		{header: "UTM X", dataIndex: "utm_est",  width: 90},
		{header: "UTM Y", dataIndex: "utm_nord",  width: 90}
        ]
});



/*PRECIPITAZIONI LOMBARDIA*/
//Provo tematizzazione con CLUSTER e cerchi colorati - devo definire un cluster strategy per ogni layer altrimenti non so perche sballa e lo fa solo sull'ultimo layer per cui e' definito!
var clust_temp_lm = new OpenLayers.Strategy.Cluster({
    distance: 30 //pixel
    , threshold: 2
});
var context_temp_lm = {
    getLabel: function(feature){
        //Gestisco le label nel caso di clusterizzazione:
        if (feature.cluster) { //se interrogo un cluster e non la singola feature
            //Se il cluster non e' per attributi:
            /*valore = [];
            for (var i = 0; i < feature.cluster.length; i++) {
                if (feature.cluster[i].attributes.ultimovalore) valore.push(feature.cluster[i].attributes.ultimovalore);
            }
            valore.sort(); //alphabetical order: dunque con i numeri sballa!
            valore.reverse();
	    return label_scaled(valore[0]);*/
	    feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
		if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
		if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
		return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
	    });
	//console.log(feature.cluster);
	    return label_scaled(feature.cluster[0].attributes.ultimovalore,'mm');
            //Se il cluster e' per attributi allora:
            //return feature.cluster[0].attributes.dir_class;
        }
        else { //se invece interrogo la singola feature
            //Se il cluster non e' per attributi:
            return label_scaled(feature.attributes.ultimovalore,'mm');
            //Se il cluster e' per attributi allora:
            //return feature.attributes.dir_class;
        }
    }
    ,getLabel_nivo: function(feature){
    //Gestisco le label nel caso di clusterizzazione:
    if (feature.cluster) { //se interrogo un cluster e non la singola feature
            feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
            });
            return label_scaled(feature.cluster[0].attributes.ultimovalore,'');
        }
        else { //se invece interrogo la singola feature
            return label_scaled(feature.attributes.ultimovalore,'');
        }
    }
    ,getLabel_gamma: function(feature){
        //Gestisco le label nel caso di clusterizzazione:
                if (feature.cluster) { //se interrogo un cluster e non la singola feature
            feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
            });
            return label_scaled(feature.cluster[0].attributes.ultimovalore,'');
        }
        else { //se invece interrogo la singola feature
            return label_scaled(feature.attributes.ultimovalore,'');
        }
    }
    //per gestire la dimensione in base alla scala visto che Rules e Context non vanno d'accordo:
    ,getRadius: function() {
        if (mapPanel.map.getScale() > 500000 && mapPanel.map.getScale() < 2500000) return 12;
        else if (mapPanel.map.getScale() > 2500000) return 4;
        else return 16;
    }
    ,getWidth: function(feature) {
        return (feature.cluster) ? 1.5 : 0.5; //se l'elemento e' clusterzizato il suo bordo e' piu' spesso
    }
    //per gestire il colore del cerchio contenente la label visto che Rules e Context non vanno d'accordo:
    ,getFillColor: function(feature) {
	if (mapPanel.map.getScale() > 2500000) return colors.neutral;
	else {
	    if (feature.cluster) { //se interrogo un cluster e non la singola feature
		feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                  if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                  if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                  return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
            	});
		return give_color(label_scaled(feature.cluster[0].attributes.ultimovalore,''), 'pluv');
    	    }
	    else return give_color(label_scaled(feature.attributes.ultimovalore,''), 'pluv');
	} //fine dell'else sul valore di scala della mappa
    }
    ,getFillColor_nivo: function(feature) {
        if (mapPanel.map.getScale() > 2500000) return colors.neutral;
        else {
            if (feature.cluster) { //se interrogo un cluster e non la singola feature
                feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                  if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                  if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                  return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
                });
                return give_color(label_scaled(feature.cluster[0].attributes.ultimovalore,''), 'nivo');
            }
            else return give_color(label_scaled(feature.attributes.ultimovalore,''), 'nivo');
        } //fine dell'else sul valore di scala della mappa
    }
    //Per dare un ALT col nome della stazione
    ,getTitle: function(feature) {
	if (feature.cluster) { //se interrogo un cluster e non la singola feature
	    feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
            });
	    return feature.cluster[0].attributes.denominazione;
	}
	else { //se invece interrogo la singola feature
	    //Se il cluster non e' per attributi:
	    return feature.attributes.denominazione;
            //Se il cluster e' per attributi allora:
            //return feature.attributes.dir_class;
        }
    }
};
var style_temp_clust_lm = new OpenLayers.Style(
    {   title: "${getTitle}",
        label: "${getLabel}", labelAlign: "cm", fontWeight: "bold", fontFamily: "sans-serif", fontSize: 15
        ,graphicName: "circle", fillColor: "${getFillColor}", fillOpacity: 0.8, strokeColor:"black", pointRadius: "${getRadius}", strokeWidth: "${getWidth}"
    }
    //A quanto pare il context non funzione se c'e una Rule
    ,{context: context_temp_lm} //context dentro allo style
);
var styleMap_temp_clust_lm = new OpenLayers.StyleMap({
    "default": style_temp_clust_lm,
    "select": new OpenLayers.Style({fontSize: 19, pointRadius: 18, fillColor: "blue", fillOpacity: 0.8}),
    "temporary": new OpenLayers.Style({pointRadius: 20, fontSize: 19, cursor: "pointer"})
});
var precipitazione_lm = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_temp_clust_lm,
        //minScale: 250000,
        strategies: [new OpenLayers.Strategy.Fixed()
            ,new OpenLayers.Strategy.Refresh({force: true, interval:150000})
            //,filterStrategy_temp
	    ,clust_temp_lm
        ],
        projection: OL_32632,
        protocol: new OpenLayers.Protocol.WFS({
		//version: "1.1.0", srsName: "epsg:23032", geometryName: "the_geom",
		url: url_tinyows,
		featureNS: "http://www.tinyows.org/",
		//featureType: "v_datistazioni", //vecchia logica
		featureType: "v_last_pluvio_lombardia", //nuova logica dati da meteo_real_time
		//featurePrefix: "tows",
                readFormat: new OpenLayers.Format.GML({
			'internalProjection': OL_32632,
			'externalProjection': OL_32632
                })
        })
});
precipitazione_lm.setVisibility(false);
var store_pluvio_lm = new GeoExt.data.FeatureStore({
        fields: [
                {name: "idstazione", type: "integer"},
                {name: "denominazione", type: "string"},
                {name: "idsensore", type: "integer"},
                {name: "utm_nord", type: "integer"},
                {name: "utm_est", type: "integer"},
                {name: "ultimovalore", type: "float"},
                {name: "timeultimovalore", type: "string"}
        ],
        layer: precipitazione_lm
});
store_pluvio_lm.on('load', function(store){
        store.sort('timeultimovalore', 'ASC');
});
var columns_pluvio_lm = new Ext.grid.ColumnModel({
        defaults: {
                sortable: true
        },
        columns: [
                {header: "Id sensore", dataIndex: "idsensore",  width: 90},
		{header: "Denominazione", dataIndex: "denominazione", width: 100},
		{xtype: "numbercolumn", header: "Valore [mm]", dataIndex: "ultimovalore", decimalPrecision: 1, align: "center", width: 60},
                {id: "Date", header: "Data ora", dataIndex: "timeultimovalore", sortable: true, width: 70},
		{header: "UTM X", dataIndex: "utm_est",  width: 90},
		{header: "UTM Y", dataIndex: "utm_nord",  width: 90}
        ]
});


/*TEMPERATURE*/
//Tematizzazione 'classica' con i rettangoli:
OpenLayers.Renderer.symbol.rectangle = [0, -12, 38, -12, 38, 12, 0, 12, 0, -12];
var style_temp = new OpenLayers.Style({
	//fill: 0, stroke: 0,
        label: " ${ultimovalore}", fontWeight: "bold", labelAlign: "cm", fontSize: "12px"
        }, {
        rules: [
        	new OpenLayers.Rule({
		title: "<span style='color:blue;'> <0 &deg;C </span>",
        	filter: new OpenLayers.Filter.Comparison({
                	type: OpenLayers.Filter.Comparison.LESS_THAN,
	                property: "ultimovalore", value: 0
        	}),
        	symbolizer: {fontColor: 'blue'}
		}),
		new OpenLayers.Rule({
  		title: "<span style='color:red;'> 0-30 &deg;C </span>",
	        filter: new OpenLayers.Filter.Comparison({
                	type: OpenLayers.Filter.Comparison.BETWEEN,
                	property: "ultimovalore", lowerBoundary: 0, upperBoundary: 30
        	}),
        	symbolizer: {fontColor: 'red'}
		}),
		new OpenLayers.Rule({
	        title: "<span style='color:purple;'> >30 &deg;C </span>",
        	filter: new OpenLayers.Filter.Comparison({
        	        type: OpenLayers.Filter.Comparison.GREATER_THAN,
	                property: "ultimovalore", value: 30
	        }),
        	symbolizer: {fontColor: 'purple'}
		}),
		new OpenLayers.Rule({
        	title: " ",
        	maxScaleDenominator: 250000,
		symbolizer: {fontSize: "16px", graphicName: "rectangle", pointRadius: 18, strokeColor: "black", strokeWidth: 1, fillColor: "white", fillOpacity: 0.8}
        	//symbolizer: {externalGraphic: "/common/icons/rectangle.png", labelOutlineColor: "white", labelOutlineWidth: 0, labelYOffset: 20, fontSize: "16px", graphicWidth: 35, graphicHeight: 19, graphicYOffset: -24, graphicOpacity:0.8}
		}),
		new OpenLayers.Rule({
		title: " ",
		minScaleDenominator: 250000,
		symbolizer: {graphicName: "rectangle", pointRadius: 14, strokeColor: "black", strokeWidth: 1, fillColor: "white", fillOpacity: 0.8}
		})
	]}
);
var styleMap_temp = new OpenLayers.StyleMap({"default": style_temp});
var filterStrategy_temp = new OpenLayers.Strategy.Filter({filter: filter_rupar});
//Provo tematizzazione con CLUSTER e cerchi colorati - devo definire un cluster strategy per ogni layer altrimenti non so perche sballa e lo fa solo sull'ultimo layer per cui e' definito!
var clust_temp = new OpenLayers.Strategy.Cluster({
    distance: 30 //pixel
    , threshold: 2
});
var context_temp = {
    getLabel: function(feature){
        //Gestisco le label nel caso di clusterizzazione:
        if (feature.cluster) { //se interrogo un cluster e non la singola feature
            //Se il cluster non e' per attributi:
            /*valore = [];
            for (var i = 0; i < feature.cluster.length; i++) {
                if (feature.cluster[i].attributes.ultimovalore) valore.push(feature.cluster[i].attributes.ultimovalore);
            }
            valore.sort(); //alphabetical order: dunque con i numeri sballa!
            valore.reverse();
	    return label_scaled(valore[0]);*/
	    feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
		if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
		if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
		return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
	    });
	//console.log(feature.cluster);
	    return label_scaled(feature.cluster[0].attributes.ultimovalore,'\xB0');
            //Se il cluster e' per attributi allora:
            //return feature.cluster[0].attributes.dir_class;
        }
        else { //se invece interrogo la singola feature
            //Se il cluster non e' per attributi:
            return label_scaled(feature.attributes.ultimovalore,'\xB0');
            //Se il cluster e' per attributi allora:
            //return feature.attributes.dir_class;
        }
    }
    ,getLabel_nivo: function(feature){
    //Gestisco le label nel caso di clusterizzazione:
    if (feature.cluster) { //se interrogo un cluster e non la singola feature
            feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
            });
            return label_scaled(feature.cluster[0].attributes.ultimovalore,'');
        }
        else { //se invece interrogo la singola feature
            return label_scaled(feature.attributes.ultimovalore,'');
        }
    }
    ,getLabel_gamma: function(feature){
        //Gestisco le label nel caso di clusterizzazione:
                if (feature.cluster) { //se interrogo un cluster e non la singola feature
            feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
            });
            return label_scaled(feature.cluster[0].attributes.ultimovalore,'');
        }
        else { //se invece interrogo la singola feature
            return label_scaled(feature.attributes.ultimovalore,'');
        }
    }
    //per gestire la dimensione in base alla scala visto che Rules e Context non vanno d'accordo:
    ,getRadius: function() {
        if (mapPanel.map.getScale() > 500000 && mapPanel.map.getScale() < 2500000) return 12;
        else if (mapPanel.map.getScale() > 2500000) return 4;
        else return 16;
    }
    ,getWidth: function(feature) {
        return (feature.cluster) ? 1.5 : 0.5; //se l'elemento e' clusterzizato il suo bordo e' piu' spesso
    }
    //per gestire il colore del cerchio contenente la label visto che Rules e Context non vanno d'accordo:
    ,getFillColor: function(feature) {
	if (mapPanel.map.getScale() > 2500000) return colors.neutral;
	else {
	    if (feature.cluster) { //se interrogo un cluster e non la singola feature
		feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                  if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                  if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                  return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
            	});
		return give_color(label_scaled(feature.cluster[0].attributes.ultimovalore,''), 'temp');
    	    }
	    else return give_color(label_scaled(feature.attributes.ultimovalore,''), 'temp');
	} //fine dell'else sul valore di scala della mappa
    }
    ,getFillColor_nivo: function(feature) {
        if (mapPanel.map.getScale() > 2500000) return colors.neutral;
        else {
            if (feature.cluster) { //se interrogo un cluster e non la singola feature
                feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                  if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                  if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                  return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
                });
                return give_color(label_scaled(feature.cluster[0].attributes.ultimovalore,''), 'nivo');
            }
            else return give_color(label_scaled(feature.attributes.ultimovalore,''), 'nivo');
        } //fine dell'else sul valore di scala della mappa
    }
    //Per dare un ALT col nome della stazione
    ,getTitle: function(feature) {
	if (feature.cluster) { //se interrogo un cluster e non la singola feature
	    feature.cluster.sort(function(a, b) { //NUMERICAL ORDER-pero' ha un problema con i valori NULL
                if (a.attributes.ultimovalore == null) a.attributes.ultimovalore = -99;
                if (b.attributes.ultimovalore == null) b.attributes.ultimovalore = -99;
                return b.attributes.ultimovalore - a.attributes.ultimovalore; //reverse order
            });
	    return feature.cluster[0].attributes.denominazione;
	}
	else { //se invece interrogo la singola feature
	    //Se il cluster non e' per attributi:
	    return feature.attributes.denominazione;
            //Se il cluster e' per attributi allora:
            //return feature.attributes.dir_class;
        }
    }
};
var style_temp_clust = new OpenLayers.Style(
    {   title: "${getTitle}",
        label: "${getLabel}", labelAlign: "cm", fontWeight: "bold", fontFamily: "sans-serif", fontSize: 15
        ,graphicName: "circle", fillColor: "${getFillColor}", fillOpacity: 0.8, strokeColor:"black", pointRadius: "${getRadius}", strokeWidth: "${getWidth}"
    }
    //A quanto pare il context non funzione se c'e una Rule
    ,{context: context_temp} //context dentro allo style
);
var styleMap_temp_clust = new OpenLayers.StyleMap({
    "default": style_temp_clust,
    "select": new OpenLayers.Style({fontSize: 19, pointRadius: 18, fillColor: "blue", fillOpacity: 0.8}),
    "temporary": new OpenLayers.Style({pointRadius: 20, fontSize: 19, cursor: "pointer"})
});
var temperatura_tiny = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_temp_clust,
        //minScale: 250000,
        strategies: [new OpenLayers.Strategy.Fixed()
            ,new OpenLayers.Strategy.Refresh({force: true, interval:150000})
            //,filterStrategy_temp
	    ,clust_temp
        ],
        projection: OL_23032,
        protocol: new OpenLayers.Protocol.WFS({
		//version: "1.1.0", srsName: "epsg:23032", geometryName: "the_geom",
		url: url_tinyows,
		featureNS: "http://www.tinyows.org/",
		//featureType: "v_datistazioni", //vecchia logica
		featureType: "v_last_terma", //nuova logica dati da meteo_real_time
		//featurePrefix: "tows",
                readFormat: new OpenLayers.Format.GML({
			'internalProjection': OL_23032,
			'externalProjection': OL_23032
                })
        })
});
temperatura_tiny.setVisibility(false);


/* DATI VENTO - simboli */
var styleMap_datistaz = new OpenLayers.StyleMap({
"default": style_vento_graphicname
,"select": new OpenLayers.Style({fontSize: 19, pointRadius: 23, fillColor: "blue", fillOpacity: 0.8})
,"temporary": new OpenLayers.Style({pointRadius: 23, cursor: "pointer"})
});
var filter_rupar = new OpenLayers.Filter.Comparison({
        type: OpenLayers.Filter.Comparison.EQUAL_TO,
        property: "flag_rupar",
        value: 'S'
});
var filterStrategy_temp = new OpenLayers.Strategy.Filter({filter: filter_rupar});
var datistazioni_tiny = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_datistaz,
        strategies: [//new OpenLayers.Strategy.Fixed()
	new OpenLayers.Strategy.BBOX()
	,new OpenLayers.Strategy.Refresh({force: true, interval: 150000})
        //,filterStrategy_temp
        ],
        projection: OL_23032,
        protocol: new OpenLayers.Protocol.WFS({
                url: url_tinyows,
                //featureType: "v_datistazioni", //vecchia logica
		featureType: "v_last_vento", //nuova logica ultimo dato da meteo_real_time
                featureNS: "http://www.tinyows.org/"
                ,readFormat: new OpenLayers.Format.GML({
                        'internalProjection': OL_23032,
                        'externalProjection': OL_23032
                })
        })
});
datistazioni_tiny.setVisibility(false);




