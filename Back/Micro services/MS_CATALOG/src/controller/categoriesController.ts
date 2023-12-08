import { Request, Response } from "express";
import { pool } from "./database_connection";
import { statusCode } from "./statusCode";
import { QueryResult } from "pg";
import categories from "../models/categories.model";
import categories_parent_category_link from "../models/categories_parent_category_link.model";

export const getAllCategories = async (req: Request, res: Response) => {
    const categoriesReq = await categories.findAll();
    if(categoriesReq.length > 0) {
        res.status(statusCode.STATUS_CODE_OK).send(categoriesReq);
        return
    } else {
        res.status(statusCode.STATUS_CODE_NOT_FOUND).send({
            error: "No product availables"
        });
        return
    }
}

export const getCategoriesFromParentCategoryId = async (req: Request, res: Response) => {
    const id_parent = req.params.parent_id
    const categoriesReq = await categories.findAll({
        include: {
            model: categories_parent_category_link,
            where: { parent_category_id: id_parent },
        }
    });
    if(categoriesReq.length > 0) {
        res.status(statusCode.STATUS_CODE_OK).send(categoriesReq);
        return
    } else {
        res.status(statusCode.STATUS_CODE_NOT_FOUND).send({
            error: "No product availables"
        });
        return
    }

}