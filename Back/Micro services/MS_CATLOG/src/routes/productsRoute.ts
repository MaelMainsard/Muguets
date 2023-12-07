import express, { Request, Response } from "express";
import { getAllProducts, getProductByID } from "../controller/productController";
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    getAllProducts(req, res);
})

router.get('/:id', (req: Request, res: Response) => {
    getProductByID(req, res);
})

export default router;