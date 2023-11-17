import { Request, Response } from "express";
import { pool } from "./database_connection";
import { statusCode } from "./statusCode";
import { QueryResult } from "pg";
import { load } from 'ts-dotenv'

const env = load({
    HOST: String,
})

const QUERY_ALL_PRODUCT:string = 'SELECT * from products;'
const QUERY_ALL_PRODUCT_WITH_IMAGES = 'select p.*, f.formats from products as p join files_related_morphs as frm on frm.related_id = p.id;'
const QUERY_PRODUCT_BY_ID = (id: string): string => `select p.*, f.formats from products as p join files_related_morphs as frm on frm.related_id = p.id where p.id = ${id};`
const QUERY_PRODUCT_BY_CATEGORIES = (categories: string[]): string => `select p.*, f.formats from products as p join files_related_morphs as frm on frm.related_id = p.id where p.categories IN (${categories.join(',')});`

type Product = {
    id: string,
    name: string,
    price: string,
    variant_type_name?: string,
    stockTotal: number,
    created_at: string,
    updated_at: string,
    published_at: string,
    url_main_image: string
}

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const productsResponse: Product[] = []
        const products: QueryResult = await pool.query(QUERY_ALL_PRODUCT_WITH_IMAGES);
        if(products.rowCount != null && products.rowCount > 0) {
            products.rows.forEach(product => {
                productsResponse.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    variant_type_name: product.variant_type_name,
                    stockTotal: product.stockTotal,
                    created_at: product.created_at,
                    updated_at: product.updated_at,
                    published_at: product.published_at,
                    url_main_image: `http:${env.HOST}:1338`+product.formats.thumbnail.url
                })
            })
            res.status(statusCode.STATUS_CODE_OK).send(productsResponse);
            return
        } else {
            res.status(statusCode.STATUS_CODE_NOT_FOUND).send({
                error: "No product availables"
            });
            return
        }
    } catch (e) {
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send(e)
        return
    }

}

export const getProductByID = async (req: Request, res: Response) => {
    try {
        const product: QueryResult = await pool.query(QUERY_PRODUCT_BY_ID(req.params.id));  
        if(product.rowCount != null && product.rowCount > 0) {
            const productsResponse: Product = {
                id: product.rows[0].id,
                name: product.rows[0].name,
                price: product.rows[0].price,
                variant_type_name: product.rows[0].variant_type_name,
                stockTotal: product.rows[0].stockTotal,
                created_at: product.rows[0].created_at,
                updated_at: product.rows[0].updated_at,
                published_at: product.rows[0].published_at,
                url_main_image: `http:${env.HOST}:1338` + product.rows[0].formats.thumbnail.url
            };
            res.status(statusCode.STATUS_CODE_OK).send(productsResponse)
            return
        } else {
            res.status(statusCode.STATUS_CODE_NOT_FOUND).send({
                error: "No product for this id"
            })
        }
    } catch (e) {
        res.status(statusCode.STATUS_CODE_BAD_REQUEST).send(e)
    }
    return
}

