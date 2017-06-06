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

/////////////////////// ADD RASTER LAYER /////////////////////
	
//Creo questa variabile per permettere il refresh delle immagini:
var d = new Date();

var raster_options = {isBaseLayer: false, opacity: 0.6//, alwaysInRange: true
, buffer: 0 //dovrebbe servire a non tenere in cache le immagini
,alwaysInRange:true, transparent: true, visibility: true
//numZoomLevels: 3
//,attribution:"<p id='localtime' style='font-weight:bold'>"+d.today() + " " + d.timeNow() + "</p>"
};

var size = new OpenLayers.Size(680, 653);
var size2 = new OpenLayers.Size(1543, 1483);
var size3 = new OpenLayers.Size(515, 506);
var size4 = new OpenLayers.Size(528, 517);

var bounds1 = new OpenLayers.Bounds(313624.231, 4942116.099, 1500503.305, 6081869.092); //dal tiff in 900913
var bounds2 = new OpenLayers.Bounds(673811.859, 5310564.071, 1254923.782, 5881520.640); //coord dal tiff gia' in 900913
var bounds2a = new OpenLayers.Bounds(702363.967, 5311713.301, 1298612.054, 5895539.553); //coord dal tiff gia' in 900913
var bounds3 = new OpenLayers.Bounds(499556.8, 4094696, 2662618, 6152957); //dal tiff in 900913
//Per il radar in BANDA X:
var size_x = new OpenLayers.Size(527, 523); //size del png o del tiff..?
var bounds4 = new OpenLayers.Bounds(925072, 5616802, 1097090, 5791007); //a mano..
//Per il mosaico OPERA - radar europei:
var bounds5 = new OpenLayers.Bounds(-4401103.612, 3728784.563, 6436458.971,12486167.779);
var size5 = new OpenLayers.Size(3152, 2547);
//Per cloudmask MSG:
var bounds10 = new OpenLayers.Bounds(313624.231, 4942465.181, 1502178.899, 6081869.092);
var size10 = new OpenLayers.Size(255, 266);

//Per snowcover IMS:
//var bounds11 = new OpenLayers.Bounds(313624.231, 4942465.181, 1502178.899, 6081869.092);
var bounds11 = new OpenLayers.Bounds(596067.998, 5124377.804, 1932542.348, 6326810.479);
var size11 = new OpenLayers.Size(1017, 915);

//Per le immagini di monitoraggio NIVO:
url_raster_nivo = root_dir_html+"/common/DATA/nivo/";
var bounds9 = new OpenLayers.Bounds(724108.892, 5424880.111, 1055101.249, 5885144.160);
var size9 = new OpenLayers.Size(324, 233);

var nevefresca3g = new OpenLayers.Layer.Image(default_layer_name,
        url_raster_nivo + "piemonte_kriging_Hn_3gg3875.png?rand="+d.getTime(),
        bounds9, size9,
        {isBaseLayer: false, alwaysInRange: true, opacity: 1}
);
nevefresca3g.setVisibility(false);
nevefresca3g.redraw(true);

var nevefresca = new OpenLayers.Layer.Image(default_layer_name,
        url_raster_nivo + "piemonte_kriging_Hn3875.png?rand="+d.getTime(),
        bounds9, size9,
        {isBaseLayer: false, alwaysInRange: true, opacity: 1}
);
nevefresca.setVisibility(false);
nevefresca.redraw(true);

var nevesuolo = new OpenLayers.Layer.Image(default_layer_name,
        url_raster_nivo + "piemonte_kriging_Hs3875.png?rand="+d.getTime(),
        bounds9, size9,
        {isBaseLayer: false, alwaysInRange: true, opacity: 1}
);
nevesuolo.setVisibility(false);
nevesuolo.redraw(true);

var snowcover = new OpenLayers.Layer.Image(default_layer_name,
        url_raster_nivo + "ims_snowcover_google.png?rand="+d.getTime(),
        bounds11, size11,
        {isBaseLayer: false, alwaysInRange: true, opacity: 1}
);
snowcover.setVisibility(false);
snowcover.redraw(true);


//Per le immagini di monitoraggio IDRO:
url_raster_idro = root_dir_html+"/common/DATA/idro/PLUV/";
//var bounds6 = new OpenLayers.Bounds(608479.980, 5447311.177, 1150451.816, 5903933.118);
////var size6 = new OpenLayers.Size(381, 321);
var bounds6 = new OpenLayers.Bounds(724218.546, 5425153.041, 1055223.810, 5885435.039);
var size6 = new OpenLayers.Size(324, 233);

var idro24 = new OpenLayers.Layer.Image(default_layer_name,
        url_raster_idro + "PLUV_ultime_24ore3785.png?rand="+d.getTime(),
        bounds6, size6,
	{isBaseLayer: false, alwaysInRange: true, opacity: 1}
);
idro24.setVisibility(false);
idro24.redraw(true);

