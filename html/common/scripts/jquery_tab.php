<?php
/*
Questo script genera una finestra composta da delle schede TAB di JQuery.
Per far questo prende tramite URL:
-i titles dei TAB
-l'url per il contenuto dei TAB (solitamente delle immagini)

Esempio di stringa da chiamare:
http://remotesensing.arpa.piemonte.it/common/scripts/jquery_tab.php?titles=Temperatura,Pioggia,Vento&links=webgis.arpa.piemonte.it/grafici/TERMAIGRO/TERMA122.png,webgis.arpa.piemonte.it/grafici/PLUV/PLUV122.png,webgis.arpa.piemonte.it/grafici/VELVDIRV/VELV122.png
*/

//Creo una "diversione" dello script nel caso in cui le variabili da passare per comporre
//i vari TAB siano piu' complesse, ad esempio per la creazione dei nuovi plot con Highcharts:
$tipo_tab = 0;
$active_tab=0; //variabile per specificare il numero del TAB da attivare da subito - DA SVILUPPARE!!!
if(isset($_GET['tipo_tab'])){
        $tipo_tab = $_GET['tipo_tab'];
}
if($tipo_tab == 1) {
	//Plot per i dati alle stazioni meteo:
	$codice_istat = $_GET['codice_istat'];
	$progr_punto = $_GET['progr_punto'];
	$parametri = $_GET['parametri'];
	$parametri_array = explode(",", $parametri);
	if(isset($_GET['active_tab'])){
        	$active_tab_str = $_GET['active_tab'];
	}
}
if (isset($_GET['root_dir_html'])) $root_dir_html = $_GET['root_dir_html'];
$links = htmlspecialchars($_GET["links"]);
$links_array = explode(",", $links);
$n_links = sizeof($links_array);
$titles = htmlspecialchars($_GET["titles"]);
$titles_array = explode(",", $titles);
$n_titles = sizeof($titles_array);
$tab_title = "<ul>";
$tab_content = "";
$i = 0;
//In certi casi e' venuta fuori l'esigenza di modificare l'altezza del grafico:
if (isset($_GET['custom_height'])) $custom_height = $_GET['custom_height'];
else $custom_height = 450;

//Generazione TAB con url complesse:
if($tipo_tab == 1) {
foreach ($parametri_array as $parametro) {
	//$tab_content .= "<div id='tabs-" . $i . "'><iframe width='100%' height=450px src='" . $links . "?codice_istat=" . $codice_istat . "&progr_punto_com=" . $progr_punto . "&id_parametro=" . $parametro . "' frameborder='0' allowtransparency='true' seamless='seamless'></iframe>";
	//Cerco di evitare di caricare tutti i grafici contemporaneamente. Carico il primo e poi gli altri quando vengono cliccati i TAB:
	if($i==0) $tab_content .= "<div id='tabs-" . $i . "'><iframe id='myIFrame". $i . "' width='100%' height=".$custom_height." src='" . $links . "?codice_istat=" . $codice_istat . "&progr_punto_com=" . $progr_punto . "&id_parametro=" . $parametro . "&root_dir_html=" . $root_dir_html ."' frameborder='0' allowtransparency='true' seamless='seamless'></iframe>";
	else $tab_content .= "<div id='tabs-" . $i . "'><iframe id='myIFrame". $i . "' width='100%' height=".$custom_height." src='' frameborder='0' allowtransparency='true' seamless='seamless'></iframe>";
        $tab_content .= "</div>";
	$tab_title .= "<li><a href='#tabs-" . $i . "'>" . $titles_array[$i] . "</a></li>";
	//Se la variabile active_tab_str e' definita la cerco tra i parametri e ne recupero l'indice per attivare dfa subito il TAB relativo:
	if($active_tab_str and $active_tab_str==$parametro) {
	    $active_tab=$i;
	}
	$i++;
} //fine di ciclare dentro i parametri

}

