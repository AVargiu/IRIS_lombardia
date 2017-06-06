#!/usr/bin/python

"""
script che interroga i vari raster caricati sul progetto tramite libreria gdal
l'interrogazione avviene trmaite le coordinate cliccate su mappa e passate via url
"""

import os,sys
import cgi
import pyproj
import pg

import urllib
import simplejson
from unicodedata import normalize

proxies = {'http': 'http://proxy-srv.csi.it:3128/'}

url="http://nominatim.openstreetmap.org/reverse?format=json&lat=44.9613570835&lon=7.60427481268"
url='http://maps.google.com/maps/api/geocode/json?latlng=45.0,7.7'

response=simplejson.load(urllib.urlopen(url, proxies=proxies))

loc = response[0]['formatted_address'].split(',')

print loc

