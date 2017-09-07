/*BACINI*/
var style_bacini_tiny = new OpenLayers.Style();
var bacini_rule = new OpenLayers.Rule({
	title: "Bacini Lombardia",
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
		url: url_tinyows, featureType: "bacini",
		featureNS: "http://www.tinyows.org/",
		srsName: "epsg:3003",
		geometryName: "the_geom"
	})
});
bacini_tiny.setVisibility(false);
store_bacini_tiny = new GeoExt.data.FeatureStore({
	fields: [
		{name: "id", type: "integer"},
		{name: "bacini_agg", type: "string"},
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
		{header: "Id bacino", dataIndex: "id"},
		{header: "<b>Nome</b>", dataIndex: "bacini_agg", width: 180},
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
