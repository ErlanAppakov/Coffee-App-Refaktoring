import mongoose, { Document, Schema } from "mongoose";

export interface IHero extends Document {
  id: number;
  title: string;
  subtitle: string;
  subtitleTwo?: string;
  image: string;
}

const heroSchema = new Schema<IHero>(
  {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    subtitleTwo: String,
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IHero>("Hero", heroSchema);

