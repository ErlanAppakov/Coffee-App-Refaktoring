import { Request, Response } from 'express';
import Catalog from "../models/Catalog";

export const getCatalog = async (_req: Request, res: Response): Promise<void> => {
  try {
    const catalogs = await Catalog.find().sort({ id: 1 });
    res.json(catalogs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCatalogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const catalog = await Catalog.findById(req.params.id);
    if (!catalog) {
      res.status(404).json({ error: "Каталог не найден" });
      return;
    }
    res.json(catalog);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCatalogByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const catalogs = await Catalog.find({ category: req.params.category });
    res.json(catalogs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createCatalog = async (req: Request, res: Response): Promise<void> => {
  try {
    const catalog = await Catalog.create(req.body);
    res.status(201).json(catalog);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

