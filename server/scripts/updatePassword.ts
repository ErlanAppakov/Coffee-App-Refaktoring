import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User";

dotenv.config();

const updateUserPassword = async (email: string, newPassword: string): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/coffee-app"
    );
    console.log("✅ MongoDB Connected");

    const user = await User.findOne({ email });
    if (!user) {
      console.error(`❌ Пользователь с email ${email} не найден`);
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    console.log(`✅ Пароль для ${email} успешно обновлен`);
    console.log(`   Новый пароль (не хешированный): ${newPassword}`);
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Ошибка:", error.message);
    process.exit(1);
  }
};

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log("Использование: npm run update-password <email> <новый_пароль>");
  console.log("Пример: npm run update-password user@example.com mypassword123");
  process.exit(1);
}

updateUserPassword(email, password);

