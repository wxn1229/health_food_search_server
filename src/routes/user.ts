import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { default as jwt } from "jsonwebtoken";
import dotenv from "dotenv";
import { authenticateToken } from "../utils/AuthToken";
import nodemailer from "nodemailer";

dotenv.config();

const prisma = new PrismaClient();

prisma.$connect().catch((err) => {
  console.log("🚀 ~ err:", err);
});

const router = Router();

router.get("/test", (req, res) => {
  res.json({ message: "this is /api/user/test" });
});

router.post("/signup", async (req, res) => {
  try {
    const { email, username } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        Email: email,
      },
    });

    const name = await prisma.user.findUnique({
      where: {
        Name: username,
      },
    });

    if (user) {
      // return res.json({
      //   code: 406,
      //   content: "user is exist",
      // });
      return res.status(406).send("user is exist");
    }

    if (name) {
      return res.status(407).send("user name is exist");
    }
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
    return res.status(500).send("server error from /api/user/signup");
  }

  try {
    const { email, username, password, birthday, gender } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        Id: uuidv4(),
        Email: email,
        Name: username,
        Password: hashedPassword,
        Birthday: new Date(birthday),
        Gender: gender,
      },
    });

    // return res.json({
    //   code: 200,
    //   result: user,
    // });
    return res.status(200).json({ result: user });
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        Email: email,
      },
    });

    if (!user) {
      return res.status(405).send("user is not exist");
    }

    const isCorrect = await bcrypt.compare(password, user.Password);

    if (isCorrect) {
      const secretKey = process.env.JWT_KEYPOINT || "default_secret_key";
      const token = await jwt.sign({ userId: user.Id }, secretKey);
      res.json({
        msg: "login success",
        token,
        user_name: user.Name,
        user_id: user.Id,
      });
    } else {
      return res.status(401).send("password is not correct");
    }
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
    res.status(500).send("server error");
  }
});

// 定义用户信息的接口
interface UserPayload {
  userId: string;
}

// 为 Request 添加用户属性
interface RequestWithUser extends Request {
  tokenInfo?: UserPayload;
}

router.post("/searchUserById", async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        Id: userId,
      },
      select: {
        Name: true,
        Birthday: true,
        Gender: true,
      },
    });

    if (!user) {
      return res.status(404).send("user is not found");
    }

    res.status(200).json({ message: "success get user data by userId", user });
  } catch (error) {
    return res.status(500).send("server error");
  }
});

router.post("/searchUserByName", async (req, res) => {
  try {
    const { username } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        Name: username,
      },
      select: {
        Name: true,
        Email: true,
        Birthday: true,
        Gender: true,
      },
    });

    if (!user) {
      return res.status(404).send("user is not found");
    }

    res
      .status(200)
      .json({ message: "success get user data by username", user });
  } catch (error) {
    return res.status(500).send("server error");
  }
});

// 受保護的路由
router.get(
  "/verifyToken",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const user = await prisma.user.findUnique({
          where: {
            Id: req.tokenInfo.userId,
          },
        });

        return res.json({
          message: `你好, 用戶 ${req.tokenInfo.userId}`,
          user_id: req.tokenInfo.userId,
          isAdmin: user?.isSuperAccount,
          user_name: user?.Name,
        });
      } else {
        return res.status(403).json({ message: "please login" });
      }
    } catch (error) {
      return res.status(500).send("server error");
    }
  }
);

router.patch(
  "/updateUserByEmail",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      const { email, name, birthday, gender } = req.body;

      const verifyUser = await prisma.user.findUnique({
        where: {
          Email: email,
        },
        select: {
          Id: true,
        },
      });

      if (req.tokenInfo) {
        if (verifyUser) {
          if (verifyUser.Id !== req.tokenInfo.userId) {
            return res.status(403).send("Insufficient permissions");
          }
        } else {
          return res.status(404).send("not found user");
        }
      } else {
        return res.status(403).send("Insufficient permissions");
      }

      const isExist = await prisma.user.findUnique({
        where: {
          Name: name,
        },
      });

      if (isExist && isExist.Id !== req.tokenInfo.userId) {
        return res.status(409).send("name is exist");
      }

      const user = await prisma.user.update({
        where: {
          Email: email,
        },
        data: {
          Name: name,
          Birthday: new Date(birthday),
          Gender: gender,
        },
        select: {
          Name: true,
          Birthday: true,
          Gender: true,
        },
      });

      res.status(200).json({ message: "success update user data", user });
    } catch (error) {
      return res.status(500).send("server error");
    }
  }
);

