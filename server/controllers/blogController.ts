import { Request, Response } from 'express';
import Blog from "../models/Blog";

export const getBlogMethods = async (_req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findOne();
    if (!blog) {
      res.json({ methods: [] });
      return;
    }
    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBlogMethodById = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findOne();
    if (!blog) {
      res.status(404).json({ error: "Блог не найден" });
      return;
    }

    const method = blog.methods.find((m) => m.id === req.params.id);
    if (!method) {
      res.status(404).json({ error: "Метод не найден" });
      return;
    }

    res.json(method);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrUpdateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

