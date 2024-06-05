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
    origin: [
      "http://localhost:3000",
      "https://health-food-search-system-client.vercel.app",
      "https://health-food-search-system-client-wxn1229s-projects.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "https://health-food-search-system-client-wxn1229s-projects.vercel.app"
  );
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
