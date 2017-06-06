#!/bin/bash
# script per l'aggiornamento dei file in /var/www/cgi-bin e /var/www/html
#
# lo script deve essere lanciato prima di eseguire il comando git add
cp /var/www/cgi-bin/* cgi-bin
cp /var/www/html/* html

