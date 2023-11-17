import express, { Request, Response } from "express";
import { getAllCategories } from "../controller/categoriesController";
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    getAllCategories(req, res);
})

export default router;