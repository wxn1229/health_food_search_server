import { Router } from "express";
import { PrismaClient } from "@prisma/client";
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
    const result = await prisma.certification.findMany({
      orderBy: {
        Id: "desc",
      },
      select: {
        Id: true,
      },
      take: 1,
    });
    res.status(200).json({ result: result[0] });
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
          const { igId, name } = req.body;
          const editIg = await prisma.ingredient.update({
            where: {
              Id: igId,
            },
            data: {
              Name: name,
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
          const { igId, name } = req.body;
          const createIg = await prisma.ingredient.create({
            data: {
              Id: igId,
              Name: name,
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

export { router as SearchSettingRoute };
