import express from 'express';
import payload from 'payload';
import apiRoutes from './routes'; 

require('dotenv').config();
const app = express();

app.get('/', (_, res) => {
  res.redirect('/admin');
});

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  app.use('/api', apiRoutes);

  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
};

start();
