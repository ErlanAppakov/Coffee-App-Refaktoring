import { Request, Response } from 'express';
import Hero from "../models/Hero";

export const getHeroContent = async (_req: Request, res: Response): Promise<void> => {
  try {
    const heroes = await Hero.find().sort({ id: 1 });
    res.json(heroes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getHeroById = async (req: Request, res: Response): Promise<void> => {
  try {
    const hero = await Hero.findOne({ id: req.params.id });
    if (!hero) {
      res.status(404).json({ error: "Hero не найден" });
      return;
    }
    res.json(hero);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createHero = async (req: Request, res: Response): Promise<void> => {
  try {
    const hero = await Hero.create(req.body);
    res.status(201).json(hero);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