router.patch(
  "/changePassword",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      const { email, oldPassword, newPassword } = req.body;

      const verifyUser = await prisma.user.findUnique({
        where: {
          Email: email,
        },
        select: {
          Id: true,
          Password: true,
        },
      });

      if (req.tokenInfo) {
        if (verifyUser) {
          if (verifyUser.Id !== req.tokenInfo.userId) {
            return res.status(403).send("Insufficient permissions");
          }
        } else {
          return res.status(404).send("not found user");
        }
      } else {
        return res.status(403).send("Insufficient permissions");
      }

      const isCorrect = await bcrypt.compare(oldPassword, verifyUser.Password);

      if (isCorrect) {
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);
        const changePassword = await prisma.user.update({
          where: {
            Email: email,
          },
          data: {
            Password: newHashedPassword,
          },
        });
      } else {
        return res.status(402).send("oldPassword is incorrect");
      }

      res.status(200).json({ message: "success change user password" });
    } catch (error) {
      return res.status(500).send("server error");
    }
  }
);

router.post(
  "/submitComment",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const { userId } = req.tokenInfo;
        const { hfId, content, score, modifyTime } = req.body;
        const modifyTimeIso = new Date(modifyTime);

        const isExist = await prisma.comment.findUnique({
          where: {
            UserId_HFId: {
              UserId: userId,
              HFId: hfId,
            },
          },
        });
        if (isExist) {
          const updateComment = await prisma.comment.update({
            where: {
              UserId_HFId: {
                UserId: userId,
                HFId: hfId,
              },
            },
            data: {
              content: content,
              point: score,
              modifyTime: modifyTimeIso,
            },
          });
          const getAvgPoint = await prisma.comment.groupBy({
            by: ["HFId"],
            where: {
              HFId: hfId,
            },
            _avg: {
              point: true,
            },
            _count: {
              UserId: true,
            },
          });
          if (getAvgPoint[0]._avg.point) {
            const calulateScore = await prisma.healthFood.update({
              where: {
                Id: hfId,
              },
              data: {
                CurCommentNum: getAvgPoint[0]._count.UserId,
                CurPoint: getAvgPoint[0]._avg.point,
              },
            });
          }

          return res.status(200).json({
            message: "success update your comment",
            updateComment,
          });
        }

        const comment = await prisma.comment.create({
          data: {
            UserId: userId,
            HFId: hfId,
            content: content,
            point: score,
            modifyTime: modifyTimeIso,
          },
        });

        const getAvgPoint = await prisma.comment.groupBy({
          by: ["HFId"],
          where: {
            HFId: hfId,
          },
          _avg: {
            point: true,
          },
          _count: {
            UserId: true,
          },
        });

        if (getAvgPoint[0]._avg.point) {
          const calulateScore = await prisma.healthFood.update({
            where: {
              Id: hfId,
            },
            data: {
              CurCommentNum: getAvgPoint[0]._count.UserId,
              CurPoint: getAvgPoint[0]._avg.point,
            },
          });
        }

        return res.status(200).json({
          message: "success submit your comment",
          comment,
        });
      } else {
        return res.status(401).send("please login");
      }
    } catch (error) {
      return res.status(500).send("server error");
    }
  }
);

router.post("/getComments", async (req: RequestWithUser, res) => {
  try {
    const { hfId } = req.body;
    const comments = await prisma.comment.findMany({
      where: {
        HFId: hfId,
      },
      select: {
        content: true,
        modifyTime: true,
        point: true,
        User: {
          select: {
            Name: true,
          },
        },
      },
      orderBy: {
        modifyTime: "desc",
      },
    });

    return res.status(200).json({ message: "get user comments", comments });
  } catch (error) {
    return res.status(500).send("server error");
  }
});

