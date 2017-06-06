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


/*STAZIONI IDRONIVOMETEO TEST*/
var style_staz_idro = new OpenLayers.Style({
        pointRadius: 7, strokeColor: "black", strokeWidth: 0.4//, strokeOpacity: 0.5, fillOpacity: 0.3, fillColor: "gray"
        ,title: "${nome}"
        ,label: "${nome}", labelAlign: "ct", fontWeight: "bold", fontFamily: "sans-serif", labelYOffset: -10
        }, {
        rules: [
        /*new OpenLayers.Rule({
                title: "senza scala o configurazione",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.LIKE,
                        property: "scale", value: 'N'
                })
                ,symbolizer: {pointRadius: 7, strokeWidth:0.5, fillColor: "red"}
        }),*/
        new OpenLayers.Rule({
                title: "con misuratore configurato",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.LIKE,
                        property: "scale", value: 'MISURATORE'
                })
                ,symbolizer: {pointRadius: 7, strokeWidth:0.5, fillColor: "green"}
        }),
        /*new OpenLayers.Rule({
                title: "senza scala",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.NOT_EQUAL_TO,
                        property: "scale", value: 'S'
                })
                ,symbolizer: {pointRadius: 7, strokeWidth:0.5, fillColor: "red"}
        }),*/
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
var styleMap_staz_idro = new OpenLayers.StyleMap({
        "default": style_staz_idro,
        "select": new OpenLayers.Style({pointRadius: 8, fillColor: "blue", fillOpacity: 0.8})
        ,"temporary": new OpenLayers.Style({pointRadius: 8, fontSize: 13, cursor: "pointer"})
});
var staz_idro = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_staz_idro,
        strategies: [new OpenLayers.Strategy.BBOX()
        ],
        projection: OL_3003,
        protocol: new OpenLayers.Protocol.WFS({
                url: url_tinyows, featureType: "idronivometeo",
                featureNS: "http://www.tinyows.org/",
                srsName: "epsg:3003", geometryName: "the_geom"
        })
});
staz_idro.setVisibility(false);


/*AREE ALLERTAMENTO*/
var style_zoneall = new OpenLayers.Style();
var ordinaria = new OpenLayers.Rule({
	title: "Situazione Ordinaria",
    filter: new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		property: "stato_allertamento", value: "0"
	}),
	symbolizer: {strokeColor: "black", strokeWidth: 2, strokeOpacity: 1, fillColor: "green", fillOpacity: 0.4
		, label: "${cod_area}", labelAlign: "cm", fontSize: "11px", fontColor: 'black', fontWeight: "bold", fontFamily: 'Arial'}
});
var criticita = new OpenLayers.Rule({
	title: "Ordinaria Criticita",
    filter: new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		property: "stato_allertamento", value: "1"
	}),
	symbolizer: {strokeColor: "black", strokeWidth: 2, strokeOpacity: 1, fillColor: "#ffd800", fillOpacity: 0.5
		, label: "${cod_area}", labelAlign: "cm", fontSize: "11px", fontColor: 'black', fontWeight: "bold", fontFamily: 'Arial'}
});
var codice2 = new OpenLayers.Rule({
	title: "Codice 2",
    filter: new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		property: "stato_allertamento", value: "2"
	}),
	symbolizer: {strokeColor: "black", strokeWidth: 2, strokeOpacity: 1, fillColor: "orange", fillOpacity: 0.6
		, label: "${cod_area}", labelAlign: "cm", fontSize: "11px", fontColor: 'black', fontWeight: "bold", fontFamily: 'Arial'}
});
var codice3 = new OpenLayers.Rule({
	title: "Codice 3",
    filter: new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.EQUAL_TO,
		property: "stato_allertamento", value: "3"
	}),
	symbolizer: {strokeColor: "black", strokeWidth: 2, strokeOpacity: 1, fillColor: "red", fillOpacity: 0.6
		, label: "${cod_area}", labelAlign: "cm", fontSize: "11px", fontColor: 'black', fontWeight: "bold", fontFamily: 'Arial'}
});
style_zoneall.addRules([ordinaria, criticita, codice2, codice3]);
var styleMap_zoneall = new OpenLayers.StyleMap({
	"default": style_zoneall
	, "temporary": new OpenLayers.Style({strokeWidth:4, fontSize: 15, fillOpacity: 1, cursor: "pointer"})
});
var zoneall = new OpenLayers.Layer.Vector(default_layer_name, {
	styleMap: styleMap_zoneall,
	//strategies: [new OpenLayers.Strategy.BBOX()],
	strategies: [new OpenLayers.Strategy.Fixed()],
	protocol: new OpenLayers.Protocol.WFS({
		url: urlMS_datidibase, featureType: "aree_allertamento", 
		//version: "1.1.0",
		featureNS: "http://mapserver.gis.umn.edu/mapserver",
		geometryName: "the_geom", srsName: "epsg:23032"
		//extractAttributes: true, //extractStyles: true, //geometry: "msGeometry",
	})
});
zoneall.setVisibility(false);
store_zoneall = new GeoExt.data.FeatureStore({
        fields: [
                {name: "cod_area", type: "string"},
                {name: "nome_area", type: "string"},
                {name: "stato_allertamento", type: "string"}
        ],
        layer: zoneall
});
var columns_zoneall = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true
    },
        columns: [
                {header: "Codice area", dataIndex: "cod_area"},
                {header: "<b>Nome</b>", dataIndex: "nome_area", width: 250},
                {header: "Stato allertamento", dataIndex: "stato_allertamento"}
        ]
});


