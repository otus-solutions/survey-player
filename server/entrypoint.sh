#!/bin/sh
set -e

envsubst '${DATASOURCE_URL} ${ACTIVITY_URL} ${STATIC_VARIABLE_URL} ${FILE_UPLOAD_URL} ${LOGIN_URL} ${COLLECT_URL} ${SURVEY_URL}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf-updated
rm -rf /etc/nginx/conf.d/default.conf
mv /etc/nginx/conf.d/default.conf-updated /etc/nginx/conf.d/default.conf
exit 0;
