import express, { Request, Response } from "express";
import { getAllCategories, getCategoriesFromParentCategoryId } from "../controller/categoriesController";
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    getAllCategories(req, res);
})

router.get('/:parent_id', (req: Request, res: Response) => {
    getCategoriesFromParentCategoryId(req, res);
})

export default router;