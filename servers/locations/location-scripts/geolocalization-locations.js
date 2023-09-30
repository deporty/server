const { encodeGeohash, makeBase } = require('@scifamek-open-source/guatavita');
const { readFileSync, writeFileSync } = require('fs');

const cities = JSON.parse(readFileSync('cities.json'));
const response = [];
const base64 = makeBase(64);
const base128 = makeBase(128);
for (const city of cities) {
  const base32Hash = encodeGeohash(city.latitude, city.longitude, 8);
  const base64Hash = encodeGeohash(city.latitude, city.longitude, 7, base64);
  const base128Hash = encodeGeohash(city.latitude, city.longitude, 6, base128);
  console.log('City: ', city.name, base32Hash, base64Hash, base128Hash);

  response.push({
    name: city.name,
    state: city.state,
    coordinate: {
      latitude: city.latitude,
      longitude: city.longitude,
    },
    geohash32: base32Hash,
    geohash64: base64Hash,
    geohash128: base128Hash,
  });
}

writeFileSync('cities.db.json', JSON.stringify(response, null, 2));
