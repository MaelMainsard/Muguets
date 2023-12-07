import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { load } from 'ts-dotenv';
import { DB_CONNECT } from './controller/database_connection'
import cors from 'cors';
import ProductsRoute from './routes/productsRoute';
import CategoriesRoute from './routes/categoriesRoute';
import SuppliersRoute from './routes/suppliersRoute';
import ParentCategoriesRoute from './routes/parent_categoriesRoute'

const env = load({
  API_PORT: String, 
});
const app = express();
const port = env.API_PORT;
const API_VERSION: string = 'v1';

console.log('Starting CATALOG microservice')

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

DB_CONNECT;

app.listen(port, () => {
  console.log(`MS is running at http://localhost:${port}`);
});

app.use(`/${API_VERSION}/products`, ProductsRoute);
app.use(`/${API_VERSION}/categories`, CategoriesRoute);
app.use(`/${API_VERSION}/suppliers`, SuppliersRoute);
app.use(`/${API_VERSION}/parent-categories`, ParentCategoriesRoute);

