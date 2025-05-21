import express from "express";
import errorHandler from "./middleware/error.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.routes";

const app = express();
const PORT = 8000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on "localhost:${PORT}"`);
});
