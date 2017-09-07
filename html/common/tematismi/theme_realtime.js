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


/*Contenitore stili per cluster*/
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
            //return label_scaled(feature.cluster[0].attributes.ultimovalore,'\xB0');
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
    ,getFillColor_idro: function(feature) {
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


/*TEMPERATURE LOMBARDIA*/
//Provo tematizzazione con CLUSTER e cerchi colorati - devo definire un cluster strategy per ogni layer altrimenti non so perche sballa e lo fa solo sull'ultimo layer per cui e' definito!
var clust_temp_lm = new OpenLayers.Strategy.Cluster({
    distance: 30 //pixel
    , threshold: 2
});      
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
		featureType: "v_last_terma", //nuova logica dati da meteo_real_time
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


/*MAX VENTO (RAFFICA) LOMBARDIA*/
//Provo tematizzazione con CLUSTER e cerchi colorati - devo definire un cluster strategy per ogni layer altrimenti non so perche sballa e lo fa solo sull'ultimo layer per cui e' definito!

var clust_temp_lm = new OpenLayers.Strategy.Cluster({
    distance: 30 //pixel
    , threshold: 2
});      
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

var raffica_lm = new OpenLayers.Layer.Vector(default_layer_name, {
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
		featureType: "v_last_raffica", //nuova logica dati da meteo_real_time
		//featurePrefix: "tows",
                readFormat: new OpenLayers.Format.GML({
			'internalProjection': OL_32632,
			'externalProjection': OL_32632
                })
        })
});
raffica_lm.setVisibility(false);
var store_raffica_lm = new GeoExt.data.FeatureStore({
        fields: [
                {name: "idstazione", type: "integer"},
                {name: "denominazione", type: "string"},
                {name: "idsensore", type: "integer"},
                {name: "utm_nord", type: "integer"},
                {name: "utm_est", type: "integer"},
                {name: "ultimovalore", type: "float"},
                {name: "timeultimovalore", type: "string"}
        ],
        layer: raffica_lm
});
store_raffica_lm.on('load', function(store){
        store.sort('timeultimovalore', 'ASC');
});
var columns_raffica_lm = new Ext.grid.ColumnModel({
        defaults: {
                sortable: true
        },
        columns: [
                {header: "Id sensore", dataIndex: "idsensore",  width: 90},
		{header: "Denominazione", dataIndex: "denominazione", width: 100},
		{xtype: "numbercolumn", header: "Valore [m/s]", dataIndex: "ultimovalore", decimalPrecision: 1, align: "center", width: 60},
                {id: "Date", header: "Data ora", dataIndex: "timeultimovalore", sortable: true, width: 70},
		{header: "UTM X", dataIndex: "utm_est",  width: 90},
		{header: "UTM Y", dataIndex: "utm_nord",  width: 90}
        ]
});


