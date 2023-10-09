const { exec } = require('child_process');
const http = require('http');
const axios = require('axios');
const port = 10000;

const serversMapper = {
  authorization: {
    port: 10001,
    name: 'authorization',
  },
  invoices: {
    port: 10002,
    name: 'invoices',
  },
  locations: {
    port: 10003,
    name: 'locations',
  },
  news: {
    port: 10004,
    name: 'news',
  },
  organizations: {
    port: 10005,
    name: 'organizations',
  },
  teams: {
    port: 10006,
    name: 'teams',
  },
  tournaments: {
    port: 10007,
    name: 'tournaments',
  },
  users: {
    port: 10008,
    name: 'users',
  },
};

function runServer(serverConfig) {
  terminal = exec('cd ../servers/' + serverConfig.name + ' && npm run start:dev', (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log(`stdout:\n${stdout}`);
  });

  return terminal;
}

function run() {
  const terminals = [];
  for (const key in serversMapper) {
    const serverConfig = serversMapper[key];

    runServer(serverConfig);
  }
  return terminals;
}
function extractIdentifier(url) {
  const fragment = url.split('/')[1];
  return fragment.split('?')[0];
}
const terminals = run();
const server = http.createServer((request, res) => {
  const identifier = extractIdentifier(request.url);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, user-token, authorization');
  const headers = request.headers;
  if (serversMapper[identifier]) {
    const tail = String(request.url);
    const configuration = serversMapper[identifier];
    const path = 'http://127.0.0.1:' + configuration.port + tail;

    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      let body = '';
      request.on('data', (chunk) => {
        body += chunk.toString();
      });
      request.on('end', () => {
        console.log({
          method: request.method,
          url: path,
          data: JSON.parse(body),
        });

        axios({
          method: request.method,
          url: path,
          headers: { ...headers },
          data: body,
        })
          .then((responseBOdy) => {
            res.statusCode = 200;
            res.end(JSON.stringify(responseBOdy.data));
          })
          .catch((error) => {
            console.error('Error:', error.toString());
            res.end();
          })
          .finally(() => {
            console.log('Finalizando transación: ', path);
          });
      });
    } else {
      console.log({
        method: request.method,
        url: path,
      });
      axios({
        method: request.method,
        url: path,
        headers: { ...headers },
      })
        .then((response) => {
          res.statusCode = 200;
          res.end(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error('Error:', error.toString());
          res.end();
        })
        .finally(() => {});
    }
  } else {
    res.end();
  }
});

server.listen(port, () => {
  console.log('Runing');
});
