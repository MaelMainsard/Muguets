import { Request, Response } from "express";
import { pool } from "./database_connection";
import { statusCode } from "./statusCode";
import { QueryResult } from "pg";
import parent_categories from "../models/parent_categories.model";

export const getAllParentCategories = async (req: Request, res: Response) => {
    const parent_categoriesReq = await parent_categories.findAll();
    if(parent_categoriesReq.length > 0) {
        res.status(statusCode.STATUS_CODE_OK).send(parent_categoriesReq);
        return
    } else {
        res.status(statusCode.STATUS_CODE_NOT_FOUND).send({
            error: "No parent categories availables"
        });
        return
    }
}
