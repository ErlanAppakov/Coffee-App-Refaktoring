import { Request, Response } from 'express';
import FAQ from "../models/FAQ";

export const getFAQs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const faqs = await FAQ.find().sort({ id: 1 });
    res.json(faqs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getFAQById = async (req: Request, res: Response): Promise<void> => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      res.status(404).json({ error: "FAQ не найден" });
      return;
    }
    res.json(faq);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json(faq);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

