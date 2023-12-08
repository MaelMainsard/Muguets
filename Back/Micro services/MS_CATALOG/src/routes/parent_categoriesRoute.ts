import express, { Request, Response } from "express";
import { getAllParentCategories } from "../controller/parent_categoriesController";
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    getAllParentCategories(req, res);
})

export default router;