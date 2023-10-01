#!/bin/bash

YESTERDAY=$(date --date='yesterday' '+%y-%m-%d')

BASEDIR="/home/dowster/AmHack"

ENCRYPTED_BASEDIR="${BASEDIR}/encrypted"
DECRYPTED_BASEDIR="${BASEDIR}/decrypted"

ENCRYPTED_DIR="${ENCRYPTED_BASEDIR}/${YESTERDAY}"
DECRYPTED_DIR="${DECRYPTED_BASEDIR}/${YESTERDAY}"

if [ -d "$ENCRYPTED_DIR" ]; then
  echo "Archiving $(ls -l $ENCRYPTED_DIR | wc -l) files ($(du -hs $ENCRYPTED_DIR)) from ${ENCRYPTED_DIR}."
  tar --use-compress-program="pigz -k" -cf "${ENCRYPTED_DIR}.tar.gz" -C "${ENCRYPTED_BASEDIR}" "${YESTERDAY}/"
  du -hsc "${ENCRYPTED_DIR}.tar.gz"
  # Uncomment this after a few days when I'm sure it creates archives
  # rm -r "$ENCRYPTED_DIR"
else
  echo "Path ${ENCRYPTED_DIR} does not exist."
fi

if [ -d "$DECRYPTED_DIR" ]; then
  echo "Archiving $(ls -l $DECRYPTED_DIR | wc -l) files ($(du -hs $DECRYPTED_DIR)) from ${DECRYPTED_DIR}."
  tar --use-compress-program="pigz -k" -cf "${DECRYPTED_DIR}.tar.gz" -C "${DECRYPTED_BASEDIR}" "${YESTERDAY}/"
  du -hsc "${DECRYPTED_DIR}.tar.gz"
  # Uncomment this after a few days when I'm sure it creates archives
  # rm -r "$DECRYPTED_DIR"
else
  echo "Path ${DECRYPTED_DIR} does not exist."
fi

echo "Current AmHack disk usage:"
du -hac -d 1 $ENCRYPTED_BASEDIR $DECRYPTED_BASEDIR
