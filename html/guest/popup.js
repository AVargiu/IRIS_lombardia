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

///////////////////// POPUP INFO /////////////////////
//DA DB

//Esempi di altre funzioni popup attivabili comunque via DB:
/*
  	bacini_idro.events.on({
            featureselected: function(e) {createPopup(e, html_feature, title_pop);}
        });
	ellipse.events.on({
        featureselected: function(e) {
            var uri = root_dir_html+"/cgi-bin/storm_db.py?id="+e.feature.attributes.id;
            var pop_name = 'temporali';
            var pop_options = 'location=0,width=500,height=800,toolbar=0,resizable=0,left=100,top=100';
            open_popup(uri, pop_name, pop_options, e.feature);
        }
        });
	idrometri_bis_tiny.events.on({
            featureselected: function(e) {grafici_rete(e.feature.attributes, 'idrometri_bis', 'PORTATA_BIS', e.feature);}
        });
	rete_atlpiogge.events.on({
            featureselected: function(e) {
	        //Aggiungo la eventualita che si tratti di un cluster:
	        var elemento = e.feature;
                if (elemento.cluster) { //se ho selezionato un cluster
		    valore_dict = new Array(); //creo un array
	            for (var i = 0; i < elemento.cluster.length; i++) {
			//chiave = elemento.cluster[i].attributes.id;
			valore_dict.push({
				max1: elemento.cluster[i].attributes.max1ora,
				istat: elemento.cluster[i].attributes.codice_istat_comune,
				prog: elemento.cluster[i].attributes.progr_punto_com,
				name: elemento.cluster[i].attributes.denominazione,
				quota: elemento.cluster[i].attributes.quota_stazione,
				max3: elemento.cluster[i].attributes.max3ore,
				max6: elemento.cluster[i].attributes.max6ore,
				max12: elemento.cluster[i].attributes.max12ore,
				max24: elemento.cluster[i].attributes.max24ore,
				time_agg: elemento.cluster[i].attributes.time_agg
			});
                	//valore_dict[chiave] = elemento.cluster[i].attributes.max1ora;
        	    }
		    var sorted = valore_dict.sort(function(a, b) {
			return b.max1 - a.max1; //reverse order
		    });
		    //console.log(sorted);
	            var uri = root_dir_html+"/common/scripts/plot_atl_piogge.php?root_dir_html="+root_dir_html+"&codice_istat="+sorted[0].istat+"&progr_punto="+sorted[0].prog+"&denominazione="+encodeURIComponent(sorted[0].name)+"&quota="+sorted[0].quota+"&time_agg="+sorted[0].time_agg+"&rete_prec=60,"+sorted[0].max1+"@@180,"+sorted[0].max3+"@@360,"+sorted[0].max6+"@@720,"+sorted[0].max12+"@@1440,"+sorted[0].max24;
                }
		else {
		    var uri = root_dir_html+"/common/scripts/plot_atl_piogge.php?root_dir_html="+root_dir_html+"&codice_istat="+e.feature.attributes.codice_istat_comune+"&progr_punto="+e.feature.attributes.progr_punto_com+"&denominazione="+e.feature.attributes.denominazione+"&quota="+e.feature.attributes.quota_stazione+"&rete_prec=60,"+e.feature.attributes.max1ora+"@@180,"+e.feature.attributes.max3ore+"@@360,"+e.feature.attributes.max6ore+"@@720,"+e.feature.attributes.max12ore+"@@1440,"+e.feature.attributes.max24ore;
		}
	        var encoded_uri = encodeURI(uri);
                var win_atlgraph = window.open(encoded_uri, 'atl_piogge', 'location=0,width=850,height=450,toolbar=0,resizable=1,left=100,top=100');
		popup_unselect_feature(win_atlgraph, e.feature);
            }
        });
*/

