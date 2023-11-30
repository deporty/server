const http = require('http');
const axios = require('axios');
const port = 10000;
const util = require('node:util');
const { stdout } = require('process');
const exec = util.promisify(require('node:child_process').exec);

const serversMapper = {
  mySelf: {
    port: 10000,
    name: 'loadbalancer',
    run: false,
  },
  authorization: {
    port: 10001,
    name: 'authorization',
    run: true,
  },
  invoices: {
    port: 10002,
    name: 'invoices',
    run: false,
  },
  locations: {
    port: 10003,
    name: 'locations',
    run: true,
  },
  news: {
    port: 10004,
    name: 'news',
    run: false,
  },
  organizations: {
    port: 10005,
    name: 'organizations',
    run: true,
  },
  teams: {
    port: 10006,
    name: 'teams',
    run: true,
  },
  tournaments: {
    port: 10007,
    name: 'tournaments',
    run: true,
  },
  users: {
    port: 10008,
    name: 'users',
    run: true,
  },
  administration: {
    port: 10009,
    name: 'administration',
    run: true,
  },
};

function getServerInfo(port) {
  return Object.entries(serversMapper).filter((x) => x[1].port == port && x[1].run);
}

async function getPids() {
  const C = await exec('netstat -ano');

  const r = /([TCPUD]{3})[ ]+(([0-9\.]+):([0-9]+)[ ]+)(([0-9\.]+):([0-9]+)[ ]+)[\w]+[ ]+([\d]{2,})/g;
  const pattern = new RegExp(r);

  const stdout = C.stdout;
  let find = pattern.exec(stdout);

  const response = [];
  while (find) {
    const info = getServerInfo(find[4]);
    if (info.length > 0) {
      response.push({
        ...info[0][1],
        pid: parseInt(find[8]),
      });
    }
    find = pattern.exec(stdout);
  }

  return response;
}
function runServer(serverConfig) {
  terminal = exec('cd ../servers/' + serverConfig.name + ' && npm run start:dev');
  terminal.then((error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
  });

  return terminal;
}

function run() {
  const terminals = [];
  for (const key in serversMapper) {
    const serverConfig = serversMapper[key];
    if (serverConfig.run) {
      console.log('Running ', serverConfig.name);
      runServer(serverConfig);
    }
  }
  return terminals;
}
function extractIdentifier(url) {
  const fragment = url.split('/')[1];
  return fragment.split('?')[0];
}

wasPrinted = false;

async function main() {
  const response = await getPids();

  console.log('Running before ', response);
  for (const server of response) {
    const command = `taskkill /F /PID ${server.pid}`;
    console.log(command);
    await exec(command);
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

      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
        let body = '';
        request.on('data', (chunk) => {
          body += chunk.toString();
        });
        request.on('end', () => {
          const contype = request.headers['content-type'];
          if (contype === 'application/json') {
            console.log(request.headers);
            console.log({
              method: request.method,

              url: path,
              data: JSON.parse(body),
            });
          }else{

          }
          axios({
            method: request.method,
            url: path,
            headers: request.headers,
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
    setInterval(async () => {
      const response = await getPids();
      if (response.length > 0 && !wasPrinted) {
        console.log(JSON.stringify(response, null, 2));
        console.log('---------');

        if (response.length == 7) {
          wasPrinted = true;
        }
      }
    }, 5000);

    console.log('Runing');
  });
}

main();
