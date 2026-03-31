import mongoose from "mongoose";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createRequire } from "module";

import User from "../models/User";
import Product from "../models/Product";
import FAQ from "../models/FAQ";
import Blog from "../models/Blog";
import Hero from "../models/Hero";
import Catalog from "../models/Catalog";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/coffee-app"
    );
    console.log("MongoDB Connected");
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const importUsers = async (): Promise<void> => {
  try {
    const usersData = JSON.parse(
      readFileSync(join(__dirname, "../../data/users.json"), "utf8")
    );

    await User.deleteMany({});

    for (const userData of usersData) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`User imported: ${userData.email}`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }

    console.log("Users imported successfully");
  } catch (error: any) {
    console.error("Error importing users:", error);
  }
};

const importProducts = async (): Promise<void> => {
  try {
    const productsData = JSON.parse(
      readFileSync(join(__dirname, "../../data/products.json"), "utf8")
    );

    await Product.deleteMany({});

    const productDoc = productsData;

    await Product.create(productDoc);
    console.log("Products imported successfully");
  } catch (error: any) {
    console.error("Error importing products:", error);
  }
};

const importFAQ = async (): Promise<void> => {
  try {
    const faqData = JSON.parse(
      readFileSync(join(__dirname, "../../data/faq.json"), "utf8")
    );

    await FAQ.deleteMany({});

    await FAQ.insertMany(faqData);
    console.log("FAQ imported successfully");
  } catch (error: any) {
    console.error("Error importing FAQ:", error);
  }
};

const importBlog = async (): Promise<void> => {
  try {
    const blogData = JSON.parse(
      readFileSync(join(__dirname, "../../data/BlogCoffeeData.json"), "utf8")
    );

    await Blog.deleteMany({});

    await Blog.create(blogData);
    console.log("Blog imported successfully");
  } catch (error: any) {
    console.error("Error importing blog:", error);
  }
};

const importHero = async (): Promise<void> => {
  try {
    const heroData = JSON.parse(
      readFileSync(join(__dirname, "../../data/hero-content.json"), "utf8")
    );

    await Hero.deleteMany({});

    await Hero.insertMany(heroData);
    console.log("Hero content imported successfully");
  } catch (error: any) {
    console.error("Error importing hero:", error);
  }
};

const importCatalog = async (): Promise<void> => {
  try {
    const catalogData = JSON.parse(
      readFileSync(join(__dirname, "../../data/catalog-products-list.json"), "utf8")
    );

    await Catalog.deleteMany({});

    await Catalog.insertMany(catalogData);
    console.log("Catalog imported successfully");
  } catch (error: any) {
    console.error("Error importing catalog:", error);
  }
};

const importAll = async (): Promise<void> => {
  await connectDB();

  console.log("Starting data import...");

  await importUsers();
  await importProducts();
  await importFAQ();
  await importBlog();
  await importHero();
  await importCatalog();

  console.log("All data imported successfully!");
  process.exit(0);
};

importAll();

