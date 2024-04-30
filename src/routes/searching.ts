import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import {
  QueryBenefitConditions,
  QueryHealthFoodConditions,
  QueryIngredientConditions,
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
  let queryIngredientConditions: QueryIngredientConditions = {};
  let queryBenefitConditions: QueryBenefitConditions = {};

  // 添加條件，如果值存在且不為空字符串
  if (keypoint && keypoint.trim() !== "")
    queryHealthFoodConditions.Name = { contains: keypoint };
  if (id && id.trim() !== "") queryHealthFoodConditions.Id = id;
  if (applicant && applicant.trim() !== "")
    queryHealthFoodConditions.ApplicantId = applicant;
  if (certification && certification.trim() !== "")
    queryHealthFoodConditions.CFId = certification;
  if (ingredient && ingredient.trim() !== "")
    queryIngredientConditions.IGId = ingredient;
  if (benefit && benefit.trim() !== "") queryBenefitConditions.BFId = benefit;
  // if (start_rate_point !== undefined)
  //   queryConditions.ratePoint = { gte: start_rate_point };
  // if (end_rate_point !== undefined)
  //   queryConditions.ratePoint = {
  //     ...queryConditions.ratePoint,
  //     lte: end_rate_point,
  //   };

  // // 處理日期範圍條件
  if (start_date && end_date) {
    queryHealthFoodConditions.AcessDate = {
      gte: new Date(start_date.year, start_date.month - 1, start_date.day),
      lte: new Date(end_date.year, end_date.month - 1, end_date.day),
    };
  }

  try {
    const results = await prisma.healthFood.findMany({
      where: {
        ...queryHealthFoodConditions,

        HF_and_Ingredient: {
          some: {
            ...queryIngredientConditions,
          },
        },
        HF_and_BF: {
          some: { ...queryBenefitConditions },
        },
      },
      select: {
        Id: true,
        Name: true,
        AcessDate: true,
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
        HF_and_BF: {
          select: {
            BF: true,
          },
        },
        HF_and_Ingredient: {
          select: {
            IG: true,
          },
        },
      },
      take: 20,
    });
    res.json({ code: 200, results });
  } catch (e) {
    console.log(e);
  }
});

router.get("/searchById/:id", async (req, res) => {
  const Id = req.params.id;

  const result = await prisma.healthFood.findUnique({
    where: {
      Id,
    },
    include: {
      HF_and_BF: {
        select: {
          BF: {
            select: {
              Name: true,
            },
          },
        },
      },
      HF_and_Ingredient: {
        select: {
          IG: {
            select: {
              Name: true,
              EnglishName: true,
            },
          },
        },
      },
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
  });

  res.json({ code: 200, result });
});

export { router as SearchingRoute };
