import { Router } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { authenticateToken, RequestWithUser } from "../utils/AuthToken";

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
router.post("/AcById", async (req, res) => {
  const { Id } = req.body;
  const result = await prisma.applicant.findUnique({
    where: {
      Id: Id,
    },
  });

  res.json({
    code: 200,
    data: result,
  });
});

router.patch(
  "/editAc",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const isAuth = await prisma.user.findUnique({
          where: {
            Id: req.tokenInfo.userId,
          },
          select: {
            isSuperAccount: true,
          },
        });

        if (isAuth?.isSuperAccount) {
          const { acId, name } = req.body;
          const editAc = await prisma.applicant.update({
            where: {
              Id: acId,
            },
            data: {
              Name: name,
            },
          });
          res
            .status(200)
            .json({ message: "success edit certification", editAc });
        } else {
          res.status(401).send("is not SuperAccount");
        }
      }
    } catch (error) {
      res.status(500).send("server error");
    }
  }
);

router.get("/getLastAcId", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
    SELECT * FROM \`applicant\`
    WHERE LENGTH(\`id\`) = (
      SELECT MAX(LENGTH(\`id\`)) FROM \`applicant\`
    )
    ORDER BY \`id\` DESC
    LIMIT 1
  `;
    res.status(200).json({ result });
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
  }
});

router.post(
  "/createAc",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const isAuth = await prisma.user.findUnique({
          where: {
            Id: req.tokenInfo.userId,
          },
          select: {
            isSuperAccount: true,
          },
        });

        if (isAuth?.isSuperAccount) {
          const { acId, name } = req.body;
          const createAc = await prisma.applicant.create({
            data: {
              Id: acId,
              Name: name,
            },
          });
          res
            .status(200)
            .json({ message: "success create a certification", createAc });
        } else {
          res.status(401).send("is not SuperAccount");
        }
      }
    } catch (error) {
      res.status(500).send("server error"); }
  }
);

router.post(
  "/deleteAc",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const isAuth = await prisma.user.findUnique({
          where: {
            Id: req.tokenInfo.userId,
          },
          select: {
            isSuperAccount: true,
          },
        });

        if (isAuth?.isSuperAccount) {
          const { acId } = req.body;
          const isExist = await prisma.healthFood.findFirst({
            where: {
              ApplicantId: acId,
            },
          });
          if (isExist) {
            return res.status(403).send("is Exist");
          }
          const deleteAc = await prisma.applicant.delete({
            where: {
              Id: acId,
            },
          });
          res.status(201).json({ message: "success delete a certification" });
        } else {
          res.status(401).send("is not SuperAccount");
        }
      }
    } catch (error) {
      res.status(500).send("server error");
    }
  }
);

router.get("/certification", async (req, res) => {
  const result = await prisma.certification.findMany();

  res.json({
    code: 200,
    data: result,
  });
});

router.post("/certificationById", async (req, res) => {
  const { Id } = req.body;
  const result = await prisma.certification.findUnique({
    where: {
      Id: Id,
    },
  });

  res.json({
    code: 200,
    data: result,
  });
});

router.patch(
  "/editCer",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const isAuth = await prisma.user.findUnique({
          where: {
            Id: req.tokenInfo.userId,
          },
          select: {
            isSuperAccount: true,
          },
        });

        if (isAuth?.isSuperAccount) {
          const { cerId, name } = req.body;
          const editCer = await prisma.certification.update({
            where: {
              Id: cerId,
            },
            data: {
              Name: name,
            },
          });
          res
            .status(200)
            .json({ message: "success edit certification", editCer });
        } else {
          res.status(401).send("is not SuperAccount");
        }
      }
    } catch (error) {
      res.status(500).send("server error");
    }
  }
);

router.get("/getLastCerId", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
    SELECT * FROM \`certification\`
    WHERE LENGTH(\`id\`) = (
      SELECT MAX(LENGTH(\`id\`)) FROM \`certification\`
    )
    ORDER BY \`id\` DESC
    LIMIT 1
  `;
    res.status(200).json({ result });
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
  }
});
router.post(
  "/createCer",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const isAuth = await prisma.user.findUnique({
          where: {
            Id: req.tokenInfo.userId,
          },
          select: {
            isSuperAccount: true,
          },
        });

        if (isAuth?.isSuperAccount) {
          const { cerId, name } = req.body;
          const createCer = await prisma.certification.create({
            data: {
              Id: cerId,
              Name: name,
            },
          });
          res
            .status(200)
            .json({ message: "success create a certification", createCer });
        } else {
          res.status(401).send("is not SuperAccount");
        }
      }
    } catch (error) {
      res.status(500).send("server error");
    }
  }
);

