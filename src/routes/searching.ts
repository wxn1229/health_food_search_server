import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import {
  OrderByConditions,
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
    page,
    orderBy,
    orderDir,
  } = req.body;

  let queryHealthFoodConditions: QueryHealthFoodConditions = {};
  let queryIngredientConditions: QueryIngredientConditions = {};
  let queryBenefitConditions: QueryBenefitConditions = {};
  let orderByConditions: OrderByConditions = {};

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
  if (orderBy && orderBy.trim() !== "") {
    if (orderBy === "id") {
      orderByConditions.Id = orderDir;
    } else if (orderBy === "score") {
      orderByConditions.CurPoint = orderDir;
    } else if (orderBy === "date") {
      orderByConditions.AcessDate = orderDir;
    } else if (orderBy === "commentNumber") {
      orderByConditions.CurCommentNum = orderDir;
    }
  }

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
        ImgUrl: true,
        Applicant: {
          select: {
            Name: true,
          },
        },
        CF: {
          select: {
            Id: true,
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
      orderBy: {
        ...orderByConditions,
      },

      take: 12,
      skip: 12 * (page - 1),
    });
    const count = await prisma.healthFood.count({
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
    });

    res.json({ code: 200, results, count: Math.ceil(count / 12) });
  } catch (e) {
    console.log(e);
  }
});

router.post("/getCommentDataById", async (req, res) => {
  const { hfId } = req.body;

  const result = await prisma.healthFood.findUnique({
    where: {
      Id: hfId,
    },
    select: {
      CurCommentNum: true,
      CurPoint: true,
    },
  });

  res.json({ code: 200, result });
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
          Id: true,
          Name: true,
        },
      },
    },
  });

  res.json({ code: 200, result });
});

export { router as SearchingRoute };