/*LIVELLI IDROMETRICI LOMBARDIA*/
//Provo tematizzazione con CLUSTER e cerchi colorati - devo definire un cluster strategy per ogni layer altrimenti non so perche sballa e lo fa solo sull'ultimo layer per cui e' definito!
/*
var clust_temp_lm = new OpenLayers.Strategy.Cluster({
    distance: 0 //pixel
    , threshold: 2
});
var style_temp_clust_lm = new OpenLayers.Style(
    {   title: "${getTitle}",
        label: "${getLabel}", labelAlign: "cm", fontWeight: "bold", fontFamily: "sans-serif", fontSize: 15
        ,graphicName: "circle", fillColor: "${getFillColor_idro}", fillOpacity: 0.8, strokeColor:"black", pointRadius: "${getRadius}", strokeWidth: "${getWidth}"
    }
    //A quanto pare il context non funzione se c'e una Rule
    ,{context: context_temp_lm} //context dentro allo style
);
*/
var style_temp_clust_lm = new OpenLayers.Style({
	pointRadius: 12, strokeColor: "black", strokeWidth: 0.4, fillOpacity: 0.8//, strokeOpacity: 0.5, fillOpacity: 0.3, fillColor: "gray"
        ,title: "${denominazione}"
        ,label: "${ultimovalore}", labelAlign: "cm", fontWeight: "bold", fontFamily: "sans-serif", fontSize: 15
        }, {
        rules: [
        new OpenLayers.Rule({
                title: "Criticita elevata",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "stato_idro", value: 3
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "red"}
        }),
	new OpenLayers.Rule({
                title: "Criticita moderata",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "stato_idro", value: 2
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "orange"}
        }),
	new OpenLayers.Rule({
                title: "Criticita ordinaria",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "stato_idro", value: 1
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "yellow"}
        }),
	new OpenLayers.Rule({
                title: "Criticita assente",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "stato_idro", value: 0
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "green"}
        }),
	new OpenLayers.Rule({
                title: "Idrometro senza soglie",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "stato_idro", value: -1
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "gray"}
        }),

	new OpenLayers.Rule({
                title: " ",
                maxScaleDenominator:2500000,
                symbolizer: {pointRadius: 12}
        }),
     
 	new OpenLayers.Rule({
                title: " ",
		minScaleDenominator: 2500000,
                symbolizer: {pointRadius: 4},
        }),

	 /* new OpenLayers.Rule({
                title: " ",
                maxScaleDenominator: 500000,
               	symbolizer: {
                        pointRadius: 16
                }
        })*/
]});

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
	    //,clust_temp_lm
        ],
        projection: OL_32632,
        protocol: new OpenLayers.Protocol.WFS({
		//version: "1.1.0", srsName: "epsg:23032", geometryName: "the_geom",
		url: url_tinyows,
		featureNS: "http://www.tinyows.org/",
		//featureType: "v_datistazioni", //vecchia logica
		featureType: "v_last_idro", //nuova logica dati da meteo_real_time
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
	    //,clust_temp_lm
        ],
        projection: OL_32632,
        protocol: new OpenLayers.Protocol.WFS({
		//version: "1.1.0", srsName: "epsg:23032", geometryName: "the_geom",
		url: url_tinyows,
		featureNS: "http://www.tinyows.org/",
		//featureType: "v_datistazioni", //vecchia logica
		featureType: "v_last_pluvio", //nuova logica dati da meteo_real_time
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

//Vargiu 16/08/2017. Funzione test per il pointRadius delle precipitazioni cumulate.
/*
*/

    function getRadius_prec() {
        if (this.mapPanel.map.getScale() > 500000 && this.mapPanel.map.getScale() < 2500000) return 12;
        else if (this.mapPanel.map.getScale() > 2500000) return 4;
             else return 6;
    }
    




/* CUMULATA PIOGGIA 1H */
var style_cum1h = new OpenLayers.Style({
        pointRadius: 12, strokeColor: "black", strokeWidth: 0.4, fillOpacity: 0.8//, strokeOpacity: 0.5, fillOpacity: 0.3, fillColor: "gray"
        ,title: "${denominazione}"
        ,label: "${ultimovalore}", labelAlign: "cm", fontWeight: "bold", fontFamily: "sans-serif"
        }, {
        rules: [
        new OpenLayers.Rule({
                title: "Cumulata 0.1 - 1",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.BETWEEN,
                        property: "ultimovalore",
			lowerBoundary: 0.1,
		        upperBoundary: 1
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "green", fontSize: 15}
                //colore cambiato rispetto a 3h per verifica
        }),
        new OpenLayers.Rule({
                title: "Cumulata > 1",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.GREATER_THAN,
                        property: "ultimovalore", value: 1
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "yellow", fontSize: 15}
        }),
	new OpenLayers.Rule({
                title: " ",
                minScaleDenominator: 2500000,
                name: "scaleNoLegnd",
                symbolizer: {pointRadius: 4, fontSize: "0px"}
        }),
        new OpenLayers.Rule({
                title: " ",
                maxScaleDenominator: 2500000,
                name: "scaleNoLegnd",
                symbolizer: {pointRadius: 12},
        }),
        new OpenLayers.Rule({
                title: "Dati non registrati",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ultimovalore", value: -999
                })
                ,symbolizer: {pointRadius: 4, strokeWidth:0.5, fillColor: "white", fontSize: "0px"}
        }),
	new OpenLayers.Rule({
                title: "Cumulata zero",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ultimovalore", value: 0
                })
                ,symbolizer: {pointRadius: 3, strokeWidth:0.5, fillColor: "gray", fontSize: "0px"}
        })
	
]});
var styleMap_cum1h = new OpenLayers.StyleMap({
    "default": style_cum1h,
    "select": new OpenLayers.Style({fontSize: 19, pointRadius: 18, fillColor: "blue", fillOpacity: 0.8}),
    "temporary": new OpenLayers.Style({pointRadius: 20, fontSize: 19, cursor: "pointer"})
});
var cum1h = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_cum1h,
        strategies: [new OpenLayers.Strategy.Fixed()
            ,new OpenLayers.Strategy.Refresh({force: true, interval:150000})
        ],
        projection: OL_32632,
        protocol: new OpenLayers.Protocol.WFS({
                url: url_tinyows,
                featureNS: "http://www.tinyows.org/",
                featureType: "v_last_pluvio1h", //nuova logica dati da meteo_real_time
		geometryName: "the_geom"
        })
});
cum1h.setVisibility(false);
var store_cum1h = new GeoExt.data.FeatureStore({
        fields: [
                {name: "idstazione", type: "integer"},
                {name: "denominazione", type: "string"},
                {name: "idsensore", type: "integer"},
                {name: "utm_nord", type: "integer"},
                {name: "utm_est", type: "integer"},
                {name: "ultimovalore", type: "float"},
                {name: "timeultimovalore", type: "string"}
        ],
        layer: cum1h
});
store_cum1h.on('load', function(store){
        store.sort('timeultimovalore', 'ASC');
});
var columns_cum1h = new Ext.grid.ColumnModel({
        defaults: {
                sortable: true
        },
        columns: [
                {header: "Id sensore", dataIndex: "idsensore",  width: 90},
                {header: "Denominazione", dataIndex: "denominazione", width: 100},
                {xtype: "numbercolumn", header: "Valore [mm]", dataIndex: "ultimovalore", decimalPrecision: 1, align: "center", width: 60},
                {id: "Date", header: "Data ora ultimo dato", dataIndex: "timeultimovalore", sortable: true, width: 70},
                {header: "UTM X", dataIndex: "utm_est",  width: 90},
                {header: "UTM Y", dataIndex: "utm_nord",  width: 90}
        ]
});