router.post(
  "/deleteCer",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const isAuth = await prisma.user.findUnique({
          where: {
            Id: req.tokenInfo.userId,
          },
          select: {
            isSuperAccount: true,
          },
        });

        if (isAuth?.isSuperAccount) {
          const { cerId } = req.body;
          const isExist = await prisma.healthFood.findFirst({
            where: {
              CFId: cerId,
            },
          });
          if (isExist) {
            return res.status(403).send("is Exist");
          }
          const deleteCer = await prisma.certification.delete({
            where: {
              Id: cerId,
            },
          });
          res.status(201).json({ message: "success delete a certification" });
        } else {
          res.status(401).send("is not SuperAccount");
        }
      }
    } catch (error) {
      res.status(500).send("server error");
    }
  }
);

router.get("/ingredient", async (req, res) => {
  const result = await prisma.ingredient.findMany();

  res.json({
    code: 200,
    data: result,
  });
});

router.post("/IgById", async (req, res) => {
  const { Id } = req.body;
  const result = await prisma.ingredient.findUnique({
    where: {
      Id: Id,
    },
  });

  res.json({
    code: 200,
    data: result,
  });
});

router.patch(
  "/editIg",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const isAuth = await prisma.user.findUnique({
          where: {
            Id: req.tokenInfo.userId,
          },
          select: {
            isSuperAccount: true,
          },
        });

        if (isAuth?.isSuperAccount) {
          const { igId, name, englishName } = req.body;
          const editIg = await prisma.ingredient.update({
            where: {
              Id: igId,
            },
            data: {
              Name: name,
              EnglishName: englishName,
            },
          });
          res
            .status(200)
            .json({ message: "success edit certification", editIg });
        } else {
          res.status(401).send("is not SuperAccount");
        }
      }
    } catch (error) {
      res.status(500).send("server error");
    }
  }
);

router.get("/getLastIgId", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
    SELECT * FROM \`ingredient\`
    WHERE LENGTH(\`id\`) = (
      SELECT MAX(LENGTH(\`id\`)) FROM \`ingredient\`
    )
    ORDER BY \`id\` DESC
    LIMIT 1
  `;
    res.status(200).json({ result });
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
  }
});
router.post(
  "/createIg",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const isAuth = await prisma.user.findUnique({
          where: {
            Id: req.tokenInfo.userId,
          },
          select: {
            isSuperAccount: true,
          },
        });

        if (isAuth?.isSuperAccount) {
          const { igId, name, englishName } = req.body;
          const createIg = await prisma.ingredient.create({
            data: {
              Id: igId,
              Name: name,
              EnglishName: englishName,
            },
          });
          res
            .status(200)
            .json({ message: "success create a certification", createIg });
        } else {
          res.status(401).send("is not SuperAccount");
        }
      }
    } catch (error) {
      res.status(500).send("server error");
    }
  }
);

router.post(
  "/deleteIg",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const isAuth = await prisma.user.findUnique({
          where: {
            Id: req.tokenInfo.userId,
          },
          select: {
            isSuperAccount: true,
          },
        });

        if (isAuth?.isSuperAccount) {
          const { igId } = req.body;
          const isExist = await prisma.healthFood.findFirst({
            where: {
              HF_and_Ingredient: {
                some: {
                  IGId: igId,
                },
              },
            },
          });
          if (isExist) {
            return res.status(403).send("is Exist");
          }
          const deleteIg = await prisma.ingredient.delete({
            where: {
              Id: igId,
            },
          });
          res.status(201).json({ message: "success delete a certification" });
        } else {
          res.status(401).send("is not SuperAccount");
        }
      }
    } catch (error) {
      res.status(500).send("server error");
    }
  }
);

