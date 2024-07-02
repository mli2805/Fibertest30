
# gRpc & gRpc-Web

## Overview

Fibertest30.Api listens for grpc requests on two ports: 5235/Http2 and 5234/Http1. 
Fibertest30.Api has built-in grpc-web proxy, so it can handle both, grpc and grpc-web requests on port 5235, but only grpc-web on port 5234 (grpc requires http2).
In production we use 5235/Http2 behind nginx. 
For development we use 5234/Http1 to avoid using TLS.

### Nginx

```
upstream grpc-api {
  server localhost:5235;
}

# redirect http to https
server {
    listen 80;
    server_name localhost;

    location / {
        return 301 https://$host$request_uri;
    }
}

# grpc, grpc-web, and web
# http2 is enabled because we need grpc (not only grpc-web)
 server {
  listen 443 ssl http2;

  server_name localhost;

  ssl_certificate /app/cert/rfts.crt;
  ssl_certificate_key /app/cert/rfts.key;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';


# grpc reflection service
# NOTE: don't use the full relection service name, i.e. "grpc.reflection.v1alpha.ServerReflection"
#       because some tools (like grpcurl) try to reach "grpc.reflection.v1.ServerReflection" first and just failed
#       /grpc.reflection handles all reflection service versions

location /grpc.reflection {
    grpc_pass grpc://grpc-api;
}

# increase read timeout for SSE long-running request
# default is 60s, so by default after 60s SSE's request inactivity, the connection is lost
location /rfts400.core.Core/GetSystemMessageStream {
    grpc_pass grpc://grpc-api;
    grpc_read_timeout 24h;
  }  

# it proxies both, grpc and grpc-web
location /rfts400. {
    grpc_pass grpc://grpc-api;
  }
  
 # serve angular application
location / {
    root /app/web;
    index index.html;
    try_files $uri $uri/ /index.html;

   # kill cache
    add_header Last-Modified $date_gmt;
    add_header Cache-Control 'private no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
    if_modified_since off;
    expires off;
    etag off;
  }
}
```




### Part of configuration to separating paths /web and /api (just as an example; ignore if you don't care)

Angular must be built with "--base-href /web/" to work with this configuration and also pay attention to image src. 
Src should use ./assets/... instead of /assets/...

It make sense to keep the reflection service proxying as above, because the non-standard url with prefix for grpc is not widely supported (Postman supports, grpcurl doesn't)

```
  location /api {
    rewrite ^/api(.*) $1 break;
    grpc_pass grpc://grpc-api;
  }
  
  location /api/rfts400.core.Core/GetSystemMessageStream {
    rewrite ^/api(.*) $1 break;
    grpc_pass grpc://grpc-api;
    grpc_read_timeout 24h;
  }  

  location /web {
    alias /app/web;
    index index.html;
    try_files $uri $uri/ /web/index.html;

    #kill cache
    add_header Last-Modified $date_gmt;
    add_header Cache-Control 'private no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
    if_modified_since off;
    expires off;
    etag off;
  }
```