/* CUMULATA PIOGGIA 3H */
var style_cum3h = new OpenLayers.Style({
        pointRadius: 12, strokeColor: "black", strokeWidth: 0.4, fillOpacity: 0.8//, strokeOpacity: 0.5, fillOpacity: 0.3, fillColor: "gray"
        ,title: "${denominazione}"
        ,label: "${ultimovalore}", labelAlign: "cm", fontWeight: "bold", fontFamily: "sans-serif"
        }, {
        rules: [
        new OpenLayers.Rule({
                title: "Cumulata 0.1 - 1",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.BETWEEN,
                        property: "ultimovalore",
			lowerBoundary: 0.1,
		        upperBoundary: 1
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "orange", fontSize: 15}
        }),
        new OpenLayers.Rule({
                title: "Cumulata > 1",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.GREATER_THAN,
                        property: "ultimovalore", value: 1
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "yellow", fontSize: 15}
        }),
	new OpenLayers.Rule({
                title: " ",
                minScaleDenominator: 2500000,
                name: "scaleNoLegnd",
                symbolizer: {pointRadius: 4, fontSize: "0px"}
        }),
        new OpenLayers.Rule({
                title: " ",
                maxScaleDenominator: 2500000,
                name: "scaleNoLegnd",
                symbolizer: {pointRadius: 12},
        }),
        new OpenLayers.Rule({
                title: "Dati non registrati",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ultimovalore", value: -999
                })
                ,symbolizer: {pointRadius: 4, strokeWidth:0.5, fillColor: "white", fontSize: "0px"}
        }),
	new OpenLayers.Rule({
                title: "Cumulata zero",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ultimovalore", value: 0
                })
                ,symbolizer: {pointRadius: 3, strokeWidth:0.5, fillColor: "gray", fontSize: "0px"}
        })
	
]});
var styleMap_cum3h = new OpenLayers.StyleMap({
    "default": style_cum3h,
    "select": new OpenLayers.Style({fontSize: 19, pointRadius: 18, fillColor: "blue", fillOpacity: 0.8}),
    "temporary": new OpenLayers.Style({pointRadius: 20, fontSize: 19, cursor: "pointer"})
});
var cum3h = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_cum3h,
        strategies: [new OpenLayers.Strategy.Fixed()
            ,new OpenLayers.Strategy.Refresh({force: true, interval:150000})
        ],
        projection: OL_32632,
        protocol: new OpenLayers.Protocol.WFS({
                url: url_tinyows,
                featureNS: "http://www.tinyows.org/",
                featureType: "v_last_pluvio3h", //nuova logica dati da meteo_real_time
		geometryName: "the_geom"
        })
});
cum3h.setVisibility(false);
var store_cum3h = new GeoExt.data.FeatureStore({
        fields: [
                {name: "idstazione", type: "integer"},
                {name: "denominazione", type: "string"},
                {name: "idsensore", type: "integer"},
                {name: "utm_nord", type: "integer"},
                {name: "utm_est", type: "integer"},
                {name: "ultimovalore", type: "float"},
                {name: "timeultimovalore", type: "string"}
        ],
        layer: cum3h
});
store_cum3h.on('load', function(store){
        store.sort('timeultimovalore', 'ASC');
});
var columns_cum3h = new Ext.grid.ColumnModel({
        defaults: {
                sortable: true
        },
        columns: [
                {header: "Id sensore", dataIndex: "idsensore",  width: 90},
                {header: "Denominazione", dataIndex: "denominazione", width: 100},
                {xtype: "numbercolumn", header: "Valore [mm]", dataIndex: "ultimovalore", decimalPrecision: 1, align: "center", width: 60},
                {id: "Date", header: "Data ora ultimo dato", dataIndex: "timeultimovalore", sortable: true, width: 70},
                {header: "UTM X", dataIndex: "utm_est",  width: 90},
                {header: "UTM Y", dataIndex: "utm_nord",  width: 90}
        ]
});


