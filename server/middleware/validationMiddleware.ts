import { Request, Response, NextFunction } from 'express';

export const validationMiddleware = (schema: Record<string, any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} обязательное поле`);
      }
      
      if (value !== undefined && value !== null && rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} должен содержать минимум ${rules.minLength} символов`);
      }
      
      if (value !== undefined && value !== null && rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} должен содержать максимум ${rules.maxLength} символов`);
      }
      
      if (value !== undefined && value !== null && rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push(`${field} должен быть валидным email`);
      }
    }
    
    if (errors.length > 0) {
      res.status(400).json({ error: errors.join(', ') });
      return;
    }
    
    next();
  };
};
