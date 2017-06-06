<?php

$webgis = $_GET['webgis'];

//Carico le configurazioni di base da un file esterno:
include_once('../config_iris.php');

$conn = pg_connect($conn_string);

if (!$conn) { // Check if valid connection
	echo "Error Connecting to database <br>";
	exit;
}
else {
        // Valid connection, we can go on to retrieve some data
        $query_aperte = "SELECT * FROM realtime.v_anomalie WHERE data_fine IS NULL;";
	//$query_risolte = "SELECT * FROM realtime.v_anomalie WHERE data_fine >= (now() - '30 days'::interval);";

	// Analizziamo prima le anomalie ancora aperte:
        $result_aperte = pg_query($conn,$query_aperte);
        if (!$result_aperte) {
                echo "Error on the query <br>";
        }
        else {
                $numrows = pg_numrows($result_aperte);

                echo "<p><b>Anomalie ancora aperte:</b></p>";

                //echo "<font style='background-color:#FF4500;'>ROSSO</font> alta probabilita' di occorrenza del fenomeno</p>";

                echo "<center><table border='1' cellspacing='1' cellpadding='1'>";
		
		//Modifico i risultati in base al tipo di webgis:
		if ($webgis == 'pubblico') {
			echo "<tr><th align=center>Data inizio:<br/>(UTC)</th><th align=center>Sistema interessato:</th><th align=center>Descrizione anomalia:</th><th align=center>Data inserimento<br/>(UTC):</th></tr>";
		}
		else {
                	echo "<tr><th align=center>Data inizio:<br/>(UTC)</th><th align=center>Sistema interessato:</th><th align=center>Descrizione anomalia:</th><th align=center>Autore inserimento:</th><th align=center>Data inserimento<br/>(UTC):</th></tr>";
		}
				
                for ($i=0; $i < $numrows ; $i++) {
                        $DataArr = pg_fetch_row($result_aperte, $i);

			//Modifico i risultati in base al tipo di webgis:
			if ($webgis == 'pubblico') {
			echo "<tr><td align=center>$DataArr[2]</td><td align=center>$DataArr[1]</td><td align=center>$DataArr[4]</td><td align=center>$DataArr[6]</td></tr>";
			}
			else {
			echo "<tr><td align=center>$DataArr[2]</td><td align=center>$DataArr[1]</td><td align=center>$DataArr[4]</td><td align=center>$DataArr[5]</td><td align=center>$DataArr[6]</td></tr>";
			}

                } // For
       
	echo "</table></center>";

        } // Query sulle anomalie aperte

	echo "<hr />";


	$query_recenti = "SELECT * FROM realtime.v_anomalie WHERE data_fine >= (now() - '7 days'::interval);";
	$result_recenti = pg_query($conn,$query_recenti);
        if (!$result_recenti) {
                echo "Error on the query <br>";
        }
        else {
                $numrows = pg_numrows($result_recenti);

                echo "<p><b>Anomalie recenti (risolte negli ultimi 7 giorni):</b></p>";


                echo "<center><table border='1' cellspacing='1' cellpadding='1'>";

                //Modifico i risultati in base al tipo di webgis:
                if ($webgis == 'pubblico') {
                        echo "<tr><th align=center>Data inizio:<br/>(UTC)</th><th align=center>Sistema interessato:</th><th align=center>Descrizione anomalia:</th><th align=center>Data chiusura<br/>(UTC):</th></tr>";
                }
                else {
                        echo "<tr><th align=center>Data inizio:<br/>(UTC)</th><th align=center>Sistema interessato:</th><th align=center>Descrizione anomalia:</th><th align=center>Autore inserimento:</th><th align=center>Data chiusura<br/>(UTC):</th></tr>";
                }

                for ($i=0; $i < $numrows ; $i++) {
                        $DataArr = pg_fetch_row($result_recenti, $i);

                        //Modifico i risultati in base al tipo di webgis:
                        if ($webgis == 'pubblico') {
                        echo "<tr><td align=center>$DataArr[2]</td><td align=center>$DataArr[1]</td><td align=center>$DataArr[4]</td><td align=center>$DataArr[3]</td></tr>";
                        }
                        else {
                        echo "<tr><td align=center>$DataArr[2]</td><td align=center>$DataArr[1]</td><td align=center>$DataArr[4]</td><td align=center>$DataArr[5]</td><td align=center>$DataArr[3]</td></tr>";
                        }

                } // For

        echo "</table></center>";

        } // Query sulle anomalie recenti


} // Connection
pg_close($conn);

?>
