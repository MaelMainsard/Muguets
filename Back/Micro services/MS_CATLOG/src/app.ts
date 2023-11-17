import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

import { statusCode } from './controller/statusCode';
import { DB_CONNECT } from './controller/database_connection'
import { Pool } from 'pg';
import { dbConfig } from "./config";
import cors from 'cors';
import { pool } from './controller/database_connection'
import ProductsRoute from './routes/productsRoute';
import CategoriesRoute from './routes/categoriesRoute';
import SuppliersRoute from './routes/suppliersRoute';

const app = express();
const port = 3002;
const API_VERSION: string = 'v1';

console.log('Starting CATALOG microservice')

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

DB_CONNECT;

app.listen(port, () => {
  console.log(`MS is running at http://localhost:${port}`);
});

app.use(`/${API_VERSION}/products`, ProductsRoute);
app.use(`/${API_VERSION}/categories`, CategoriesRoute);
app.use(`/${API_VERSION}/suppliers`, SuppliersRoute);

