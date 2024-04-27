import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$connect().catch((err) => {
  console.log("🚀 ~ err:", err);
});

const router = Router();

router.get("/test", (req, res) => {
  res.json({ code: 200, dec: "this is searchsetting router" });
});

router.get("/applicant", async (req, res) => {
  const result = await prisma.applicant.findMany();

  res.json({
    code: 200,
    data: result,
  });
});

router.get("/certification", async (req, res) => {
  const result = await prisma.certification.findMany();

  res.json({
    code: 200,
    data: result,
  });
});

router.get("/ingredient", async (req, res) => {
  const result = await prisma.ingredient.findMany();

  res.json({
    code: 200,
    data: result,
  });
});

router.get("/benefit", async (req, res) => {
  const result = await prisma.benefits.findMany();

  res.json({
    code: 200,
    data: result,
  });
});

export { router as SearchSettingRoute };
