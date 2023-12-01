import * as fs from 'fs';
import { load } from 'ts-dotenv'


const env = load({
  POSTGRES_USER:String,
  POSTGRES_PASSWORD:String,
  POSTGRES_DB:String,
})
const config = {
    development: {
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_DB,
      dialect: 'postgres',
    },
    test: {
      // Ajoutez les paramètres spécifiques au test si nécessaire
    },
    production: {
      // Ajoutez les paramètres spécifiques à la production si nécessaire
    },
  };
  
fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 2));
  
console.log('Configuration générée avec succès dans config.json');