var idro12 = new OpenLayers.Layer.Image(default_layer_name,
        url_raster_idro + "PLUV_ultime_12ore3785.png?rand="+d.getTime(),
        bounds6, size6,
        {isBaseLayer: false, alwaysInRange: true, opacity: 1}
);
idro12.setVisibility(false);
idro12.redraw(true);

var idro6 = new OpenLayers.Layer.Image(default_layer_name,
        url_raster_idro + "PLUV_ultime_6ore3785.png?rand="+d.getTime(),
        bounds6, size6,
        {isBaseLayer: false, alwaysInRange: true, opacity: 1}
);
idro6.setVisibility(false);
idro6.redraw(true);

var idro3 = new OpenLayers.Layer.Image(default_layer_name,
        url_raster_idro + "PLUV_ultime_3ore3785.png?rand="+d.getTime(),
        bounds6, size6,
        {isBaseLayer: false, alwaysInRange: true, opacity: 1}
);
idro3.setVisibility(false);
idro3.redraw(true);

var idro1 = new OpenLayers.Layer.Image(default_layer_name,
        url_raster_idro + "PLUV_ultima_ora3785.png?rand="+d.getTime(),
        bounds6, size6,
        {isBaseLayer: false, alwaysInRange: true, opacity: 1}
);
idro1.setVisibility(false);
idro1.redraw(true);


//Per le immagini delle previsioni da MODELLI:
var url_raster_modelli = root_dir_html+"/common/DATA/modelli/";
var size_modelli = new OpenLayers.Size(793, 859);
var bounds_modelli = new OpenLayers.Bounds(-1391.494, 4027464.792, 2560322.665, 6802385.930); //dal tiff in 900913
var modelli = new OpenLayers.Layer.Image(default_layer_name,
        url_raster_modelli + "COSMOI2_2014030400_021_EPSG3857.png?rand="+d.getTime(),
        bounds_modelli, size_modelli,
        {isBaseLayer: false, alwaysInRange: true, opacity: 1}
);
modelli.setVisibility(false);
modelli.redraw(true);


//Per le immagini di monitoraggio RADAR:
var url_raster = root_dir_html+"/common/DATA/raster/";
var mosaico = new OpenLayers.Layer.Image(default_layer_name,
	//"http://10.127.141.100/radar/imgs/googlemaps/googlemap_composite.png?rand="+d.getTime(),
	url_raster + "googlemap_composite.png?rand="+d.getTime(),
	bounds1, size, raster_options
);
mosaico.setVisibility(false);
mosaico.redraw(true);

var istantaneo = new OpenLayers.Layer.Image(default_layer_name,
	url_raster + "googlemap_ist.png?rand="+d.getTime(),
	bounds2, size3, raster_options
);
istantaneo.setVisibility(false);
istantaneo.redraw(true);

var istantaneo_bis = new OpenLayers.Layer.Image(default_layer_name,
	url_raster + "googlemap_ist_bis.png?rand="+d.getTime(),
	bounds2a, size4, raster_options
);
istantaneo_bis.setVisibility(false);
istantaneo_bis.redraw(true);

lon=9.081282;
lat=45.52283;
var bandax_centroid = new OpenLayers.LonLat(lon, lat);
bandax_centroid = bandax_centroid.transform(OL_4326, OL_900913);
utmx_min = bandax_centroid.lon-60000;
utmx_max = bandax_centroid.lon+60000;
utmy_min = bandax_centroid.lat-60000;
utmy_max = bandax_centroid.lat+60000;
var boundsx_test = new OpenLayers.Bounds(utmx_min,utmy_min, utmx_max,utmy_max); //TEST
var sizex_test = new OpenLayers.Size(2048, 2048);
var bandax_test = new OpenLayers.Layer.Image(default_layer_name,
	url_raster + "bandax_polar_512.png?rand="+d.getTime(),
        boundsx_test, sizex_test, raster_options
);
bandax_test.setVisibility(false);
bandax_test.redraw(true);

var bandax = new OpenLayers.Layer.Image(default_layer_name,
        url_raster + "xband.png?rand="+d.getTime(),
        bounds4, size_x, raster_options
);
bandax.setVisibility(false);
bandax.redraw(true);

var rain1h = new OpenLayers.Layer.Image(default_layer_name,
	url_raster + "googlemap_01h.png?rand="+d.getTime(),
	bounds2, size3, raster_options
);
rain1h.setVisibility(false);
rain1h.redraw(true);

var dpc = new OpenLayers.Layer.Image(default_layer_name,
	url_raster + "googlemap_dpc_ist.png?rand="+d.getTime(),
	bounds3, size2, raster_options
);
dpc.setVisibility(false);
dpc.redraw(true);

