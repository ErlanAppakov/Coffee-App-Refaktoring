import express, { Router } from "express";
import {
  getFAQs,
  getFAQById,
  createFAQ,
} from "../controllers/faqController";

const router: Router = express.Router();

router.get("/", getFAQs);
router.get("/:id", getFAQById);
router.post("/", createFAQ);

export default router;

