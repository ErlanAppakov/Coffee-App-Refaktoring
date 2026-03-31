import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IOrderItem {
  title: string;
  weight: string;
  price: number;
}

interface IOrder {
  id: string;
  date: string;
  status: string;
  deliveryDate?: string;
  items: IOrderItem[];
  delivery?: number;
  subtotal?: number;
  discount?: number;
  total?: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  discount: number;
  orders: IOrder[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const orderItemSchema = new Schema<IOrderItem>({
  title: String,
  weight: String,
  price: Number,
});

const orderSchema = new Schema<IOrder>({
  id: String,
  date: String,
  status: String,
  deliveryDate: String,
  items: [orderItemSchema],
  delivery: Number,
  subtotal: Number,
  discount: Number,
  total: Number,
});

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  phone: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  discount: {
    type: Number,
    default: 10,
  },
  orders: [orderSchema],
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);

