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


//Le opzioni di visualizzazione edlle righe della griglia modificale sotto geoext_generale_produzione.js!
view_grid = {
        forceFit: true,
        //showPreview: true,
        //enableRowBody: true,
        scrollOffset: 0,
        getRowClass: function(record, rowIndex, rp, ds){
                var rowClass = '';
                if (record.get('valore') > 2){
                        rowClass = 'red_grid_row';
                }
                return rowClass;
}};

legend = new GeoExt.LegendPanel({
        //items : new GeoExt.LegendImage({fieldLabel: 'prova', id: 'imgPreview', url: root_dir_html+'/common/legends/'+legend_var+'.gif'}),
	items : new GeoExt.LegendImage({fieldLabel: 'prova', id: 'imgPreview'}),
        region: "south", title: "Legend", autoScroll: true//, layerStore: mapPanel.layers
	,xtype: "gx_legendpanel"
	,defaults: {
        //style: 'padding:5px',
        baseParams: {
            FORMAT: 'image/png',
            LEGEND_OPTIONS: 'forceLabels:on'
        }
	//,legendTitle: 'prova' //nome da mettere al posto del layer
	,untitledPrefix: null //prefisso da usare per quei layer senza title cosi evito il fastidioso "Untitled"!
	}
        //renderTo: "legend", //height: Math.round(height_map*0.4), //width: Math.round(width_map*0.20),
        //layers: mapPanel.layers
});

