import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { default as jwt } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

prisma.$connect().catch((err) => {
  console.log("🚀 ~ err:", err);
});

const router = Router();

// router.get("/test", (req, res) => {
//   res.send(process.env.JWT_KEYPOINT);
// });

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
    const { email, username, password, age, gender } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        Id: uuidv4(),
        Email: email,
        Name: username,
        Password: hashedPassword,
        Age: age,
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
      const token = await jwt.sign(
        { userId: user.Id, userName: user.Name },
        secretKey
      );
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
  userName: string;
}

// 为 Request 添加用户属性
interface RequestWithUser extends Request {
  user?: UserPayload;
}

// 验证中间件
const authenticateToken = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  const secretKey = process.env.JWT_KEYPOINT || "default_secret_key";
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = decoded as UserPayload; // 确保解码后的对象符合 UserPayload 接口
    next();
  });
};

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
        Age: true,
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
router.get("/verifyToken", authenticateToken, (req: RequestWithUser, res) => {
  try {
    if (req.user) {
      return res.json({
        message: `你好, 用戶 ${req.user.userName}`,
        user_name: req.user.userName,
      });
    } else {
      return res.status(403).json({ message: "please login" });
    }
  } catch (error) {
    return res.status(500).send("server error");
  }
});

export { router as UserRoute };
