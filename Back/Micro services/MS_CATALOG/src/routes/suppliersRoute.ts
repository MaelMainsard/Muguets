import express, { Request, Response } from "express";
import { getAllSuppliers } from "../controller/supplierController";
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    getAllSuppliers(req, res);
})

export default router;