/* CUMULATA PIOGGIA 6H */
var style_cum6h = new OpenLayers.Style({
        pointRadius: 12, strokeColor: "black", strokeWidth: 0.4, fillOpacity: 0.8//, strokeOpacity: 0.5, fillOpacity: 0.3, fillColor: "gray"
        ,title: "${denominazione}"
        ,label: "${ultimovalore}", labelAlign: "cm", fontWeight: "bold", fontFamily: "sans-serif"
        }, {
        rules: [
        new OpenLayers.Rule({
                title: "Cumulata 0.1 - 1",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.BETWEEN,
                        property: "ultimovalore",
			lowerBoundary: 0.1,
		        upperBoundary: 1
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "green", fontSize: 15}
                //colore cambiato rispetto a 3h per verifica
        }),
        new OpenLayers.Rule({
                title: "Cumulata > 1",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.GREATER_THAN,
                        property: "ultimovalore", value: 1
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "yellow", fontSize: 15}
        }),
	new OpenLayers.Rule({
                title: " ",
                minScaleDenominator: 2500000,
                name: "scaleNoLegnd",
                symbolizer: {pointRadius: 4, fontSize: "0px"}
        }),
        new OpenLayers.Rule({
                title: " ",
                maxScaleDenominator: 2500000,
                name: "scaleNoLegnd",
                symbolizer: {pointRadius: 12},
        }),
        new OpenLayers.Rule({
                title: "Dati non registrati",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ultimovalore", value: -999
                })
                ,symbolizer: {pointRadius: 4, strokeWidth:0.5, fillColor: "white", fontSize: "0px"}
        }),
	new OpenLayers.Rule({
                title: "Cumulata zero",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ultimovalore", value: 0
                })
                ,symbolizer: {pointRadius: 3, strokeWidth:0.5, fillColor: "gray", fontSize: "0px"}
        })
	
]});
var styleMap_cum6h = new OpenLayers.StyleMap({
    "default": style_cum6h,
    "select": new OpenLayers.Style({fontSize: 19, pointRadius: 18, fillColor: "blue", fillOpacity: 0.8}),
    "temporary": new OpenLayers.Style({pointRadius: 20, fontSize: 19, cursor: "pointer"})
});
var cum6h = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_cum6h,
        strategies: [new OpenLayers.Strategy.Fixed()
            ,new OpenLayers.Strategy.Refresh({force: true, interval:150000})
        ],
        projection: OL_32632,
        protocol: new OpenLayers.Protocol.WFS({
                url: url_tinyows,
                featureNS: "http://www.tinyows.org/",
                featureType: "v_last_pluvio6h", //nuova logica dati da meteo_real_time
		geometryName: "the_geom"
        })
});
cum6h.setVisibility(false);
var store_cum6h = new GeoExt.data.FeatureStore({
        fields: [
                {name: "idstazione", type: "integer"},
                {name: "denominazione", type: "string"},
                {name: "idsensore", type: "integer"},
                {name: "utm_nord", type: "integer"},
                {name: "utm_est", type: "integer"},
                {name: "ultimovalore", type: "float"},
                {name: "timeultimovalore", type: "string"}
        ],
        layer: cum6h
});
store_cum6h.on('load', function(store){
        store.sort('timeultimovalore', 'ASC');
});
var columns_cum6h = new Ext.grid.ColumnModel({
        defaults: {
                sortable: true
        },
        columns: [
                {header: "Id sensore", dataIndex: "idsensore",  width: 90},
                {header: "Denominazione", dataIndex: "denominazione", width: 100},
                {xtype: "numbercolumn", header: "Valore [mm]", dataIndex: "ultimovalore", decimalPrecision: 1, align: "center", width: 60},
                {id: "Date", header: "Data ora ultimo dato", dataIndex: "timeultimovalore", sortable: true, width: 70},
                {header: "UTM X", dataIndex: "utm_est",  width: 90},
                {header: "UTM Y", dataIndex: "utm_nord",  width: 90}
        ]
});


