import express, { Router } from 'express';
import {
  getProducts,
  getProductsByCategory,
  createOrUpdateProducts,
} from '../controllers/productController';

const router: Router = express.Router();

router.get('/', getProducts);
router.get('/:category', getProductsByCategory);
router.post('/', createOrUpdateProducts);

export default router;

