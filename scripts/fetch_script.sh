#!/bin/bash 

DATESTAMP=$(date '+%y-%m-%d')
DATETIMESTAMP=$(date '+%y-%m-%d_%H-%M-%S')

BASEPATH="/home/dowster/AmHack"

ENCRYPTED_DIR="${BASEPATH}/encrypted/${DATESTAMP}"
DECRYPTED_DIR="${BASEPATH}/decrypted/${DATESTAMP}"

ENCRYPTED_FILENAME="${ENCRYPTED_DIR}/train-datafeed_$DATETIMESTAMP.b64"
DECRYPTED_FILENAME="${DECRYPTED_DIR}/train-datafeed_$DATETIMESTAMP.json"

mkdir -p "${DECRYPTED_DIR}" 
mkdir -p "${ENCRYPTED_DIR}" 

curl 'https://maps.amtrak.com/services/MapDataService/trains/getTrainsData' -o $ENCRYPTED_FILENAME

cat $ENCRYPTED_FILENAME | /home/dowster/AmHack/amtrak-train-data-decrypter > $DECRYPTED_FILENAME