router.get("/benefit", async (req, res) => {
  const result = await prisma.benefits.findMany();

  res.json({
    code: 200,
    data: result,
  });
});
router.post("/BfById", async (req, res) => {
  const { Id } = req.body;
  const result = await prisma.benefits.findUnique({
    where: {
      Id: Id,
    },
  });

  res.json({
    code: 200,
    data: result,
  });
});

router.patch(
  "/editBf",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const isAuth = await prisma.user.findUnique({
          where: {
            Id: req.tokenInfo.userId,
          },
          select: {
            isSuperAccount: true,
          },
        });

        if (isAuth?.isSuperAccount) {
          const { bfId, name } = req.body;
          const editbf = await prisma.benefits.update({
            where: {
              Id: bfId,
            },
            data: {
              Name: name,
            },
          });
          res
            .status(200)
            .json({ message: "success edit certification", editbf });
        } else {
          res.status(401).send("is not SuperAccount");
        }
      }
    } catch (error) {
      res.status(500).send("server error");
    }
  }
);

router.get("/getLastBfId", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
    SELECT * FROM \`benefits\`
    WHERE LENGTH(\`id\`) = (
      SELECT MAX(LENGTH(\`id\`)) FROM \`benefits\`
    )
    ORDER BY \`id\` DESC
    LIMIT 1
  `;
    res.status(200).json({ result });
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
  }
});

router.post(
  "/createBf",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const isAuth = await prisma.user.findUnique({
          where: {
            Id: req.tokenInfo.userId,
          },
          select: {
            isSuperAccount: true,
          },
        });

        if (isAuth?.isSuperAccount) {
          const { bfId, name } = req.body;
          const createBf = await prisma.benefits.create({
            data: {
              Id: bfId,
              Name: name,
            },
          });
          res
            .status(200)
            .json({ message: "success create a certification", createBf });
        } else {
          res.status(401).send("is not SuperAccount");
        }
      }
    } catch (error) {
      res.status(500).send("server error");
    }
  }
);

router.post(
  "/deleteBf",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const isAuth = await prisma.user.findUnique({
          where: {
            Id: req.tokenInfo.userId,
          },
          select: {
            isSuperAccount: true,
          },
        });

        if (isAuth?.isSuperAccount) {
          const { bfId } = req.body;
          const isExist = await prisma.healthFood.findFirst({
            where: {
              HF_and_BF: {
                some: {
                  BFId: bfId,
                },
              },
            },
          });
          if (isExist) {
            return res.status(403).send("is Exist");
          }
          const deleteBf = await prisma.benefits.delete({
            where: {
              Id: bfId,
            },
          });
          res.status(201).json({ message: "success delete a certification" });
        } else {
          res.status(401).send("is not SuperAccount");
        }
      }
    } catch (error) {
      res.status(500).send("server error");
    }
  }
);
router.get("/healthFoodTable", async (req, res) => {
  const result = await prisma.healthFood.findMany({
    select: {
      Id: true,
      Name: true,

      CF: {
        select: {
          Id: true,
          Name: true,
        },
      },
      Applicant: {
        select: {
          Name: true,
        },
      },
    },
  });
  const transformedData = result.map((item) => ({
    Id: item.Id,
    Name: item.Name,
    CfId: item.CF.Id,
    CfName: item.CF.Name,
    AcName: item.Applicant.Name,
  }));
  res.json({
    code: 200,
    data: transformedData,
  });
});
router.post("/HfById", async (req, res) => {
  const { Id } = req.body;
  const result = await prisma.healthFood.findUnique({
    where: {
      Id: Id,
    },
    include: {
      HF_and_BF: true,
      HF_and_Ingredient: true,
      Applicant: true,
      CF: true,
    },
  });

  res.json({
    code: 200,
    data: result,
  });
});

