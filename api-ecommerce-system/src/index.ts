import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Rota inicial
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express + TypeScript!");
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
