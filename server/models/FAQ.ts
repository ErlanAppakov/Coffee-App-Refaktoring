import mongoose, { Document, Schema } from "mongoose";

export interface IFAQ extends Document {
  id: number;
  question: string;
  answer: string;
}

const faqSchema = new Schema<IFAQ>(
  {
    id: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFAQ>("FAQ", faqSchema);

