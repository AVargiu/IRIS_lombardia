
var map,
    mapPanel,
    viewport
	,app;

var gg = new OpenLayers.Projection("EPSG:4326");
var sm = new OpenLayers.Projection("EPSG:900913");

function load_map() {


Ext.setup({
    onReady: function(){
        //alert('Replace this alert with actual code.');


// create a layer
var ol_wms = new OpenLayers.Layer.WMS(
    "OpenLayers WMS", 
    "http://vmap0.tiles.osgeo.org/wms/vmap0", 
    {
        layers: "basic"
    },
    {
        attribution: 'Metacarta WMS hosted on <a href="http://www.osgeo.org/" target="_blank">osgeo.org<a>'
    }
);

var osmLayer = new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize'
});


//Try add WFS:
var urlMS_sismi = "/cgi-bin/mapserv?MAP=/var/www/html/webgis/meteo/sismi.map";
//var urlMS_sismi = "/cgi-bin/mapserv.exe?MAP=C:/Program Files/OSGeo/MapGuide/Web/www/meteo/sismi_wfs.map";
var sismi = new OpenLayers.Layer.Vector("Sismicita' strumentale - ultimi 15 giorni", {
        //styleMap: styleMap_sismi,
        //strategies: [new OpenLayers.Strategy.BBOX()],
        strategies: [new OpenLayers.Strategy.Fixed()
                //,new OpenLayers.Strategy.Refresh({force: true, interval:300000})
                //,filterStrategy
        ],
        protocol: new OpenLayers.Protocol.WFS({
                url: urlMS_sismi,
                //version: "1.1.0",
                featureType: "sism_last15",
                featureNS: "http://mapserver.gis.umn.edu/mapserver"
                //extractAttributes: true, extractStyles: true,
                //,geometry: "msGeometry", srsName: "epsg:32632"
        })
});



var selectControl = new OpenLayers.Control.SelectFeature(sismi, {
    autoActivate:true
    //,onSelect: onSelectFeatureFunction
});
var geolocate = new OpenLayers.Control.Geolocate({
    id: 'locate-control',
    geolocationOptions: {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: 7000
    }
});


// create a map
map = new OpenLayers.Map({
	div: "map",
	theme: null,
	projection: sm,
    numZoomLevels: 18,
    controls: [
        new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
        new OpenLayers.Control.Attribution()
		//,new OpenLayers.Control.Zoom() //per i tasti ZoomIn e ZoomOut da mobile
		,geolocate
        ,selectControl
    ]
	,layers: [osmLayer]
	,center: new OpenLayers.LonLat(920000, 5650000)
    ,zoom: 8
});

// add the layer to the map
/*CARICO i layer provenienti dagli altri javascript:
        for (i=0; i<layers_to_load.length; i++) {
	        map.addLayer(layers_to_load[i]);
}
*/
map.addLayers([sismi]);

//GeoLocate: a cosa serve?
var style = {
    fillOpacity: 0.1,
    fillColor: '#000',
    strokeColor: '#f00',
    strokeOpacity: 0.6
};
var vector = new OpenLayers.Layer.Vector("Vector Layer", {});
geolocate.events.register("locationupdated", this, function(e) {
    vector.removeAllFeatures();
    vector.addFeatures([
        new OpenLayers.Feature.Vector(
            e.point,
            {},
            {
                graphicName: 'cross',
                strokeColor: '#f00',
                strokeWidth: 2,
                fillOpacity: 0,
                pointRadius: 10
            }
        ),
        new OpenLayers.Feature.Vector(
            OpenLayers.Geometry.Polygon.createRegularPolygon(
                new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                e.position.coords.accuracy / 2,
                50,
                0
            ),
            {},
            style
        )
    ]);
    map.zoomToExtent(vector.getDataExtent());
});

}
});

} //fine funzione di prova load_map




