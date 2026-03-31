import mongoose, { Document, Schema } from "mongoose";

interface IContentItem {
  type: "description" | "text" | "image" | "subtitle";
  data: string;
}

interface IMethod {
  id: string;
  educationTabBtnName: string;
  icon: string;
  title: string;
  content: IContentItem[];
}

export interface IBlog extends Document {
  methods: IMethod[];
}

const contentItemSchema = new Schema<IContentItem>(
  {
    type: {
      type: String,
      enum: ["description", "text", "image", "subtitle"],
    },
    data: String,
  },
  { _id: false }
);

const methodSchema = new Schema<IMethod>(
  {
    id: String,
    educationTabBtnName: String,
    icon: String,
    title: String,
    content: [contentItemSchema],
  },
  { _id: false }
);

const blogSchema = new Schema<IBlog>(
  {
    methods: [methodSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBlog>("Blog", blogSchema);

