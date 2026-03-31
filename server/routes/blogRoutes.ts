import express, { Router } from "express";
import {
  getBlogMethods,
  getBlogMethodById,
  createOrUpdateBlog,
} from "../controllers/blogController";

const router: Router = express.Router();

router.get("/", getBlogMethods);
router.get("/:id", getBlogMethodById);
router.post("/", createOrUpdateBlog);

export default router;