/* CUMULATA PIOGGIA 9H */
var style_cum9h = new OpenLayers.Style({
        pointRadius: 12, strokeColor: "black", strokeWidth: 0.4, fillOpacity: 0.8//, strokeOpacity: 0.5, fillOpacity: 0.3, fillColor: "gray"
        ,title: "${denominazione}"
        ,label: "${ultimovalore}", labelAlign: "cm", fontWeight: "bold", fontFamily: "sans-serif"
        }, {
        rules: [
        new OpenLayers.Rule({
                title: "Cumulata 0.1 - 1",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.BETWEEN,
                        property: "ultimovalore",
			lowerBoundary: 0.1,
		        upperBoundary: 1
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "green", fontSize: 15}
                //colore cambiato rispetto a 3h per verifica
        }),
        new OpenLayers.Rule({
                title: "Cumulata > 1",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.GREATER_THAN,
                        property: "ultimovalore", value: 1
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "yellow", fontSize: 15}
        }),
	new OpenLayers.Rule({
                title: " ",
                minScaleDenominator: 2500000,
                name: "scaleNoLegnd",
                symbolizer: {pointRadius: 4, fontSize: "0px"}
        }),
        new OpenLayers.Rule({
                title: " ",
                maxScaleDenominator: 2500000,
                name: "scaleNoLegnd",
                symbolizer: {pointRadius: 12},
        }),
        new OpenLayers.Rule({
                title: "Dati non registrati",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ultimovalore", value: -999
                })
                ,symbolizer: {pointRadius: 4, strokeWidth:0.5, fillColor: "white", fontSize: "0px"}
        }),
	new OpenLayers.Rule({
                title: "Cumulata zero",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ultimovalore", value: 0
                })
                ,symbolizer: {pointRadius: 3, strokeWidth:0.5, fillColor: "gray", fontSize: "0px"}
        })
	
]});
var styleMap_cum9h = new OpenLayers.StyleMap({
    "default": style_cum9h,
    "select": new OpenLayers.Style({fontSize: 19, pointRadius: 18, fillColor: "blue", fillOpacity: 0.8}),
    "temporary": new OpenLayers.Style({pointRadius: 20, fontSize: 19, cursor: "pointer"})
});
var cum9h = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_cum9h,
        strategies: [new OpenLayers.Strategy.Fixed()
            ,new OpenLayers.Strategy.Refresh({force: true, interval:150000})
        ],
        projection: OL_32632,
        protocol: new OpenLayers.Protocol.WFS({
                url: url_tinyows,
                featureNS: "http://www.tinyows.org/",
                featureType: "v_last_pluvio9h", //nuova logica dati da meteo_real_time
		geometryName: "the_geom"
        })
});
cum9h.setVisibility(false);
var store_cum9h = new GeoExt.data.FeatureStore({
        fields: [
                {name: "idstazione", type: "integer"},
                {name: "denominazione", type: "string"},
                {name: "idsensore", type: "integer"},
                {name: "utm_nord", type: "integer"},
                {name: "utm_est", type: "integer"},
                {name: "ultimovalore", type: "float"},
                {name: "timeultimovalore", type: "string"}
        ],
        layer: cum9h
});
store_cum9h.on('load', function(store){
        store.sort('timeultimovalore', 'ASC');
});
var columns_cum9h = new Ext.grid.ColumnModel({
        defaults: {
                sortable: true
        },
        columns: [
                {header: "Id sensore", dataIndex: "idsensore",  width: 90},
                {header: "Denominazione", dataIndex: "denominazione", width: 100},
                {xtype: "numbercolumn", header: "Valore [mm]", dataIndex: "ultimovalore", decimalPrecision: 1, align: "center", width: 60},
                {id: "Date", header: "Data ora ultimo dato", dataIndex: "timeultimovalore", sortable: true, width: 70},
                {header: "UTM X", dataIndex: "utm_est",  width: 90},
                {header: "UTM Y", dataIndex: "utm_nord",  width: 90}
        ]
});


