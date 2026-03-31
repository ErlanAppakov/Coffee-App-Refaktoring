import { Request, Response } from 'express';
import Product from "../models/Product";

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.findOne();
    if (!products) {
      res.json({
        tea: { title: "", buttons: [], products: {} },
        coffee: { title: "", buttons: [], products: {} },
        healthy: { title: "", buttons: [], products: {} },
        vending: { title: "", buttons: [], products: {} },
      });
      return;
    }

    // В данной структуре (один документ на все товары) пагинация на бэкенде 
    // через MongoDB skip/limit невозможна напрямую для вложенных объектов.
    // Но мы можем имитировать её для фронтенда или переделать структуру.
    // Для текущей задачи оставим как есть, так как структура "один документ" 
    // подразумевает загрузку всего объекта.
    
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const products = await Product.findOne();

    if (!products || !(products as any)[category]) {
      res.status(404).json({ error: "Категория не найдена" });
      return;
    }

    res.json((products as any)[category]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrUpdateProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
