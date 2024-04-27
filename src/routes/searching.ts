import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import {
  QueryHealthFoodConditions,
  SearchRequest,
} from "../types/SearchRequest";

const prisma = new PrismaClient();

prisma.$connect().catch((err) => {
  console.log("🚀 ~ err:", err);
});

const router = Router();

router.get("/test", (req, res) => {
  res.json({ code: 200, dec: "test api/searching" });
});

router.post("/multisearching", async (req, res) => {
  const {
    keypoint,
    id,
    start_date,
    end_date,
    applicant,
    certification,
    ingredient,
    benefit,
    start_rate_point,
    end_rate_point,
  } = req.body;

  let queryHealthFoodConditions: QueryHealthFoodConditions = {};

  // 添加條件，如果值存在且不為空字符串
  if (keypoint && keypoint.trim() !== "")
    queryHealthFoodConditions.Name = keypoint;
  if (id && id.trim() !== "") queryHealthFoodConditions.Id = id;
  if (applicant && applicant.trim() !== "")
    queryHealthFoodConditions.ApplicantId = applicant;
  if (certification && certification.trim() !== "")
    queryHealthFoodConditions.CFId = certification;
  // if (ingredient && ingredient.trim() !== "")
  //   queryConditions.ingredient = ingredient;
  // if (benefit && benefit.trim() !== "") queryConditions.benefit = benefit;
  // if (start_rate_point !== undefined)
  //   queryConditions.ratePoint = { gte: start_rate_point };
  // if (end_rate_point !== undefined)
  //   queryConditions.ratePoint = {
  //     ...queryConditions.ratePoint,
  //     lte: end_rate_point,
  //   };

  // // 處理日期範圍條件
  // if (start_date && end_date) {
  //   queryConditions.createdAt = {
  //     gte: new Date(start_date.year, start_date.month - 1, start_date.day),
  //     lte: new Date(end_date.year, end_date.month - 1, end_date.day),
  //   };
  // }

  try {
    const results = await prisma.healthFood.findMany({
      where: queryHealthFoodConditions,
      select: {
        Name: true,
        Applicant: {
          select: {
            Name: true,
          },
        },
        CF: {
          select: {
            Name: true,
          },
        },
      },
      take: 2,
    });
    res.json({ code: 200, results });
  } catch (e) {
    console.log(e);
  }
});

export { router as SearchingRoute };