/*PRECIPITAZIONE OPREVISTA SU AREE IDROLOGICHE*/
var style_zone_idro = new OpenLayers.Style();
var zone_idro = new OpenLayers.Rule({
        title: "Zone idrologiche",
        symbolizer: {strokeColor: "black", strokeWidth: 2, strokeOpacity: 1, fillColor: "#EDE2E2", fillOpacity: 0.2
                , label: "${cod_area_allerta}", labelAlign: "cm", fontSize: "11px", fontColor: 'black', fontWeight: "bold", fontFamily: 'Arial'}
});
style_zone_idro.addRules([zone_idro]);
var styleMap_zone_idro = new OpenLayers.StyleMap({
	"default": style_zone_idro
	, "temporary": new OpenLayers.Style({strokeWidth:4, fontSize: 15, fillOpacity: 1, cursor: "pointer"})
});
var zoneall2 = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_zone_idro,
        //strategies: [new OpenLayers.Strategy.BBOX()],
        strategies: [new OpenLayers.Strategy.Fixed()],
	projection: OL_23032,
        protocol: new OpenLayers.Protocol.WFS({
	    url: url_tinyows, featureType: "zone_idrologiche_simplified",
	    featureNS: "http://www.tinyows.org/",
            readFormat: new OpenLayers.Format.GML({
                    'internalProjection': OL_23032,
		    'externalProjection': OL_23032
            })
	})
});
zoneall2.setVisibility(false);

/*PRECIPITAZIONE OPREVISTA SU AREE IDROLOGICHE*/
var style_zone_idro1 = new OpenLayers.Style();
var zone_idro1 = new OpenLayers.Rule({
        title: "Zone idrologiche 10gg",
        symbolizer: {strokeColor: "black", strokeWidth: 2, strokeOpacity: 1, fillColor: "#EDE2E2", fillOpacity: 0.2
                , label: "${cod_area_allerta}", labelAlign: "cm", fontSize: "11px", fontColor: 'black', fontWeight: "bold", fontFamily: 'Arial'}
});
style_zone_idro1.addRules([zone_idro1]);
var styleMap_zone_idro1 = new OpenLayers.StyleMap({
	"default": style_zone_idro1
	, "temporary": new OpenLayers.Style({strokeWidth:4, fontSize: 15, fillOpacity: 1, cursor: "pointer"})
});
var zoneall3 = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_zone_idro1,
        //strategies: [new OpenLayers.Strategy.BBOX()],
        strategies: [new OpenLayers.Strategy.Fixed()],
	projection: OL_23032,
        protocol: new OpenLayers.Protocol.WFS({
	    url: url_tinyows, featureType: "zone_idrologiche_simplified",
	    featureNS: "http://www.tinyows.org/",
            readFormat: new OpenLayers.Format.GML({
                    'internalProjection': OL_23032,
		    'externalProjection': OL_23032
            })
	})
});
zoneall3.setVisibility(false);


