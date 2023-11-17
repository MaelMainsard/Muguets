import { Request, Response } from "express";
import { pool } from "./database_connection";
import { statusCode } from "./statusCode";
import { QueryResult } from "pg";

const QUERY_ALL_CATEGORIES : string = 'SELECT * from categories;'

export const getAllCategories = async (req: Request, res: Response) => {
    const categories: QueryResult = await pool.query(QUERY_ALL_CATEGORIES);
    res.status(statusCode.STATUS_CODE_OK).send(categories.rows)
    return
}