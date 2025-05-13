FROM caddy
ADD dist /www
COPY Caddyfile /etc/caddy/Caddyfile