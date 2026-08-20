server {
  listen 80;
  server_name 159.203.187.117;
  root /var/www/smp.tf/dist/client;

  location / {
    try_files $uri $uri/ @bun;

    access_log off;
    add_header Cache-Control "public, immutable";
  }

  location @bun {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}

