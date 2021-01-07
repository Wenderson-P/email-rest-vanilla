import http from 'http';
import fs from 'fs';

const MessageController = require('./controllers/MessageController');

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-type': 'text/html' });
  fs.createReadStream('./src/frontend/index.html').pipe(response);
  if (request.url === '/styles.css') {
    response.writeHead(200, { 'Content-type': 'text/css' });
    const fileContents = fs.readFileSync('./src/frontend/styles.css', { encoding: 'utf8' });
    response.write(fileContents);
  }
  try {
    if (request.url.match(/\/messages\/\w+/) && request.method === 'GET') {
      const userEmail = request.url.split('/')[2];
      MessageController.index(request, response, userEmail);
    } else if (request.url === '/messages' && request.method === 'POST') {
      MessageController.create(request, response);
    } else if (request.url.match(/\/messages\/\w+/) && request.method === 'DELETE') {
      const messageId = request.url.split('/')[2];
      MessageController.delete(request, response, messageId);
    }
  } catch (error) {
    response.statusCode = 400;
    response.write(`<h1>Server error<h1><p>${error}`);
    response.end();
  }
});

server.listen(process.env.PORT || 3000);
