import { default as jwt } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();
// 定义用户信息的接口
interface UserPayload {
  userId: string;
}

// 为 Request 添加用户属性
export interface RequestWithUser extends Request {
  tokenInfo?: UserPayload;
}

// 验证中间件
export const authenticateToken = (
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
    req.tokenInfo = decoded as UserPayload; // 确保解码后的对象符合 UserPayload 接口
    next();
  });
};
