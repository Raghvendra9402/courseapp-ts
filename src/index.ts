import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter";
import adminRouter from "./routes/adminRouter";
import dotenv from "dotenv";

dotenv.config();
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}
mongoose.connect(process.env.DATABASE_URL).then(() => {console.log("database is connected");
})
const app = express();
app.use(express.json())

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin",adminRouter);


app.listen(3000, () => {console.log("listening on port 3000");
})