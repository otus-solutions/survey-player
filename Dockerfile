FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/index.html
RUN rm -rf /usr/share/nginx/html/50x.html

COPY source/dist/survey-player /usr/share/nginx/html/survey-player
COPY server/nginx.conf /etc/nginx/nginx.conf
COPY server/player.conf /etc/nginx/conf.d/default.conf

COPY server/entrypoint.sh /usr/local/bin/commands.sh
RUN chmod +x /usr/local/bin/commands.sh

ENV SHARED_URL_REGEX "\\?activity=[a-f0-9]+&token=.+"

CMD ["/bin/sh", "-c", "/usr/local/bin/commands.sh && nginx -g 'daemon off;'"]

