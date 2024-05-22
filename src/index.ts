import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { SearchSettingRoute } from "./routes/searchSetting";
import { SearchingRoute } from "./routes/searching";
import { UserRoute } from "./routes/user";

const prisma = new PrismaClient();
prisma.$connect().catch((err) => {
  console.log("🚀 ~ err:", err);
});

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.json({
    code: 200,
    Info: "sucess post",
  });
});

app.get("/prisma", async (req, res) => {
  const result = await prisma.healthFood.findMany({
    take: 5,
  });
  res.json({ code: 200, data: result });
});

app.use("/api/searchsetting", SearchSettingRoute);

app.use("/api/searching", SearchingRoute);

app.use("/api/user", UserRoute);

app.listen(3003, () => {
  console.log("sever listening 3003");
});

export default app;