/*BACINI*/
var style_bacini_tiny = new OpenLayers.Style();
var bacini_rule = new OpenLayers.Rule({
	title: "Bacini Piemonte",
	symbolizer: {strokeColor: "black", strokeWidth: 0.8, strokeOpacity: 0.5, fillColor: "#EDE2E2", fillOpacity: 0.3}
});
style_bacini_tiny.addRules([bacini_rule]);
var styleMap_bacini_tiny = new OpenLayers.StyleMap({
	"default": style_bacini_tiny
	, "temporary": new OpenLayers.Style({strokeWidth:4, strokeOpacity:1, fillOpacity: 1, cursor: "pointer"})
});
var bacini_tiny = new OpenLayers.Layer.Vector(default_layer_name, {
	styleMap: styleMap_bacini_tiny,
	strategies: [new OpenLayers.Strategy.Fixed()],
	projection: OL_32632,
	protocol: new OpenLayers.Protocol.WFS({
		url: url_tinyows, featureType: "bacinidefense",
		featureNS: "http://www.tinyows.org/",
		srsName: "epsg:32632",
		geometryName: "the_geom"
	})
});
bacini_tiny.setVisibility(false);
store_bacini_tiny = new GeoExt.data.FeatureStore({
	fields: [
		{name: "id_bacino", type: "integer"},
		{name: "nome", type: "string"},
		{name: "comune", type: "string"},
		{name: "prov", type: "string"},
		{name: "classe", type: "integer"},
		{name: "mesobacino", type: "string"},
		{name: "macrobacino", type: "string"},
		{name: "area", type: "float"},
		{name: "processo_principale", type: "string"},
		{name: "soglia1", type: "float"},
		{name: "soglia2", type: "float"},
		{name: "soglia3", type: "float"}
	],
	layer: bacini_tiny
});
//store_bacini.on('load', function(store){
//      store.sort('nome', 'ASC');
//});
var columns_bacini_tiny = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true
    },
	columns: [
		{header: "Id bacino", dataIndex: "id_bacino"},
		{header: "<b>Nome</b>", dataIndex: "nome", width: 180},
		{header: "Comune", dataIndex: "comune"},
		{header: "Provincia", dataIndex: "prov", align: "center"},
		{header: "Classe", dataIndex: "classe", align: "center"},
		{header: "Mesobacino", dataIndex: "mesobacino", align: "center"},
		{header: "Macrobacino", dataIndex: "macrobacino", align: "center"},
		{header: "Area [km2]", dataIndex: "area", decimalPrecision: 3, align: "center"},
		{header: "Processo principale", dataIndex: "processo_principale", align: "center"},
		{header: "Soglia di attenzione [mm]", dataIndex: "soglia1", align: "center"},
		{header: "Pre-soglia [mm]", dataIndex: "soglia2", align: "center"},
		{header: "Soglia d'innesco [mm]", dataIndex: "soglia3", align: "center"}
	]
});

	
/*RETE METEOIDRO*/
var style_meteoidro = new OpenLayers.Style({
        label: "${denominazione}\n\n${quota_int} m asl", labelAlign: "cm", fontWeight: "bold", fontFamily: "sans-serif"
        }, {
        rules: [
	new OpenLayers.Rule({
        title: "Meteorologica",
	filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: "meteo_tab", value: "Meteorologica"
        }),
	symbolizer: {graphicName: "square", fillColor: "#ee9900", fillOpacity: 0.5, strokeColor:"black", pointRadius: 4}
	}),
	new OpenLayers.Rule({
        title: "Idrometrica",
	filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: "meteo_tab", value: "Idrometrica"
        }),
	symbolizer: {graphicName: "triangle", fillColor: "#ee9900", fillOpacity: 0.5, strokeColor:"black", pointRadius: 5}
	}),
        new OpenLayers.Rule({
        title: "Idrometrica con portata",
        filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: "meteo_tab", value: "IdrometricaQ"
        }),
        symbolizer: {graphicName: "triangle", fillColor: "purple", fillOpacity: 0.5, strokeColor:"black", pointRadius: 5}
        }),
        new OpenLayers.Rule({
                title: "Nivometrica",
	filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: "meteo_tab", value: "Nivometrica"
        }),
	symbolizer: {graphicName: "circle", fillColor: "#ee9900", fillOpacity: 0.5, strokeColor:"black", pointRadius: 4}
        }),
	new OpenLayers.Rule({
                title: "Disattivate",
        filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.LIKE,
                property: "meteo_tab", value: "Z"
        }),
        symbolizer: {fillColor: "gray", fillOpacity: 0.5, strokeColor:"black", pointRadius: 4}
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
var styleMap_meteoidro = new OpenLayers.StyleMap({
	"default": style_meteoidro,
	"select": new OpenLayers.Style({pointRadius: 8, fillColor: "blue", fillOpacity: 0.8})
	,"temporary": new OpenLayers.Style({pointRadius: 8, fontSize: 13, cursor: "pointer"})
});
var rete_meteoidro = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_meteoidro,
        strategies: [new OpenLayers.Strategy.BBOX()
        ],
        protocol: new OpenLayers.Protocol.WFS({
            url: urlMS_datidibase,
            featureType: "rete_meteoidro",
            featureNS: "http://mapserver.gis.umn.edu/mapserver"
        })
});
var filter_meteoidro_not_lombardia = new OpenLayers.Filter.Logical({
	type: OpenLayers.Filter.Logical.NOT,
	filters: [
		new OpenLayers.Filter.Comparison({
		type: OpenLayers.Filter.Comparison.LIKE,
		property: "proprietario", value: "LOMBARDIA"
		})
	]
});
var filterStrategy_meteoidro = new OpenLayers.Strategy.Filter({filter: filter_meteoidro_not_lombardia});
var rete_meteoidro_not_lombardia = new OpenLayers.Layer.Vector(default_layer_name, {
	styleMap: styleMap_meteoidro,
	//minScale: 500000,
	strategies: [new OpenLayers.Strategy.BBOX()
	,filterStrategy_meteoidro
	//,new OpenLayers.Strategy.Refresh({force: true, interval:150000})
	],
	//projection: new OpenLayers.Projection("epsg:32632"),
	protocol: new OpenLayers.Protocol.WFS({
	    url: urlMS_datidibase,
	    //version: "1.1.0",
	    featureType: "rete_meteoidro",
	    featureNS: "http://mapserver.gis.umn.edu/mapserver"
	    //,geometry: "msGeometry", srsName: "epsg:23032"
	})		
});
var rete_meteoidro_tiny = new OpenLayers.Layer.Vector(default_layer_name, {
	styleMap: styleMap_meteoidro,
	strategies: [new OpenLayers.Strategy.Fixed()
	],
	projection: OL_23032,
	protocol: new OpenLayers.Protocol.WFS({
	    url: url_tinyows,
	    featureType: "rete_meteoidrografica",
	    featureNS: "http://www.tinyows.org/"
	    ,readFormat: new OpenLayers.Format.GML({
		'internalProjection': OL_23032,
		'externalProjection': OL_23032
	    })
	})
});
rete_meteoidro.setVisibility(false);
rete_meteoidro_not_lombardia.setVisibility(false);
store_meteoidro = new GeoExt.data.FeatureStore({
        fields: [
            {name: "codice_istat_comune", type: "string"},
            {name: "progr_punto_com", type: "integer"},
            {name: "codice_stazione", type: "string"},
            {name: "denominazione", type: "string"}
            ,{name: "utm_x", type: "integer"},
            {name: "utm_y", type: "integer"}
            ,{name: "quota_stazione", type: "float"}
        ],
        layer: rete_meteoidro
	,autoLoad: true
});
//store_meteoidro.load();
store_meteoidro.on('load', function(store){
    store.sort('denominazione', 'ASC');
    //combo.setDisabled(true);
});
var columns_meteoidro = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true
    },
        columns: [
                {header: "Denominazione", dataIndex: "denominazione", align: "center", width: 200},
                {header: "Codice stazione", dataIndex: "codice_stazione"}
		,{header: "Codice_istat_comune", dataIndex: "codice_istat_comune"},
                {header: "Progr_punto_com", dataIndex: "progr_punto_com"},
                {header: "Utm X [m]", dataIndex: "utm_x"},
                {header: "Utm Y [m]", dataIndex: "utm_y"},
                {header: "Quota [m]", dataIndex: "quota_stazione"}
        ]
});
//rete_meteoidro_tiny.setVisibility(false); //ma questo layer lo usa qualche progetto?


