import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.json({
    code: 200,
    Info: "sucess post",
  });
});

app.listen(3003, () => {
  console.log("sever listening 3003");
});
