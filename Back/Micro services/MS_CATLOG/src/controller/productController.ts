import { Request, Response } from "express";
import { pool } from "./database_connection";
import { statusCode } from "./statusCode";
import { QueryResult } from "pg";
import { load } from 'ts-dotenv'
import { off } from "process";
import products  from "../models/products.model";
import files_related_morphs from "../models/files_related_morphs.model";
import files from "../models/files.model";
import products_category_link from "../models/products_category_link.model";


const env = load({
    HOST: String,
    STRAPI_HOST: String
})



type Product = {
    id: number,
    name: string,
    price: number,
    stock: number,
    created_at: string,
    updated_at: string,
    published_at: string,
    url_main_image: string
}

const regexInteger = /[0-9]/;

export const getAllProducts = async (req: Request, res: Response) => {
    let whereClause = {};
    try {
        let offset = 0;
        
        if(req.query.offset != undefined) {
            if(!regexInteger.test(req.query.offset as string)) {
                res.status(statusCode.STATUS_CODE_BAD_REQUEST).send({
                    error: "offset should be an integer"
                });
                return;
            }
            offset = parseInt(req.query.offset.toString());
        }
        if(req.query.idCategory != undefined) {
            whereClause = {
                model: products_category_link,
                where: { category_id: req.query.idCategory },
            };
        }
        
        const productsResponse: Product[] = []
        const productsReq = await products.findAll({
            include: [
                {
                  model: files,
                },
                whereClause
              ],
              offset: offset,
              limit: 60,
              order: [['created_at', 'ASC']],
        });
        productsReq.forEach(product => {
            productsResponse.push({
                id: product.id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                created_at: product.created_at.toString(),
                updated_at: product.updated_at.toString(),
                published_at: product.published_at.toString(),
                url_main_image: `${env.STRAPI_HOST}${(product.Files[0].formats as any)['thumbnail']['url'] as string}`
            }
            )
        })
        if(productsReq.length > 0) {
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
        const idProduct = req.params.id
        const productReq = await products.findByPk(idProduct, {include: [
            {
              model: files,
            },
          ],})
        if(productReq != null) {
        const product: Product = {
            id: productReq.id,
            name: productReq.name,
            price: productReq.price,
            stock: productReq.stock,
            created_at: productReq.created_at.toString(),
            updated_at: productReq.updated_at.toString(),
            published_at: productReq.published_at.toString(),
            url_main_image: `${env.STRAPI_HOST}${(productReq.Files[0].formats as any)['thumbnail']['url'] as string}`
        }
            res.status(statusCode.STATUS_CODE_OK).send(product)
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

