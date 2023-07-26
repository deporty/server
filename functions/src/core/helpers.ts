import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Timestamp,
} from 'firebase-admin/firestore';
// import {getStorage} from 'firebase-admin/storage';
import { from, Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { FileAdapter } from './file/file.adapter';

const http = require('http');
const https = require('https');

var Stream = require('stream').Transform;

export function getDateFromSeconds(seconds: any) {
  const fn = (data: number) => {
    if (!isNaN(data) && typeof data === 'number' && data !== undefined) {
      const date = new Date(Date.UTC(1970, 0, 1)); // Epoch
      date.setSeconds(data);
      return date;
    }
    return data;
  };
  if (typeof seconds == 'number') {
    return fn(seconds);
  } else if (typeof seconds == 'object') {
    if (seconds instanceof Timestamp) {
      return fn(seconds.seconds);
    } else if (seconds instanceof Date) {
      return seconds;
    }
  }
  return seconds;
}

export function unifyData(
  data: DocumentSnapshot<DocumentData>
): DocumentData | undefined {
  const response = data.data();
  if (!response) {
    return undefined;
  }
  return {
    ...data.data(),
    id: data.id,
  };
}

export function resolveFileUrl(semiUrl: string) {}

export type FirebaseFilterOperators =
  | '<'
  | '<='
  | '=='
  | '!='
  | '>='
  | '>'
  | 'array-contains'
  | 'in'
  | 'not-in'
  | 'array-contains-any';

export type CustomFilterOperators = '=' | 'contains';
export const CustomFilterOperators = ['=', 'contains'];

export type Operators = FirebaseFilterOperators | CustomFilterOperators;
export interface Filter {
  operator: Operators;
  value: any;
}
export interface Filters {
  [index: string]: Filter | Filter[];
}

export function makeFilters(data: any, operator: Operators = 'contains') {
  const response: Filters = {};

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

export function mapFromSnapshot(
  response: Promise<QuerySnapshot<DocumentData>>,
  mapper = (x: any) => x
) {
  return from(response).pipe(
    map((snapshot: QuerySnapshot<DocumentData>) => {
      return snapshot.docs;
    }),
    map((snapshot: QueryDocumentSnapshot<DocumentData>[]) => {
      return snapshot.map((x) => {
        return { ...x.data(), id: x.id };
      });
    }),
    map((data) => {
      return data.map((y) => mapper(y));
    })
  );
}

export function convertToImage(
  signature: string | undefined,
  path: string,
  fileAdapter: FileAdapter
) {
  function getPartialUrlFromAbsolute(absoluteUrl: string) {
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
      return fileAdapter.uploadFile(path, signature).pipe(map((x) => path));
    } else {
      return of(getPartialUrlFromAbsolute(signature));
    }
  }
  return of(signature);
}

export function downloadImageFromURL(url: string): Observable<string> {
  var client = http;
  if (url.startsWith('https')) {
    client = https;
  }

  return from(
    new Promise<string>((resolve, reject) => {
      client
        .request(url, function (response: any) {
          var data = new Stream();
          response.on('data', function (chunk: any) {
            data.push(chunk);
          });
          response.on('end', function () {
            const buffer = data.read();
            resolve('data:image/jpeg;base64,' + buffer.toString('base64'));
          });
        })
        .end();
    })
  );
}

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

function mapDocumentReferences(
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

function mapDateReferences(newObj: any, entry: [string, any]) {
  newObj[entry[0]] = getDateFromSeconds(entry[1]);
}

function mapArrayReferences(entry: [string, any], populatedAttributes: any[]) {
  const arrayProperties = [];
  for (const element of entry[1]) {
    if (element instanceof DocumentReference) {
      arrayProperties.push(fromReference(element));
    } else if (entry[1] instanceof Timestamp) {
      arrayProperties.push(of(getDateFromSeconds(element)));
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

function mapPrimitiveReferences(
  populatedAttributes: any[],
  entry: [string, any]
) {
  populatedAttributes.push(
    of(entry[1]).pipe(
      map((value) => {
        return {
          attribute: entry[0],
          value,
        };
      })
    )
  );
}

function mapObjectReferences(populatedAttributes: any[], entry: [string, any]) {
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

function fromReference(obj: DocumentReference): Observable<any> {
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