/* CUMULATA PIOGGIA 12H */
var style_cum12h = new OpenLayers.Style({
        pointRadius: 12, strokeColor: "black", strokeWidth: 0.4, fillOpacity: 0.8//, strokeOpacity: 0.5, fillOpacity: 0.3, fillColor: "gray"
        ,title: "${denominazione}"
        ,label: "${ultimovalore}", labelAlign: "cm", fontWeight: "bold", fontFamily: "sans-serif"
        }, {
        rules: [
        new OpenLayers.Rule({
                title: "Cumulata 0.1 - 1",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.BETWEEN,
                        property: "ultimovalore",
			lowerBoundary: 0.1,
		        upperBoundary: 1
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "green", fontSize: 15}
                //colore cambiato rispetto a 3h per verifica
        }),
        new OpenLayers.Rule({
                title: "Cumulata > 1",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.GREATER_THAN,
                        property: "ultimovalore", value: 1
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "yellow", fontSize: 15}
        }),
	new OpenLayers.Rule({
                title: " ",
                minScaleDenominator: 2500000,
                name: "scaleNoLegnd",
                symbolizer: {pointRadius: 4, fontSize: "0px"}
        }),
        new OpenLayers.Rule({
                title: " ",
                name: "scaleNoLegnd",
                maxScaleDenominator: 2500000,
                symbolizer: {pointRadius: 12},
        }),
        new OpenLayers.Rule({
                title: "Dati non registrati",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ultimovalore", value: -999
                })
                ,symbolizer: {pointRadius: 4, strokeWidth:0.5, fillColor: "white", fontSize: "0px"}
        }),
	new OpenLayers.Rule({
                title: "Cumulata zero",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ultimovalore", value: 0
                })
                ,symbolizer: {pointRadius: 3, strokeWidth:0.5, fillColor: "gray", fontSize: "0px"}
        })
	
]});
var styleMap_cum12h = new OpenLayers.StyleMap({
    "default": style_cum12h,
    "select": new OpenLayers.Style({fontSize: 19, pointRadius: 18, fillColor: "blue", fillOpacity: 0.8}),
    "temporary": new OpenLayers.Style({pointRadius: 20, fontSize: 19, cursor: "pointer"})
});
var cum12h = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_cum12h,
        strategies: [new OpenLayers.Strategy.Fixed()
            ,new OpenLayers.Strategy.Refresh({force: true, interval:150000})
        ],
        projection: OL_32632,
        protocol: new OpenLayers.Protocol.WFS({
                url: url_tinyows,
                featureNS: "http://www.tinyows.org/",
                featureType: "v_last_pluvio12h", //nuova logica dati da meteo_real_time
		geometryName: "the_geom"
        })
});
cum12h.setVisibility(false);
var store_cum12h = new GeoExt.data.FeatureStore({
        fields: [
                {name: "idstazione", type: "integer"},
                {name: "denominazione", type: "string"},
                {name: "idsensore", type: "integer"},
                {name: "utm_nord", type: "integer"},
                {name: "utm_est", type: "integer"},
                {name: "ultimovalore", type: "float"},
                {name: "timeultimovalore", type: "string"}
        ],
        layer: cum12h
});
store_cum12h.on('load', function(store){
        store.sort('timeultimovalore', 'ASC');
});
var columns_cum12h = new Ext.grid.ColumnModel({
        defaults: {
                sortable: true
        },
        columns: [
                {header: "Id sensore", dataIndex: "idsensore",  width: 90},
                {header: "Denominazione", dataIndex: "denominazione", width: 100},
                {xtype: "numbercolumn", header: "Valore [mm]", dataIndex: "ultimovalore", decimalPrecision: 1, align: "center", width: 60},
                {id: "Date", header: "Data ora ultimo dato", dataIndex: "timeultimovalore", sortable: true, width: 70},
                {header: "UTM X", dataIndex: "utm_est",  width: 90},
                {header: "UTM Y", dataIndex: "utm_nord",  width: 90}
        ]
});


