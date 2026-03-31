import { Request, Response } from 'express';
import User from "../models/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/database';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ error: "Пользователь с таким email уже существует" });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "user",
      discount: 10,
      orders: [],
    });

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      avatar: user.avatar || '',
      role: user.role,
      discount: user.discount,
      orders: user.orders,
      token,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Неверный email или пароль" });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Неверный email или пароль" });
      return;
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      avatar: user.avatar || '',
      role: user.role,
      discount: user.discount,
      orders: user.orders,
      token,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }
    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      avatar: user.avatar || '',
      role: user.role,
      discount: user.discount,
      orders: user.orders,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { avatar, ...otherData } = req.body;
    
    if (avatar && typeof avatar === 'string') {
      if (avatar.length > 10 * 1024 * 1024) { // 10MB base64 примерно = 7-8MB изображение
        res.status(400).json({ error: "Изображение слишком большое. Пожалуйста, используйте изображение меньшего размера (рекомендуется до 5MB)" });
        return;
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }

    res.json(user);
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message || "Ошибка при обновлении пользователя" });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Текущий и новый пароль обязательны" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Неверный текущий пароль" });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Пароль успешно изменен" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const clearOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }

    user.orders = [];
    await user.save();

    res.json({
      message: "История заказов успешно удалена",
      orders: [],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.json(users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      avatar: user.avatar || '',
      role: user.role,
      discount: user.discount,
      ordersCount: user.orders.length,
    })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const resetUserPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 4) {
      res.status(400).json({ error: "Пароль должен содержать минимум 4 символа" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    res.json({ message: "Пароль успешно сброшен" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      res.status(400).json({ error: "Роль должна быть 'user' или 'admin'" });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      avatar: user.avatar || '',
      role: user.role,
      discount: user.discount,
      orders: user.orders,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { items, delivery } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Товары обязательны" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }

    const orderItems = items.map((item: any) => ({
      title: `${item.quantity} x ${item.title}`,
      weight: item.weight,
      price: item.price,
    }));

    const subtotal = items.reduce((sum: number, item: any) => sum + item.price, 0);
    
    const discount = items.reduce((sum: number, item: any) => {
      if (item.discount) {
        return sum + item.price * (user.discount / 100);
      }
      return sum;
    }, 0);

    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      status: 'не оплачено',
      deliveryDate: '',
      items: orderItems,
      delivery: delivery || 0,
      subtotal: subtotal,
      discount: discount,
      total: subtotal - discount + (delivery || 0),
    };

    user.orders.push(newOrder);
    await user.save();

    res.json({
      message: "Заказ успешно создан",
      order: newOrder,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
