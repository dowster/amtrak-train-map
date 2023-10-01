# Amtrak Train Map Reverse Engineering

This project was born on the train from Boston to Chicago, when I got curious about how Amtrak's
[Track Your Train](https://www.amtrak.com/track-your-train.html) website worked. Looking at the
client side JS code it seemed like the folks over at [Volanno](https://www.volanno.com/) (formerly
[IT WORKS! Inc.](http://www.itworksdc.com/)) were pretty proud of their obscurity measures..

```js
/*
__$$_jmd - public key
masterSegment - length of data to be extracted from the encrypted response - 55 is just a fake
//FAKE VARIABLES to throw off people hahahahaha
__$_s - salt value
__$_v - iv vale
*/
var __$$_jmd = "";
var masterSegment = 55;
var __$_s = "";
var __$_v = "";

// cw: We really should not have to do this, but data issues can break the entire
// app. We can't have that so we have to resort to hacks like this.
var defData = {
  City: "",
  State: "",
  Code: "",
};
```

So, naturally, we had to break it. The 'encrypted' data can be retrieved from Amtrak's site with a
simple `GET` request from CURL, so first order of business was to setup a cron script to grab
samples every minute as I noticed the Amtrak data really only updates every minute or two. Then came
the decryption. I've included two decryption implementations here, one written with Rust in the
`amtrak-train-data-decrypter` and another one in TypeScript in `amtrak-train-data-decrypter-ts`. The
TypeScript implementation was just so I could easily mangle code together to get a rough first shot
at decryption working and then decrypt the bulk of the files I had already retrieved. The Rust
implementation exists so I could _rewrite it in rust, baby._

## Decryption Process

The decryption process first needs to extract the Public Key, Salt, and Initialization Vector from
the `RoutesList.v.json` file. Then the private key is decrypted from the encrypted payload, and the
rest of the data decrypted.

### Initialization Vector, Public Key, and Salt retrieval

The Initialization Vector, Public Key, and Salt values are buried in other "unrelated" data and are
extracted in
`[mapApplication.js#L1200](./original-site/Track%20Your%20Train%20Map%20Amtrak_files/maps_data/mapApplication.js#L1200)`

All values are stored in `https://maps.amtrak.com/rttl/js/RoutesList.v.json`, the below code is
starts at the link above and includes my annotations.

```js
$.getJSON(configData.route_listview_url, function (data) {
  /*MasterZoom is the sum of the zoom levels from the routes_list.json file. That is the index in the routesList.v.json -> arr array where we have the public key stored. 
		IF THE ROUTES_LIST CHANGES, REMEMBER TO CHANGE THE INDEX TO BE CORRECT */

  // dowster: At this moment the masterZoom value is "194" which resolves to key guid "69af143c-e8cf-47f8-bf09-fc1f61e5cc33"

  publicKey = data.arr[masterZoom];

  /*Salt Value - the element is at the 8th position. So we can essentially pick any number from 0-100 (length of the s array in the file), get the length of the element, and then go to that index
		the following funky looking code will evaluate to 8. Salt has a length of 8
		*/

  // dowster: currently evaluates to "9a3686ac"

  securityHelper.salt = data.s[data.s[Math.floor(Math.random() * (data.s.length + 1))].length];

  /*Initialization Vector Value - the element is at the 32th position. So we can essentially pick any number from 0-100 (length of the IV array in the file), get the length of the element, and then go to that index
		the following funky looking code will evaluate to 32 - IV has a length of 32		
		*/

  // dowster: currently evaluates to "c6eb2f7f5c4740c1a2f708fefd947d39"

  securityHelper.iv = data.v[data.v[Math.floor(Math.random() * (data.v.length + 1))].length];
});
```

The Initialization Vector is pulled from item `32` of the array `v`, the index is calculated by
grabbing a random item out of `v` and retrieving its length. All the values are of length `32`. Then
the length is used to index `v` again and get the Initialization Vector.

```bash
curl https://maps.amtrak.com/rttl/js/RoutesList.v.json \
 | jq '.arr[32]'
# "25fa87cd-366c-4b78-aef8-a69ac1cff589"
```

The Public Key is pulled from item `194` of the array `arr`. The index `194` is pulled from the
`masterZoom` variable.

```bash
curl https://maps.amtrak.com/rttl/js/RoutesList.v.json \
 | jq '.arr[194]'
# "69af143c-e8cf-47f8-bf09-fc1f61e5cc33"
```

The Salt is pulled from item `8` of the array `s`, the index is calculated the same as the
Initialization Vector, by pulling a random item out of `s` and retrieving its length. The length of
all items in `s` is `8`.

```bash
curl https://maps.amtrak.com/rttl/js/RoutesList.v.json \
 | jq '.s[8]'
# "9a3686ac"
```

> To quickly pull all values:
>
> ```bash
> curl https://maps.amtrak.com/rttl/js/RoutesList.v.json \
>   | jq '{initializationVector: .v[32], publicKey: .arr[194], salt: .s[8]}'
> # {
> #   "initializationVector": "c6eb2f7f5c4740c1a2f708fefd947d39",
> #   "publicKey": "69af143c-e8cf-47f8-bf09-fc1f61e5cc33",
> #   "salt": "9a3686ac"
> # }
> ```

### Decryption Process

This is all contained within the
[`amtrak-train-data-decrypter/src/main.rs`](./amtrak-train-data-decrypter/src/main.rs) file.

## Current Project Status

The project is pretty stalled, at the moment I have the download/data fetching script
(`scripts/fetch_script.sh`) and the archiving script (`scripts/archiver.sh`) running on a hosted
server to fetch the data and then compress it into daily archives to avoid eating up too much disk
space and spewing tons and tons of files every day.

## Original Site

All files in the `original-site` folder were obtained by simply saving the site at
`https://www.amtrak.com/track-your-train.html`. The files can also be downloaded in plaintext from
`https://maps.amtrak.com/rttl/`.

### Server info

> As of 4/15/2023

#### JSP service

```
Amtrak Map Data Service
Version: 2.15
Build Date: 09-03-2021 16:37:31
```

#### Java Webserver

```
X-Powered-By: Undertow/1
X-Powered-By: JSP/2.3
```

#### Proxies

```
Akamai Global Host
```

### Security Info

```
Public Key: "69af143c-e8cf-47f8-bf09-fc1f61e5cc33" -> derives to 0x071e283e782b8827396d6486dfb87027
Salt: "9a3686ac"
Initialization Vector: "c6eb2f7f5c4740c1a2f708fefd947d39"
```

> The "Private Key" used to decrypt the actual payloads appears to change with each new payload.
> This key is decrypted on the fly.

Client code mostly in -> <https://maps.amtrak.com/rttl/js/_$$_666.js>

API Endpoint with train data is
`GET https://maps.amtrak.com/services/MapDataService/trains/getTrainsData`

### Data Format

Appears to be [GeoJSON](https://datatracker.ietf.org/doc/html/rfc7946), or something closely related
to it.