else {
//Generazione TAB con url semplici - immagini:
foreach ($links_array as $link) {
	$tab_content .= "<div id='tabs-" . $i . "'><img src='" . $link . "' /></div>";
	if ($n_links != $n_titles) {
		$slash_position = strrpos($link, '/');
		$tab_title .= "<li><a href='#tabs-" . $i . "'>" . substr($link, $slash_position+1) . "</a></li>";
	}
	else $tab_title .= "<li><a href='#tabs-" . $i . "'>" . $titles_array[$i] . "</a></li>";
	$i++;
} //fine di ciclare dentro i vari links
}

$tab_title .= "</ul>";

//print gettype($links_array);

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>

<head>
<title>Dati stazione</title>

<?php
$jquery_css = '<link rel="stylesheet" href="'.$root_dir_html.'/jQuery/jquery-ui.css">';
echo $jquery_css;

$script_js1st = '<script type="text/javascript" src="'.$root_dir_html.'/jQuery/jquery-1.10.2.js"></script>';
$script_js1st .= '<script type="text/javascript" src="'.$root_dir_html.'/jQuery/jquery-ui.js"></script>';
echo $script_js1st;
?>

<script>

var active_tab = <?php echo $active_tab; ?>;

$(function() {
	$("#tabs").tabs(
	{select: function(event, ui){
            var tabNumber = ui.index;
            var tabName = $(ui.tab).text();

            console.log('Tab number ' + tabNumber + ' - ' + tabName + ' - clicked');
        }
	});
});

//Adesso facciamo in modo che quando un determinato TAB viene selezionato si carica il plot relativo:
var activated_tab_index = new Array();//provo a tenere traccia dei TAB gia' caricati per non ricaricarli
if (active_tab==null || active_tab=='') activated_tab_index.push(active_tab); //se non specifico il tab da attivare, salva il tab di default nei tab gia caricati
$(document).ready(function() {
    // Tab initialization
    $('#tabs').tabs({
        activate: function(event, ui){
            var tabNumber = ui.newTab.index();
            var tabName = $(ui.newTab).text();
	    if (jQuery.inArray( tabNumber, activated_tab_index )==-1) { //se il tab e' gia' stato caricato non lo ricarico
            //console.log('Tab number ' + tabNumber + ' - ' + tabName + ' - clicked');
		var id_parametro_js = <?php echo json_encode($parametri_array); ?>;
		var new_src = "<?php echo $links; ?>?codice_istat=<?php echo $codice_istat; ?>&progr_punto_com=<?php echo $progr_punto;?>&id_parametro=" + id_parametro_js[tabNumber] + "&root_dir_html=<?php echo $root_dir_html; ?>";
		$('#myIFrame'+tabNumber).attr('src', new_src);
		activated_tab_index.push(tabNumber);
	    }
        }
    });

//Per attivare uno specifico TAB o dal numero o dal suo ID. Di default e' ZERO:
//$('#tabs').tabs("option", "active", '#tabs-1'); //tramite ID
$('#tabs').tabs("option", "active", active_tab); //tramite numero

});


</script>

<style type="text/css">
/*Volevo cercare di risolvere il problema dei TAB su Mozilla ma non riesco a capire...*/
/*
p, table {font-size: 0.75em;}
#tab_generale {font-size: 0.85em;}
body {font-family: Verdana,Arial,sans-serif;}
#generale {height:21%;}
#tabs {width:100%;height:80%;}
.ui-widget-content {border:none;}
*/
/*#tabs-1, #tabs-2 {overflow-y:scroll; height:98%;}*/
/*Aggiungo una modifica per Mozilla perche' non fa vedere la scroll bar in quanto vuole i "px" e non le "%":*/
/*Fonte: http://perishablepress.com/css-hacks-for-different-versions-of-firefox/ */
@-moz-document url-prefix() { #tabs-1, #tabs-2 {overflow-y:scroll; height:500px;} }
</style>

</head>

<body>

<div class='tabs' id="tabs">

<?php
print $tab_title;
print $tab_content;
?>

</div>

</body>

</html>

