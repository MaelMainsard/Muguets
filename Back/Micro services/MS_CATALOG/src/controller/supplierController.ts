import { Request, Response } from "express";
import { pool } from "./database_connection";
import { statusCode } from "./statusCode";
import { QueryResult } from "pg";

const QUERY_ALL_SUPPLIERS : string = 'SELECT * from suppliers;'

export const getAllSuppliers = async (req: Request, res: Response) => {
    const suppliers: QueryResult = await pool.query(QUERY_ALL_SUPPLIERS);
    res.status(statusCode.STATUS_CODE_OK).send(suppliers.rows)
    return
}