/*BACINI IDROGRAFICI*/
var style_bacini_idro = new OpenLayers.Style({
        strokeColor: "black", strokeWidth: 0.4, strokeOpacity: 0.5, fillOpacity: 0.3, fillColor: "gray"
	,title: "${nome}"
        //label: "${denominazi}", labelAlign: "ct", fontWeight: "bold", fontFamily: "sans-serif", labelYOffset: -10
        }, {
        rules: [
        new OpenLayers.Rule({
                title: "bacini di testata",
		maxScaleDenominator: 250000,
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ordine", value: 99
                })
                //,symbolizer: {strokeWidth:0.5, fillColor: "#00bb78"}
        }),
        new OpenLayers.Rule({
                title: "ordine 8",
		maxScaleDenominator: 500000,
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ordine", value: 8
                })
                //,symbolizer: {strokeWidth:0.5, fillColor: "#00bb78"}
        }),
	new OpenLayers.Rule({
                title: "ordine 7",
                maxScaleDenominator: 500000,
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ordine", value: 7
                })
                //,symbolizer: {strokeWidth:0.5, fillColor: "#00bb78"}
        }),
	new OpenLayers.Rule({
                title: "ordine 6",
                minScaleDenominator: 250000,
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ordine", value: 6
                })
                //,symbolizer: {strokeWidth:0.5, fillColor: "#00bb78"}
        }),
	new OpenLayers.Rule({
                title: "ordine 5",
                minScaleDenominator: 250000,
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ordine", value: 5
                })
                //,symbolizer: {strokeWidth:0.5, fillColor: "#00bb78"}
        }),
	new OpenLayers.Rule({
                title: "ordine 4",
                minScaleDenominator: 500000,
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ordine", value: 4
                })
                //,symbolizer: {strokeWidth:0.5, fillColor: "#00bb78"}
        }),
	new OpenLayers.Rule({
                title: "ordine 3",
                //minScaleDenominator: 500000, //questi li faccio vedere sempre
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ordine", value: 3
                })
                //,symbolizer: {strokeWidth:0.5, fillColor: "#00bb78"}
        })
	,new OpenLayers.Rule({
                title: "ordine 00",
                filter: new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.EQUAL_TO,
                        property: "ordine", value: 0
                })
        })
]});
var styleMap_bacini_idro = new OpenLayers.StyleMap({
    "default": style_bacini_idro
    , "temporary": new OpenLayers.Style({strokeWidth:4, strokeOpacity:1, fillColor:"blue", strokeColor:"orange"})
});
var filter_bacini_idro = new OpenLayers.Filter.Comparison({
    type: OpenLayers.Filter.Comparison.EQUAL_TO,
    property: "display", value: 'true'
});
var filterStrategy_bacini_idro = new OpenLayers.Strategy.Filter({filter: filter_bacini_idro});
var bacini_idro = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_bacini_idro,
        strategies: [new OpenLayers.Strategy.BBOX()
	//, filterStrategy_bacini_idro
        ],
        projection: OL_32632,
        protocol: new OpenLayers.Protocol.WFS({
                url: url_tinyows, featureType: "bacini_idrografici_simplified",
                featureNS: "http://www.tinyows.org/",
	        srsName: "epsg:32632", geometryName: "the_geom"
        })
});
bacini_idro.setVisibility(false);


