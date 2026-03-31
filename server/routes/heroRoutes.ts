import express, { Router } from 'express';
import {
  getHeroContent,
  getHeroById,
  createHero,
} from '../controllers/heroController';

const router: Router = express.Router();

router.get('/', getHeroContent);
router.get('/:id', getHeroById);
router.post('/', createHero);

export default router;

