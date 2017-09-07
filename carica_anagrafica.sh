#!/bin/bash
#=============================================================================
# 2017/05/03 MR. Caricamento anagrafica su DB da CSV Mysql.
#=============================================================================


#psql -d iris_base -U postgres -c "BEGIN; TRUNCATE dati_di_base.anagraficasensori; \copy dati_di_base.anagraficasensori(idstazione, idrete, proprieta, provincia, comune, attributo, utm_nord, utm_est, quota, idsensore, nometipologia, datainizio, datafine, storico, altezza, frequenza, fiume, bacino) from 'anagrafica_IRIS.csv' WITH NULL 'NULL'; END;"

export PGPASSWORD=p0stgr3S

psql -d iris_base -U postgres -c "TRUNCATE dati_di_base.anagraficasensori;"

psql -d iris_base -U postgres -c "\copy dati_di_base.anagraficasensori(idstazione, idrete, proprieta, provincia, comune, attributo, utm_nord, utm_est, quota, idsensore, nometipologia, datainizio, datafine, storico, altezza, frequenza, fiume, bacino) from '/home/meteo/IRIS/anagrafica_IRIS.csv' WITH NULL 'NULL';"

psql -d iris_base -U postgres -c "UPDATE dati_di_base.anagraficasensori SET the_geom = ST_SetSRID(ST_MakePoint(utm_est, utm_nord), 32632); UPDATE dati_di_base.anagraficasensori SET codice_im = foo.codice_im FROM (SELECT b.codice_im, a.idsensore FROM dati_di_base.anagraficasensori a, dati_di_base.aree_allerta b WHERE st_intersects(a.the_geom, b.the_geom)) AS foo WHERE anagraficasensori.idsensore = foo.idsensore;"