/* AEROPORTI NAZIONALI */
var style_aeroporti = new OpenLayers.Style({
        fillColor: "#ffcc66", strokeColor: "#ff9933", strokeWidth: 2
        ,label: "${id}", labelYOffset: -3
        ,fontColor: 'white', fontWeight: "bold", fontFamily: "monospace"
        ,externalGraphic: root_dir_html+"/common/icons/aeroporti.svg", graphicWidth: 60, graphicOpacity:0.8
/*, labelOutlineColor: "white", labelOutlineWidth: 0, labelYOffset: 15, graphicHeight: 15, graphicYOffset: -18*/
	}, {
        rules: [
        new OpenLayers.Rule({
		title: " ",
                minScaleDenominator: 450000,
                symbolizer: {fontSize: "0px", graphicWidth: 25}
        }),
        new OpenLayers.Rule({
                title: " ",
                maxScaleDenominator: 450000,
                symbolizer: { fontSize: "12px" }
        })
]}
);
var styleMap_aeroporti = new OpenLayers.StyleMap({
	"default": style_aeroporti
	,"temporary": new OpenLayers.Style({graphicWidth: 70, fontSize: 14, cursor: "pointer"})
});
var aeroporti = new OpenLayers.Layer.Vector(default_layer_name, {
        styleMap: styleMap_aeroporti,
        strategies: [new OpenLayers.Strategy.Fixed()
        ],
        projection: OL_23032,
        protocol: new OpenLayers.Protocol.WFS({
                url: url_tinyows,
                featureType: "aeroporti_nazionali", //nuova logica ultimo dato da meteo_real_time
                featureNS: "http://www.tinyows.org/"
                ,readFormat: new OpenLayers.Format.GML({
                        'internalProjection': OL_23032,
                        'externalProjection': OL_23032
                })
        })
});
aeroporti.setVisibility(false);