/* CUMULATA PIOGGIA 24H */
var style_cum24h = new OpenLayers.Style({
        pointRadius: 12, strokeColor: "black", strokeWidth: 0.4, fillOpacity: 0.8//, strokeOpacity: 0.5, fillOpacity: 0.3, fillColor: "gray"
        ,title: "${denominazione}"
        ,label: "${ultimovalore}", labelAlign: "cm", fontWeight: "bold", fontFamily: "sans-serif"
        }, {
        rules: [
        new OpenLayers.Rule({
                title: "Cumulata 0.1 - 1",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.BETWEEN,
                        property: "ultimovalore",
			lowerBoundary: 0.1,
		        upperBoundary: 1
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "green", fontSize: 15}
                //colore cambiato rispetto a 3h per verifica
        }),
        new OpenLayers.Rule({
                title: "Cumulata > 1",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.GREATER_THAN,
                        property: "ultimovalore", value: 1
                })
                ,symbolizer: {pointRadius: 6, strokeWidth:0.5, fillColor: "yellow", fontSize: 15}
        }),

	new OpenLayers.Rule({
                title: " ",
                minScaleDenominator: 2500000,
                name: "scaleNoLegnd",
                //Vargiu: tento di passare dei flag (hidden:true o hideInLegend:true) per evitere la visualizzazione nella legenda. NON VENGONO RICONOSCIUTI!     
                //hidden:true,
                //hideInLegend:true,
                //default: {hidden:true,hideInLegend:true},
                symbolizer: {pointRadius: 4 }
                //symbolizer: {pointRadius: 4, fontSize:"0px",hideInLegend:true,hidden:true}
        }),
        new OpenLayers.Rule({
                title: " ",
                maxScaleDenominator: 2500000,
                name: "scaleNoLegnd",
                //Vargiu: tento di passare dei flag (hidden:true o hideInLegend:true) per evitere la visualizzazione nella legenda. NON VENGONO RICONOSCIUTI!     
                //hidden:true,
                //hideInLegend:true,
                symbolizer: {pointRadius: 12}
                //symbolizer: {pointRadius: 12, hideInLegend:true,hidden:true}
        }),

        new OpenLayers.Rule({
                title: "Dati non registrati",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ultimovalore", value: -999
                })
                ,symbolizer: {pointRadius: 4, strokeWidth:0.5, fillColor: "white", fontSize: "0px"}
        }),
	new OpenLayers.Rule({
                title: "Cumulata zero",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ultimovalore", value: 0
                })
                ,symbolizer: {pointRadius: 3, strokeWidth:0.5, fillColor: "gray", fontSize: "0px"}
        })
	
]});
var styleMap_cum24h = new OpenLayers.StyleMap({
    "default": style_cum24h,
    "select": new OpenLayers.Style({fontSize: 19, pointRadius: 18, fillColor: "blue", fillOpacity: 0.8}),
    "temporary": new OpenLayers.Style({pointRadius: 20, fontSize: 19, cursor: "pointer"})
});
var cum24h = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_cum24h,
        strategies: [new OpenLayers.Strategy.Fixed()
            ,new OpenLayers.Strategy.Refresh({force: true, interval:150000})
        ],
        projection: OL_32632,
        protocol: new OpenLayers.Protocol.WFS({
                url: url_tinyows,
                featureNS: "http://www.tinyows.org/",
                featureType: "v_last_pluvio24h", //nuova logica dati da meteo_real_time
		geometryName: "the_geom"
        })
});
cum24h.setVisibility(false);
var store_cum24h = new GeoExt.data.FeatureStore({
        fields: [
                {name: "idstazione", type: "integer"},
                {name: "denominazione", type: "string"},
                {name: "idsensore", type: "integer"},
                {name: "utm_nord", type: "integer"},
                {name: "utm_est", type: "integer"},
                {name: "ultimovalore", type: "float"},
                {name: "timeultimovalore", type: "string"}
        ],
        layer: cum24h
});
store_cum24h.on('load', function(store){
        store.sort('timeultimovalore', 'ASC');
});
var columns_cum24h = new Ext.grid.ColumnModel({
        defaults: {
                sortable: true
        },
        columns: [
                {header: "Id sensore", dataIndex: "idsensore",  width: 90},
                {header: "Denominazione", dataIndex: "denominazione", width: 100},
                {xtype: "numbercolumn", header: "Valore [mm]", dataIndex: "ultimovalore", decimalPrecision: 1, align: "center", width: 60},
                {id: "Date", header: "Data ora ultimo dato", dataIndex: "timeultimovalore", sortable: true, width: 70},
                {header: "UTM X", dataIndex: "utm_est",  width: 90},
                {header: "UTM Y", dataIndex: "utm_nord",  width: 90}
        ]
});

