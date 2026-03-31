import express, { Router } from "express";
import {
  getCatalog,
  getCatalogById,
  getCatalogByCategory,
  createCatalog,
} from "../controllers/catalogController";

const router: Router = express.Router();

router.get("/", getCatalog);
router.get("/category/:category", getCatalogByCategory);
router.get("/:id", getCatalogById);
router.post("/", createCatalog);

export default router;