router.patch(
  "/editHf",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const isAuth = await prisma.user.findUnique({
          where: {
            Id: req.tokenInfo.userId,
          },
          select: {
            isSuperAccount: true,
          },
        });

        if (isAuth?.isSuperAccount) {
          const {
            hfId,
            name,
            acId,
            cfId,
            acessDate,
            claims,
            warning,
            precautions,
            website,
            imgUrl,
            HF_and_BF,
            HF_and_IG,
          } = req.body;
          const editbf = await prisma.healthFood.update({
            where: {
              Id: hfId,
            },
            data: {
              Name: name,
              ApplicantId: acId,
              CFId: cfId,
              AcessDate: acessDate,
              Claims: claims,
              Warning: warning,
              Precautions: precautions,
              Website: website,
              ImgUrl: imgUrl,
            },
          });

          const deleteBF = await prisma.hF_and_BF.deleteMany({
            where: {
              HFId: hfId,
            },
          });
          const deleteIG = await prisma.hF_and_Ingredient.deleteMany({
            where: {
              HFId: hfId,
            },
          });

          let bfs: Prisma.HF_and_BFCreateManyInput[] = [];
          HF_and_BF.map((item: any, index: any) => {
            bfs[index] = {
              HFId: hfId,
              BFId: item.bfId,
            };
          });

          let igs: Prisma.HF_and_IngredientCreateManyInput[] = [];
          HF_and_IG.map((item: any, index: any) => {
            igs[index] = {
              HFId: hfId,
              IGId: item.igId,
            };
          });

          const createBfs = await prisma.hF_and_BF.createMany({
            data: bfs,
          });
          const createIgs = await prisma.hF_and_Ingredient.createMany({
            data: igs,
          });
          res.status(200).json({
            message: "success edit certification",
            editbf,
            createBfs,
            createIgs,
          });
        } else {
          res.status(401).send("is not SuperAccount");
        }
      }
    } catch (error) {
      console.log("🚀 ~ error:", error);
      res.status(500).send("server error");
    }
  }
);

router.post(
  "/createHf",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const isAuth = await prisma.user.findUnique({
          where: {
            Id: req.tokenInfo.userId,
          },
          select: {
            isSuperAccount: true,
          },
        });

        if (isAuth?.isSuperAccount) {
          const {
            hfId,
            name,
            acId,
            cfId,
            acessDate,
            claims,
            warning,
            precautions,
            website,
            imgUrl,
            HF_and_BF,
            HF_and_IG,
          } = req.body;
          const isExist = await prisma.healthFood.findUnique({
            where: {
              Id: hfId,
            },
          });
          if (isExist) {
            return res.status(409).send("HFId is exist");
          }

          const createbf = await prisma.healthFood.create({
            data: {
              Id: hfId,
              Name: name,
              ApplicantId: acId,
              CFId: cfId,
              AcessDate: acessDate,
              Claims: claims,
              Warning: warning,
              Precautions: precautions,
              Website: website,
              ImgUrl: imgUrl,
              CurCommentNum: 0,
              CurPoint: 0.0,
            },
          });

          const deleteBF = await prisma.hF_and_BF.deleteMany({
            where: {
              HFId: hfId,
            },
          });
          const deleteIG = await prisma.hF_and_Ingredient.deleteMany({
            where: {
              HFId: hfId,
            },
          });

          let bfs: Prisma.HF_and_BFCreateManyInput[] = [];
          HF_and_BF.map((item: any, index: any) => {
            bfs[index] = {
              HFId: hfId,
              BFId: item.bfId,
            };
          });

          let igs: Prisma.HF_and_IngredientCreateManyInput[] = [];
          HF_and_IG.map((item: any, index: any) => {
            igs[index] = {
              HFId: hfId,
              IGId: item.igId,
            };
          });

          const createBfs = await prisma.hF_and_BF.createMany({
            data: bfs,
          });
          const createIgs = await prisma.hF_and_Ingredient.createMany({
            data: igs,
          });
          res.status(200).json({
            message: "success edit certification",
            createbf,
            createBfs,
            createIgs,
          });
        } else {
          res.status(401).send("is not SuperAccount");
        }
      }
    } catch (error) {
      res.status(500).send("server error");
    }
  }
);

router.post(
  "/deleteHf",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const isAuth = await prisma.user.findUnique({
          where: {
            Id: req.tokenInfo.userId,
          },
          select: {
            isSuperAccount: true,
          },
        });

        if (isAuth?.isSuperAccount) {
          const { hfId } = req.body;
          const deleteBf = await prisma.healthFood.delete({
            where: {
              Id: hfId,
            },
          });
          res.status(201).json({ message: "success delete a certification" });
        } else {
          res.status(401).send("is not SuperAccount");
        }
      }
    } catch (error) {
      console.log("🚀 ~ error:", error);
      res.status(500).send("server error");
    }
  }
);

export { router as SearchSettingRoute };
