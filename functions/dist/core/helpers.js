"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapInsideReferences = exports.downloadImageFromURL = exports.convertToImage = exports.mapFromSnapshot = exports.makeFilters = exports.CustomFilterOperators = exports.resolveFileUrl = exports.unifyData = exports.getDateFromSeconds = void 0;
const firestore_1 = require("firebase-admin/firestore");
// import {getStorage} from 'firebase-admin/storage';
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const http = require('http');
const https = require('https');
var Stream = require('stream').Transform;
function getDateFromSeconds(seconds) {
    const fn = (data) => {
        if (!isNaN(data) && typeof data === 'number' && data !== undefined) {
            const date = new Date(Date.UTC(1970, 0, 1)); // Epoch
            date.setSeconds(data);
            return date;
        }
        return data;
    };
    if (typeof seconds == 'number') {
        return fn(seconds);
    }
    else if (typeof seconds == 'object') {
        if (seconds instanceof firestore_1.Timestamp) {
            return fn(seconds.seconds);
        }
        else if (seconds instanceof Date) {
            return seconds;
        }
    }
    return seconds;
}
exports.getDateFromSeconds = getDateFromSeconds;
function unifyData(data) {
    const response = data.data();
    if (!response) {
        return undefined;
    }
    return Object.assign(Object.assign({}, data.data()), { id: data.id });
}
exports.unifyData = unifyData;
function resolveFileUrl(semiUrl) { }
exports.resolveFileUrl = resolveFileUrl;
exports.CustomFilterOperators = ['=', 'contains'];
function makeFilters(data, operator = 'contains') {
    const response = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            response[key] = {
                operator,
                value,
            };
        }
    }
    return response;
}
exports.makeFilters = makeFilters;
function mapFromSnapshot(response, mapper = (x) => x) {
    return (0, rxjs_1.from)(response).pipe((0, operators_1.map)((snapshot) => {
        return snapshot.docs;
    }), (0, operators_1.map)((snapshot) => {
        return snapshot.map((x) => {
            return Object.assign(Object.assign({}, x.data()), { id: x.id });
        });
    }), (0, operators_1.map)((data) => {
        return data.map((y) => mapper(y));
    }));
}
exports.mapFromSnapshot = mapFromSnapshot;
function convertToImage(signature, path, fileAdapter) {
    function getPartialUrlFromAbsolute(absoluteUrl) {
        const pattern = /([\w\-\.]+%2F)+[\w\-\.]+/;
        const patternObj = new RegExp(pattern);
        const result = patternObj.exec(absoluteUrl);
        if (result) {
            const brutUrl = result[0].replace(/%2F/g, '/');
            return brutUrl;
        }
        return undefined;
    }
    if (!!signature) {
        if (signature.startsWith('data:image')) {
            return fileAdapter.uploadFile(path, signature).pipe((0, operators_1.map)((x) => path));
        }
        else {
            return (0, rxjs_1.of)(getPartialUrlFromAbsolute(signature));
        }
    }
    return (0, rxjs_1.of)(signature);
}
exports.convertToImage = convertToImage;
function downloadImageFromURL(url) {
    var client = http;
    if (url.startsWith('https')) {
        client = https;
    }
    return (0, rxjs_1.from)(new Promise((resolve, reject) => {
        client
            .request(url, function (response) {
            var data = new Stream();
            response.on('data', function (chunk) {
                data.push(chunk);
            });
            response.on('end', function () {
                const buffer = data.read();
                resolve('data:image/jpeg;base64,' + buffer.toString('base64'));
            });
        })
            .end();
    }));
}
exports.downloadImageFromURL = downloadImageFromURL;
/*
export function mapInsideReferences(jsonData: any, p = false): Observable<any> {
  const entries = Object.entries<any>(jsonData);

  const newObj = { ...jsonData };
  const populatedAttributes: any[] = [];
  for (const entry of entries) {
    if (entry[1] instanceof DocumentReference) {
      mapDocumentReferences(populatedAttributes, entry);
    } else if (entry[1] instanceof Timestamp) {
      mapDateReferences(newObj, entry);
    } else if (Array.isArray(entry[1])) {
      mapArrayReferences(entry, populatedAttributes);
    } else if (
      typeof entry[1] === 'number' ||
      typeof entry[1] === 'string' ||
      typeof entry[1] === 'boolean'
    ) {
      mapPrimitiveReferences(populatedAttributes, entry);
    } else if (entry[1] instanceof Object) {
      mapObjectReferences(populatedAttributes, entry);
    }
  }

  const $populatedAttributes =
    populatedAttributes.length > 0 ? zip(...populatedAttributes) : of([]);
  const $obj = of(newObj);
  return zip($obj, $populatedAttributes).pipe(
    map((data) => {
      const originalObj: any = data[0];
      const modifiedAttributes: any = data[1];

      for (const attr of modifiedAttributes) {
        originalObj[attr['attribute']] = attr['value'];
      }
      return originalObj;
    })
  );
}

export function mapDocumentReferences(
  populatedAttributes: any[],
  entry: [string, any]
) {
  populatedAttributes.push(
    fromReference(entry[1]).pipe(
      map((value) => {
        return {
          attribute: entry[0],
          value,
        };
      })
    )
  );
}

export function fromReference<O>(obj: DocumentReference): Observable<O> {
  return from(obj.get()).pipe(
    map((ob: DocumentSnapshot<DocumentData>) => {
      return {
        ...ob.data(),
        id: ob.id,
      };
    }),

    map((x) => mapInsideReferences(x)),
    mergeMap((x) => x)
  );
}
export function mapDateReferences(newObj: any, entry: [string, any]) {
  newObj[entry[0]] = getDateFromSeconds(entry[1].seconds);
}

export function mapArrayReferences(
  entry: [string, any],
  populatedAttributes: any[]
) {
  const arrayProperties = [];
  for (const element of entry[1]) {
    if (element instanceof DocumentReference) {
      arrayProperties.push(fromReference(element));
    } else if (entry[1] instanceof Timestamp) {
      arrayProperties.push(of(getDateFromSeconds(element.seconds)));
    } else if (
      typeof element === 'number' ||
      typeof element === 'string' ||
      typeof element === 'boolean'
    ) {
      arrayProperties.push(of(element));
    } else if (element instanceof Object) {
      const tempRes = mapInsideReferences(element);

      arrayProperties.push(tempRes);
    }
  }
  const temp = arrayProperties.length > 0 ? zip(...arrayProperties) : of([]);

  populatedAttributes.push(
    temp.pipe(
      map((value) => {
        return {
          attribute: entry[0],
          value,
        };
      })
    )
  );
}

export function mapPrimitiveReferences(
  populatedAttributes: any[],
  entry: [string, any]
) {
  populatedAttributes.push(
    of({
      attribute: entry[0],
      value: entry[1],
    })
  );
}

export function mapObjectReferences(
  populatedAttributes: any[],
  entry: [string, any]
) {
  populatedAttributes.push(
    mapInsideReferences(entry[1]).pipe(
      map((value) => {
        return {
          attribute: entry[0],
          value,
        };
      })
    )
  );
}
*/
function mapInsideReferences(jsonData, p = false) {
    const entries = Object.entries(jsonData);
    const newObj = Object.assign({}, jsonData);
    const populatedAttributes = [];
    for (const entry of entries) {
        if (entry[1] instanceof firestore_1.DocumentReference) {
            mapDocumentReferences(populatedAttributes, entry);
        }
        else if (entry[1] instanceof firestore_1.Timestamp) {
            mapDateReferences(newObj, entry);
        }
        else if (Array.isArray(entry[1])) {
            mapArrayReferences(entry, populatedAttributes);
        }
        else if (typeof entry[1] === 'number' ||
            typeof entry[1] === 'string' ||
            typeof entry[1] === 'boolean') {
            mapPrimitiveReferences(populatedAttributes, entry);
        }
        else if (entry[1] instanceof Object) {
            mapObjectReferences(populatedAttributes, entry);
        }
    }
    const $populatedAttributes = populatedAttributes.length > 0 ? (0, rxjs_1.zip)(...populatedAttributes) : (0, rxjs_1.of)([]);
    const $obj = (0, rxjs_1.of)(newObj);
    return (0, rxjs_1.zip)($obj, $populatedAttributes).pipe((0, operators_1.map)((data) => {
        const originalObj = data[0];
        const modifiedAttributes = data[1];
        for (const attr of modifiedAttributes) {
            originalObj[attr['attribute']] = attr['value'];
        }
        return originalObj;
    }));
}
exports.mapInsideReferences = mapInsideReferences;
function mapDocumentReferences(populatedAttributes, entry) {
    populatedAttributes.push(fromReference(entry[1]).pipe((0, operators_1.map)((value) => {
        return {
            attribute: entry[0],
            value,
        };
    })));
}
function mapDateReferences(newObj, entry) {
    newObj[entry[0]] = getDateFromSeconds(entry[1]);
}
function mapArrayReferences(entry, populatedAttributes) {
    const arrayProperties = [];
    for (const element of entry[1]) {
        if (element instanceof firestore_1.DocumentReference) {
            arrayProperties.push(fromReference(element));
        }
        else if (entry[1] instanceof firestore_1.Timestamp) {
            arrayProperties.push((0, rxjs_1.of)(getDateFromSeconds(element)));
        }
        else if (typeof element === 'number' ||
            typeof element === 'string' ||
            typeof element === 'boolean') {
            arrayProperties.push((0, rxjs_1.of)(element));
        }
        else if (element instanceof Object) {
            const tempRes = mapInsideReferences(element);
            arrayProperties.push(tempRes);
        }
    }
    const temp = arrayProperties.length > 0 ? (0, rxjs_1.zip)(...arrayProperties) : (0, rxjs_1.of)([]);
    populatedAttributes.push(temp.pipe((0, operators_1.map)((value) => {
        return {
            attribute: entry[0],
            value,
        };
    })));
}
function mapPrimitiveReferences(populatedAttributes, entry) {
    populatedAttributes.push((0, rxjs_1.of)(entry[1]).pipe((0, operators_1.map)((value) => {
        return {
            attribute: entry[0],
            value,
        };
    })));
}
function mapObjectReferences(populatedAttributes, entry) {
    populatedAttributes.push(mapInsideReferences(entry[1]).pipe((0, operators_1.map)((value) => {
        return {
            attribute: entry[0],
            value,
        };
    })));
}
function fromReference(obj) {
    return (0, rxjs_1.from)(obj.get()).pipe((0, operators_1.map)((ob) => {
        return Object.assign(Object.assign({}, ob.data()), { id: ob.id });
    }), (0, operators_1.map)((x) => mapInsideReferences(x)), (0, operators_1.mergeMap)((x) => x));
}
