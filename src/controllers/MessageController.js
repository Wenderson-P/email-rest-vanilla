import { v4 as uuidv4 } from 'uuid';
import getDatabaseData from '../utils/getDatabaseData';
import writeInDatabase from '../utils/writeInDatabase';

module.exports = {
  async create(req, res) {
    try {
      const promise = () => new Promise((resolve, reject) => {
        try {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk.toString();
          });

          req.on('end', () => {
            resolve(body);
          });
        } catch (error) {
          reject(error);
        }
      });

      const body = await promise(req);
      const {
        destinatario, remetente, assunto, corpo,
      } = JSON.parse(body);
      const receivedMessage = {
        uid: uuidv4(),
        destinatario,
        remetente,
        assunto,
        corpo,
      };

      const databaseData = await getDatabaseData();

      databaseData.messages.push(receivedMessage);
      writeInDatabase(databaseData);

      res.writeHead(201);
      return res.end(JSON.stringify(receivedMessage));
    } catch (error) {
      console.log(error);
      res.writeHead(400);
      return res.end(JSON.stringify(error));
    }
  },
  async index(request, response, userEmail) {
    const databaseData = await getDatabaseData();
    response.statusCode = 200;
    response.write(JSON.stringify({ userEmail, ...databaseData }));
    response.end();
  },
  async delete(req, res, messageId) {
    try {
      const databaseData = await getDatabaseData();

      const messageExists = databaseData.messages.find((message) => message.uid === messageId);

      if (!messageExists) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Message not Found' }));
        return;
      }

      const updatedMessages = databaseData.messages.filter((message) => message.uid !== messageId);

      writeInDatabase({ messages: [...updatedMessages] });

      res.writeHead(204);
      return;
    } catch (error) {
      console.log(error);
    }
  },
};
