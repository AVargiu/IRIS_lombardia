<?php
/*
Script pensato per essere generico, in realta' al momento non serve richiamarlo.
Doveva fare da ponte tra gli script javascript per la genrazione dei grafici e il DB.
Ma essendo che anche i grafici li faccio all'interno di un php, mi connetto al DB da la'.

Lo tengo per casi futuri...
*/

//Carico le configurazioni di base da un file esterno:
include_once('../config_iris.php');

$inputs = htmlspecialchars($_POST["inputs"]);
$inputs_array = explode(",", $inputs);
$n_inputs = sizeof($inputs_array);

$query = $_POST['query'];
//query = select id_conoide, data, media, valore from realtime.cumulata_bacini_2012 where id_conoide = $$$ AND data >= (now() - '14 days'::interval) ORDER BY data ASC;

for ($i=0; $i < $n_inputs ; $i++) {
	$query = str_replace('$$$', $inputs_array[$i], $query);
}
//echo $query;

$conn = pg_connect($conn_string);

$data_array = array();

if (!$conn) { // Check if valid connection
        echo "Error Connecting to database <br>";
        exit;
}
else {
	//$query = "select id_conoide, data, media, valore from realtime.cumulata_bacini_2012 where id_conoide = $id_bacino AND data >= (now() - '14 days'::interval) ORDER BY data ASC;";
	$result = pg_query($conn, $query);
	if (!$result) {
		echo "Error on the query <br>";
	}
	else {
		/*
		$numrows = pg_numrows($result);	
		//$bacino = pg_fetch_row($result, 0); //prendo il primo record
		for ($i=0; $i < $numrows ; $i++) {
			$DataArr = pg_fetch_row($result, $i);
		} // For
		*/
		while($row = pg_fetch_array($result)) {
			$data_array[] = array(strtotime($row[0])*1000, floatval($row[1]));
		}

	} // Query

} // Connection
pg_close($conn);

echo json_encode($data_array);

?>
