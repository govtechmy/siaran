import express from 'express';
import payload from 'payload';
import apiRoutes from './routes'; 

require('dotenv').config();
const app = express();

app.get('/', (_, res) => {
  res.redirect('/admin');
});


const agencies = [
  { name: 'Prime Minister\'s Office', acronym: 'PMO', email: 'PMO@gov.my' },
  { name: 'Ministry of Finance', acronym: 'MOF', email: 'MOF@gov.my' },
  { name: 'Ministry of Transport', acronym: 'MOT', email: 'MOT@gov.my' },
  { name: 'Ministry of Agriculture and Food Security', acronym: 'MAFS', email: 'MAFS@gov.my' },
  { name: 'Ministry of Economy', acronym: 'MOE', email: 'MOE@gov.my' },
  { name: 'Ministry of Housing and Local Government', acronym: 'KPKT', email: 'KPKT@gov.my' },
  { name: 'Ministry of Foreign Affairs', acronym: 'KLN', email: 'KLN@gov.my' },
  { name: 'Ministry of Works', acronym: 'KKR', email: 'KKR@gov.my' },
  { name: 'Ministry of Home Affairs', acronym: 'KDN', email: 'KDN@gov.my' },
  { name: 'Ministry of Investment, Trade, and Industry', acronym: 'MITI', email: 'MITI@gov.my' },
  { name: 'Ministry of Defence', acronym: 'MINDEF', email: 'MINDEF@gov.my' },
  { name: 'Ministry of Science, Technology, and Innovation', acronym: 'MOSTI', email: 'MOSTI@gov.my' },
  { name: 'Ministry of Women, Family and Community Development', acronym: 'KPWKM', email: 'KPWKM@gov.my' },
  { name: 'Ministry of Natural Resources, Environment, and Climate Change', acronym: 'NRECC', email: 'NRECC@gov.my' },
  { name: 'Ministry of Entrepreneur Development and Cooperatives', acronym: 'MEDAC', email: 'MEDAC@gov.my' },
  { name: 'Ministry of Higher Education', acronym: 'MOHE', email: 'MOHE@gov.my' },
  { name: 'Ministry of Tourism, Arts, and Culture', acronym: 'MOTAC', email: 'MOTAC@gov.my' },
  { name: 'Ministry of Communications and Digital', acronym: 'KKD', email: 'KKD@gov.my' },
  { name: 'Ministry of Education', acronym: 'MOE', email: 'MOE@gov.my' },
  { name: 'Ministry of National Unity', acronym: 'KPN', email: 'KPN@gov.my' },
  { name: 'Ministry of Youth and Sports', acronym: 'KBS', email: 'KBS@gov.my' },
  { name: 'Ministry of Federal Territories', acronym: 'KWP', email: 'KWP@gov.my' },
  { name: 'Ministry of Domestic Trade and Costs of Living', acronym: 'KPDN', email: 'KPDN@gov.my' },
  { name: 'Ministry of Plantation and Commodities', acronym: 'MPIC', email: 'MPIC@gov.my' },
  { name: 'Ministry of Health', acronym: 'MOH', email: 'MOH@gov.my' },
  { name: 'Ministry of Human Resources', acronym: 'MOHR', email: 'MOHR@gov.my' },
  { name: 'Ministry of Rural and Regional Development', acronym: 'KKDW', email: 'KKDW@gov.my' },
  { name: 'Ministry of Energy Transition and Water Transformation', acronym: 'PETRA', email: 'PETRA@gov.my' }
];

const createAgencies = async () => {
  for (const agency of agencies) {
    try {
      const result = await payload.create({
        collection: 'agencies', 
        data: {
          id: agency.acronym,
          name: agency.name,
          email: agency.email,
          acronym: agency.acronym, 
        },
      });
      console.log(`Created agency: ${agency.name}, ID: ${result.id}`);
    } catch (error) {
      console.error(`Failed to create agency: ${agency.name}`, error);
    }
  }
};


const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    local: true,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  app.use('/api', apiRoutes);

  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
  await createAgencies()
};

start();