router.post(
  "/isComment",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const { userId } = req.tokenInfo;
        const { hfId } = req.body;

        const isComment = await prisma.comment.findFirst({
          where: {
            UserId: userId,
            HFId: hfId,
          },
          select: {
            content: true,
            point: true,
          },
        });

        if (isComment) {
          return res
            .status(200)
            .json({ message: "success get isComment", isComment });
        } else {
          return res.status(404).send("not found");
        }
      } else {
        return res.status(401).send("please login");
      }
    } catch (error) {
      return res.status(500).send("server error");
    }
  }
);

router.post(
  "/addFavourite",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const { userId } = req.tokenInfo;
        const { hfId } = req.body;
        const addFav = await prisma.favourite.create({
          data: {
            HFId: hfId,
            UserId: userId,
          },
        });

        return res
          .status(200)
          .json({ message: "success add to favourite", addFav });
      } else {
        return res.status(401).send("please login");
      }
    } catch (error) {
      console.log("to fast");
    }
  }
);

router.post(
  "/deleteFavourite",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const { userId } = req.tokenInfo;
        const { hfId } = req.body;
        const deleteFav = await prisma.favourite.delete({
          where: {
            UserId_HFId: {
              HFId: hfId,
              UserId: userId,
            },
          },
        });

        return res
          .status(200)
          .json({ message: "success delete from favourite" });
      } else {
        return res.status(401).send("please login");
      }
    } catch (error) {
      console.log("to fast");
    }
  }
);

router.post(
  "/isFavourite",
  authenticateToken,
  async (req: RequestWithUser, res) => {
    try {
      if (req.tokenInfo) {
        const { userId } = req.tokenInfo;
        const { hfId } = req.body;
        const isFav = await prisma.favourite.findUnique({
          where: {
            UserId_HFId: {
              HFId: hfId,
              UserId: userId,
            },
          },
        });

        if (isFav) {
          return res
            .status(200)
            .json({ message: "success delete from favourite", isFav: true });
        }

        return res
          .status(200)
          .json({ message: "success delete from favourite", isFav: false });
      } else {
        return res.status(401).send("please login");
      }
    } catch (error) {
      return res.status(500).send("server error");
    }
  }
);

router.get("/FavHF", authenticateToken, async (req: RequestWithUser, res) => {
  try {
    if (req.tokenInfo) {
      const { userId } = req.tokenInfo;
      const page = parseInt((req.query.page as string) || "1", 10);

      const results = await prisma.healthFood.findMany({
        where: {
          Favourite: {
            some: {
              UserId: userId,
            },
          },
        },
        select: {
          Id: true,
          Name: true,
          AcessDate: true,
          ImgUrl: true,
          CurPoint: true,
          CurCommentNum: true,
          Claims: true,
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

        take: 12,
        skip: 12 * (page - 1),
      });

      const count = await prisma.healthFood.count({
        where: {
          Favourite: {
            some: {
              UserId: userId,
            },
          },
        },
      });

      return res.status(200).json({
        message: "success get favourite healthFood data",
        results,
        count: Math.ceil(count / 12),
      });
    }
  } catch (error) {
    return res.status(500).send("server error");
  }
});

router.post("/forgotPassword", async (req, res) => {
  try {
    const { email } = req.body;

    // 檢查用戶是否存在
    const user = await prisma.user.findUnique({
      where: { Email: email },
    });

    if (!user) {
      return res.status(404).json({ message: "使用者不存在" });
    }

    // 創建重置 token
    const resetToken = jwt.sign(
      { userId: user.Id },
      process.env.JWT_KEYPOINT || "default_secret_key",
      { expiresIn: "1h" }
    );

    // 設置郵件傳送器
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 重置密碼的連結
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // 郵件內容
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "重置密碼",
      html: `
        <h1>重置密碼請求</h1>
        <p>請點擊下面的連結重置密碼：</p>
        <a href="${resetLink}">重置密碼</a>
        <p>此連結將在一小時後失效。</p>
      `,
    };

    // 發送郵件
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "重置密碼郵件已發送，請查看您的信箱",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

router.post("/resetPassword", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // 驗證 token
    const decoded = jwt.verify(
      token,
      process.env.JWT_KEYPOINT || "default_secret_key"
    ) as { userId: string };

    // 加密新密碼
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 更新密碼
    await prisma.user.update({
      where: { Id: decoded.userId },
      data: { Password: hashedPassword },
    });

    res.status(200).json({ message: "密碼已成功重置" });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "重置連結已過期" });
    }
    console.error(error);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

export { router as UserRoute };
