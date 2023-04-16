# Amtrak Train Map Reverse Engineering

All files in this repo were obtained by simply saving the site at `https://www.amtrak.com/track-your-train.html`. The files can also be downloaded in plaintext from `https://maps.amtrak.com/rttl/`.

## Server info 

> As of 4/15/2023

### JSP service

```
Amtrak Map Data Service
Version: 2.15
Build Date: 09-03-2021 16:37:31
```

### Java Webserver

```
X-Powered-By: Undertow/1
X-Powered-By: JSP/2.3
```

### Proxies

```
Akamai Global Host
```


Client code mostly in -> <https://maps.amtrak.com/rttl/js/_$$_666.js>

API Endpoint with train data is `GET https://maps.amtrak.com/services/MapDataService/trains/getTrainsData`

