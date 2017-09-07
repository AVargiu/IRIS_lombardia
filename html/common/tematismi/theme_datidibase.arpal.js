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

///////////////// DEFINIZIONE WFS VECTOR LAYER //////////////////////

/*STAZIONI IDRONIVOMETEO*/
var style_staz = new OpenLayers.Style({
        pointRadius: 5, strokeColor: "black", strokeWidth: 0.4, fillOpacity: 0.3//, strokeOpacity: 0.5, fillOpacity: 0.3, fillColor: "gray"
        ,title: "${denominazione}"
        ,label: "${denominazione}", labelAlign: "ct", fontWeight: "bold", fontFamily: "sans-serif", labelYOffset: -10
        }, {
        rules: [
        new OpenLayers.Rule({
                title: "Idrometrica",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "meteo_tab", value: 'Idrometrica'
                })
                ,symbolizer: {pointRadius: 5, strokeWidth:0.5, fillColor: "green"}
        }),
	new OpenLayers.Rule({
                title: "Meteorologica",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "meteo_tab", value: 'Meteorologica'
                })
                ,symbolizer: {pointRadius: 5, strokeWidth:0.5, fillColor: "red"}
        }),
	new OpenLayers.Rule({
                title: "Pluviometrica",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "meteo_tab", value: 'Pluviometrica'
                })
                ,symbolizer: {graphicName: "triangle", pointRadius: 5, strokeWidth:0.5, fillColor: "blue"}
        }),
        new OpenLayers.Rule({
                title: "Anemometrica",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "meteo_tab", value: 'Anemometrica'
                })
                ,symbolizer: {graphicName: "square", pointRadius: 5, strokeWidth:0.5, fillColor: "orange"}
        }),
        new OpenLayers.Rule({
                title: " ",
                minScaleDenominator: 250000,
                symbolizer: {fontSize: "0px", strokeWidth:0.6}
        }),
        new OpenLayers.Rule({
                title: " ",
                maxScaleDenominator: 250000,
                symbolizer: {
                        fontSize: "12px"
                }
        })
]});
var styleMap_staz = new OpenLayers.StyleMap({
        "default": style_staz,
        "select": new OpenLayers.Style({pointRadius: 8, fillColor: "blue", fillOpacity: 0.8})
        ,"temporary": new OpenLayers.Style({pointRadius: 8, fontSize: 13, cursor: "pointer"})
});
var staz = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_staz,
        strategies: [new OpenLayers.Strategy.BBOX()
        ],
        projection: OL_32632,
        protocol: new OpenLayers.Protocol.WFS({
                url: url_tinyows, featureType: "v_anagraficasensori",
                featureNS: "http://www.tinyows.org/",
                srsName: "epsg:32632", geometryName: "the_geom"
        })
});
staz.setVisibility(false);
store_staz_lm = new GeoExt.data.FeatureStore({
	fields: [
	{name: "idstazione", type: "string"},
		{name: "denominazione", type: "string"},
		{name: "quota", type: "integer"},
		{name: "utm_nord", type: "integer"},
		{name: "utm_est", type: "integer"},
		{name: "nometipologie", type: "string"},
		{name: "idsensori", type: "string"}
	],
	layer: staz
	,autoLoad: true
});
store_staz_lm.on('load', function(store){
        store.sort('denominazione', 'ASC');
});
var columns_staz_lm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true
    },
	columns: [
		{header: "Denominazione", dataIndex: "denominazione", align: "center", width: 200},
		{header: "Codice stazione", dataIndex: "idstazione"},
		{header: "Quota [m slm]", dataIndex: "quota"},
		{header: "Utm X [m]", dataIndex: "utm_est"},
		{header: "Utm Y [m]", dataIndex: "utm_nord"},
		{header: "Tipo sensori", dataIndex: "nometipologie"},
		{header: "ID sensori", dataIndex: "idsensori"}
	]
});



/*STAZIONI IDRONIVOMETEO ARPA LOMBARDIA*/
var style_stazarpa = new OpenLayers.Style({
        pointRadius: 5, strokeColor: "black", strokeWidth: 0.4, fillOpacity: 0.3//, strokeOpacity: 0.5, fillOpacity: 0.3, fillColor: "gray"
        ,title: "${denominazione}"
        ,label: "${denominazione}", labelAlign: "ct", fontWeight: "bold", fontFamily: "sans-serif", labelYOffset: -10
        }, {
        rules: [
        new OpenLayers.Rule({
                title: "Idrometrica",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "meteo_tab", value: 'Idrometrica'
                })
                ,symbolizer: {pointRadius: 5, strokeWidth:0.5, fillColor: "green"}
        }),
	new OpenLayers.Rule({
                title: "Meteorologica",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "meteo_tab", value: 'Meteorologica'
                })
                ,symbolizer: {pointRadius: 5, strokeWidth:0.5, fillColor: "red"}
        }),
	new OpenLayers.Rule({
                title: "Pluviometrica",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "meteo_tab", value: 'Pluviometrica'
                })
                ,symbolizer: {graphicName: "triangle", pointRadius: 5, strokeWidth:0.5, fillColor: "blue"}
        }),
        new OpenLayers.Rule({
                title: "Anemometrica",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "meteo_tab", value: 'Anemometrica'
                })
                ,symbolizer: {graphicName: "square", pointRadius: 5, strokeWidth:0.5, fillColor: "orange"}
        }),
        new OpenLayers.Rule({
                title: " ",
                minScaleDenominator: 250000,
                symbolizer: {fontSize: "0px", strokeWidth:0.6}
        }),
        new OpenLayers.Rule({
                title: " ",
                maxScaleDenominator: 250000,
                symbolizer: {
                        fontSize: "12px"
                }
        })
]});
var styleMap_stazarpa = new OpenLayers.StyleMap({
        "default": style_stazarpa,
        "select": new OpenLayers.Style({pointRadius: 8, fillColor: "blue", fillOpacity: 0.8})
        ,"temporary": new OpenLayers.Style({pointRadius: 8, fontSize: 13, cursor: "pointer"})
});
var stazarpa = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_stazarpa,
        strategies: [new OpenLayers.Strategy.BBOX()
        ],
        projection: OL_32632,
        protocol: new OpenLayers.Protocol.WFS({
                url: url_tinyows, featureType: "v_anagraficasensoriarpa",
                featureNS: "http://www.tinyows.org/",
                srsName: "epsg:32632", geometryName: "the_geom"
        })
});
stazarpa.setVisibility(false);
store_stazarpa_lm = new GeoExt.data.FeatureStore({
	fields: [
	{name: "idstazione", type: "string"},
		{name: "denominazione", type: "string"},
		{name: "quota", type: "integer"},
		{name: "utm_nord", type: "integer"},
		{name: "utm_est", type: "integer"},
		{name: "nometipologie", type: "string"},
		{name: "idsensori", type: "string"}
	],
	layer: stazarpa
	,autoLoad: true
});
store_stazarpa_lm.on('load', function(store){
        store.sort('denominazione', 'ASC');
});
var columns_stazarpa_lm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true
    },
	columns: [
		{header: "Denominazione", dataIndex: "denominazione", align: "center", width: 200},
		{header: "Codice stazione", dataIndex: "idstazione"},
		{header: "Quota [m slm]", dataIndex: "quota"},
		{header: "Utm X [m]", dataIndex: "utm_est"},
		{header: "Utm Y [m]", dataIndex: "utm_nord"},
		{header: "Tipo sensori", dataIndex: "nometipologie"},
		{header: "ID sensori", dataIndex: "idsensori"}
	]
});



