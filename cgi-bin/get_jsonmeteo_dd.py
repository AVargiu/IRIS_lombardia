#!/usr/bin/python

#SCRIPT PER ESPORTARE COME JSON VIA URL DATI GIORNALIERI DELLE STAZIONI METEO:

#import sys
import cgi
import pg
from datetime import datetime, timedelta
import simplejson

print "Content-type: application/json\n"

# Lettura dei parametri
fs = cgi.FieldStorage()

try:
    data_i = str(fs["data_i"].value)
    data_f = str(fs["data_f"].value)
    codstaz = str(fs["codstaz"].value)
    #Per restituire un JSONP:
    callback = str(fs['callback'].value)
    #if "progetto" in fs:
    #    progetto = fs["progetto"].value
    #assert progetto in ['produzione', 'debug'], "valore variabile progetto non consentita"
#except AssertionError, e:
#  print simplejson.dumps([{'status': "ERROR"}, {'message': e.args}])
#except ValueError, e:
#    print simplejson.dumps([{'status': "ERROR"}, {'message': e.args} ])
except:
    print simplejson.dumps([{'status': "ERROR"}, {'message': "Error parsing parameters: be sure to pass data_i, data_f and codstaz"} ])

### Testo la connessione:
try:
      con_db1 = pg.connect(dbname='radar', host='localhost', user='webgis')

      query_com = "SELECT round(totale, 1)::text AS totale, data, classe_totale FROM realtime.meteo_pioggia_dd WHERE data BETWEEN '%s' AND '%s' AND codice_istat_comune||progr_punto_com = '%s' ORDER BY data;" % (data_i, data_f, codstaz)

      results_com = con_db1.query(query_com).getresult()
      if results_com:
          dati_arr = []
          #valori_arr = []
          for row in results_com:
            #valore_dd = "%.2f" % round(float(row[0]),1)
            valore_dd = "%.1f" % float(row[0])
            valori_arr = [ row[2], valore_dd ]
            dati_arr.append({ row[1]: valori_arr })

          #print simplejson.dumps([{'status': "OK", 'result': dati_arr }])
          #print simplejson.dumps([{ 'codstaz': codstaz, 'dati_dd': dati_arr }])
	  #Per restituire un JSONP:
          jsonobject = simplejson.dumps([{"codstaz": codstaz, "dati_dd": dati_arr } ])
          print '{0}({1})'.format(callback, jsonobject)
          #print simplejson.dumps([{ "codstaz": codstaz, "dati_dd": dati_arr }])


      else: #no data
	  #Per restituire un JSONP:
          jsonobject = simplejson.dumps([{"codstaz": codstaz, "dati_dd": "NO DATA" } ])
          print '{0}({1})'.format(callback, jsonobject)
          #print simplejson.dumps([{"codstaz": codstaz, "dati_dd": "NO DATA" } ])
      #sys.exit(0)
      
      con_db1.close()

except:
  #Per restituire un JSONP:
  jsonobject = simplejson.dumps([{'status': "ERROR"}, {'message': "Error DB connection"}, {'sql': query_com}])
  print '{0}({1})'.format(callback, jsonobject)
  #print simplejson.dumps([{'status': "ERROR"}, {'message': "Error DB connection"}, {'sql': query_com}])
  con_db1.close()
  #sys.exit(1)