function createPopup(evt, html_feature="", title_pop="") {

	var feature = evt.feature;
	//var html_feature; //definizione contenuto della popup

	//Esempi di createPopup semplici risolvibili da DB:
	/*
	if (feature.layer.name==temporali02) {html_feature = "Data: " + feature.attributes.data + "<br/>" + "Ora UTC: " + feature.attributes.ora + "<br/>" + "Tipo: " + feature.attributes.tipo + "<br/>" + "Corrente (kA): " + feature.attributes.valore;
	title_pop = feature.layer.name;
}
	
	else if (feature.layer.name==base11) {html_feature = feature.attributes.denominazi;
		title_pop = feature.attributes.cod_hydro;
	}
	*/

	//Le azioni createPopup piu' complesse le lascio comunque al codice
	if (typeof idro05 !== 'undefined') { 
	if (feature.layer.name==idro05) {
	//title_pop = "Bacino";
//Qui applico la funzione CAROTAGGIO cioe' buco tutti gli elementi del layer e li tiro fuori:
    //console.log(evt);
	var feat_id_selected = evt.feature.fid; //del tipo bacini_idrografici.69
    //console.log(evt.object.map.projection);
        result = [];
	//Compilo i dati col bacino selezionato, poi mettero' in coda gli altri:
	result.push(['<b>ordine ', feature.data.ordine, ': ' + feature.data.nome.toLowerCase().replace(/\d+|^\s+|\s+$|_|\./g, '')+ '</b><br/>' ]);
	//html_feature = '<b>ordine ' + feature.data.ordine + ': ' + feature.data.nome.toLowerCase().replace(/\d+|^\s+|\s+$|_|\./g, '') + '</b><br/>';
	//var lon_rast = evt.object.map.layerContainerOrigin.lon; //poco ma sicuro non sono le coordinate del punto cliccato!
	//Recupero allora le coordinate del click dal SelectControl:
	var pixel = selectCtrl.handlers.feature.evt.xy;
	var ll = map.getLonLatFromPixel(pixel);
	//bacini_idro.features.sort(function(a, b){return a.fid-b.fid});
    //console.log(bacini_idro.features);
	var lon_rast = ll.lon;
	var lat_rast = ll.lat;
	var marker_point = new OpenLayers.Geometry.Point(lon_rast, lat_rast);
	    for (var i=0; i<bacini_idro.features.length; i+=1) {
	        if (bacini_idro.features[i].geometry.intersects(marker_point) && bacini_idro.features[i].data.ordine<feature.data.ordine ) {
		    if (bacini_idro.features[i].fid != feat_id_selected) { //se la feature e' quella selezionata la salto
		    result.push(['ordine ', bacini_idro.features[i].data.ordine, ': ' + bacini_idro.features[i].data.nome.toLowerCase().replace(/\d+|^\s+|\s+$|_|\./g, '')+ '<br/>' ]);
		    //bacini_idro.features[i].renderIntent = "temporary";
		    //html_feature += 'ordine ' + bacini_idro.features[i].data.ordine + ': ' + bacini_idro.features[i].data.nome.toLowerCase().replace(/\d+|^\s+|\s+$|_|\./g, '') + '<br/>';
		    //console.log(bacini_idro.features[i].data.nome);
		    } //fine dell'if che esclude la feature selezionata
		}
	    } //fine del FOR tra gli elementi del layer
	//result.sort(function(a, b) {return a[1] - b[1]}); //ASC
	result.sort(function(a, b) {return b[1] - a[1]}); //DESC
	html_feature = result.map(function(elem){ return elem[0] + ' ' + elem[1] + ' ' + elem[2]; }).join(" ");
	}
	} //fine controllo esistenza variabile nome_layer


	// create the popup if it doesn't exist:
	if (!popup) {
		popup = new GeoExt.Popup({
			title: title_pop, feature: feature, width: 210, location: feature,
			opacity: 0.6, //non funziona...
			maximizable: true, collapsible: true, map: mapPanel.map,
			anchored: false, //a cosa serve?come non farmi coprire il punto dalla popup??
			//cmq ho dovuto mettere anchored=false per il reverse proxy, geoext non trovava l'immagine
			listeners: {
				close: function() {
					// closing a popup destroys it, but our reference is truthy
					popup = null;
				}
			},
			html: html_feature
			//html: feature.attributes.NOME_REG + "<br/>" + feature.attributes.COD_REG
		});
		//unselect feature when the popup is closed:
		popup.on({
			close: function() {
				if(OpenLayers.Util.indexOf(feature.layer.selectedFeatures,this.feature) > -1) {
					selectCtrl.unselect(this.feature);
				}
			}
		});
		popup.show();
	}
		
	else if (popup) {
		popup.close();
		popup = new GeoExt.Popup({
			title: title_pop, feature: feature, width: 200, location: feature,
			maximizable: true, collapsible: true, map: mapPanel.map, anchored: true,
			listeners: {
				close: function() {
					// closing a popup destroys it, but our reference is truthy
					popup = null;
				}
			},
			html: html_feature
		});
		// unselect feature when the popup is closed.
		popup.on({
			close: function() {
				if(OpenLayers.Util.indexOf(feature.layer.selectedFeatures,this.feature) > -1) {
				selectCtrl.unselect(this.feature);
				}
			}
		});
		popup.show();
	}

} //Fine della funzione createPopup

