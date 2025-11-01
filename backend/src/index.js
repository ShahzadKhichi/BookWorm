import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./lib/dbConnect.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

//routes imports
import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";

//routes added
app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);

app.get("/", (req, res) =>
  res.json({
    success: true,
    status: "server running",
  })
);
app.listen(PORT, async () => {
  await connectDB();
  console.log(`server is listening on port: ${PORT}`);
});

export default app;
