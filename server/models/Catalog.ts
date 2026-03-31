import mongoose, { Document, Schema } from "mongoose";

export interface ICatalog extends Document {
  id: number;
  image: string;
  title: string;
  category: "coffee" | "tea" | "vending" | "healthy";
}

const catalogSchema = new Schema<ICatalog>(
  {
    id: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["coffee", "tea", "vending", "healthy"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICatalog>("Catalog", catalogSchema);

