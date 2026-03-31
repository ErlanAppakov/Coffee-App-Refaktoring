import mongoose, { Document, Schema } from 'mongoose';

interface ICategory {
  title: string;
  buttons: string[];
  buttonImages?: Record<string, string>;
  products: Record<string, any>;
}

export interface IProduct extends Document {
  tea: ICategory;
  coffee: ICategory;
  healthy: ICategory;
  vending: ICategory;
}

const categorySchema = new Schema<ICategory>({
  title: String,
  buttons: [String],
  buttonImages: {
    type: Schema.Types.Mixed,
    default: {},
  },
  products: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, { _id: false });

const productSchema = new Schema<IProduct>({
  tea: categorySchema,
  coffee: categorySchema,
  healthy: categorySchema,
  vending: categorySchema,
}, {
  timestamps: true,
});

export default mongoose.model<IProduct>('Product', productSchema);