/*LIVELLI NIVOMETRICI LOMBARDIA*/
//Provo tematizzazione con CLUSTER e cerchi colorati - devo definire un cluster strategy per ogni layer altrimenti non so perche sballa e lo fa solo sull'ultimo layer per cui e' definito!

var clust_temp_lm = new OpenLayers.Strategy.Cluster({
    distance:0 //pixel
    , threshold: 2
});
var style_temp_clust_lm = new OpenLayers.Style(
    {   title: "${getTitle}",
        label: "${getLabel}", labelAlign: "cm", fontWeight: "bold", fontFamily: "sans-serif", fontSize: 15
        ,graphicName: "circle", fillColor: "${getFillColor_idro}", fillOpacity: 0.8, strokeColor:"black", pointRadius: "${getRadius}", strokeWidth: "${getWidth}"
    }
    //A quanto pare il context non funzione se c'e una Rule
    ,{context: context_temp_lm} //context dentro allo style
);
var styleMap_temp_clust_lm = new OpenLayers.StyleMap({
    "default": style_temp_clust_lm,
    "select": new OpenLayers.Style({fontSize: 19, pointRadius: 18, fillColor: "blue", fillOpacity: 0.8}),
    "temporary": new OpenLayers.Style({pointRadius: 20, fontSize: 19, cursor: "pointer"})
});
var livelloneve_lm = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_temp_clust_lm,
        //minScale: 250000,
        strategies: [new OpenLayers.Strategy.Fixed()
            ,new OpenLayers.Strategy.Refresh({force: true, interval:150000})
            //,filterStrategy_temp
            //,clust_temp_lm
        ],
        projection: OL_32632,
        protocol: new OpenLayers.Protocol.WFS({
                //version: "1.1.0", srsName: "epsg:23032", geometryName: "the_geom",
                url: url_tinyows,
                featureNS: "http://www.tinyows.org/",
                //featureType: "v_datistazioni", //vecchia logica
                featureType: "v_last_nivo", //nuova logica dati da meteo_real_time
                //featurePrefix: "tows",
                readFormat: new OpenLayers.Format.GML({
                        'internalProjection': OL_32632,
                        'externalProjection': OL_32632
                })
        })
});
livelloneve_lm.setVisibility(false);
var store_nivo_lm = new GeoExt.data.FeatureStore({
        fields: [
                {name: "idstazione", type: "integer"},
                {name: "denominazione", type: "string"},
                {name: "idsensore", type: "integer"},
                {name: "utm_nord", type: "integer"},
                {name: "utm_est", type: "integer"},
                {name: "ultimovalore", type: "float"},
                {name: "timeultimovalore", type: "string"}
        ],
        layer: livelloneve_lm
});
store_nivo_lm.on('load', function(store){
        store.sort('timeultimovalore', 'ASC');
});
var columns_nivo_lm = new Ext.grid.ColumnModel({
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

/* DATI VENTO - simboli */
var styleMap_datistaz = new OpenLayers.StyleMap({
"default": style_vento_graphicname
,"select": new OpenLayers.Style({fontSize: 19, pointRadius: 23, fillColor: "black", fillOpacity: 0.8})
,"temporary": new OpenLayers.Style({pointRadius: 23, cursor: "pointer"})
});
var filter_rupar = new OpenLayers.Filter.Comparison({
        type: OpenLayers.Filter.Comparison.EQUAL_TO,
        property: "flag_rupar",
        value: 'S'
});
var filterStrategy_temp = new OpenLayers.Strategy.Filter({filter: filter_rupar});
var vento_lm = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_datistaz,
        strategies: [//new OpenLayers.Strategy.Fixed()
	new OpenLayers.Strategy.BBOX()
	,new OpenLayers.Strategy.Refresh({force: true, interval: 150000})
        //,filterStrategy_temp
        ],
        projection: OL_32632,
        protocol: new OpenLayers.Protocol.WFS({
                url: url_tinyows,
                //featureType: "v_datistazioni", //vecchia logica
		featureType: "v_last_vento", //nuova logica ultimo dato da meteo_real_time
                featureNS: "http://www.tinyows.org/"
                ,readFormat: new OpenLayers.Format.GML({
                        'internalProjection': OL_32632,
                        'externalProjection': OL_32632
                })
        })
});
vento_lm.setVisibility(false);


