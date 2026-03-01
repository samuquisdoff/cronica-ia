import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Servir pasta public
app.use(express.static(path.join(__dirname, "public")));

// 🔥 Rota da IA
app.post("/chat", async (req, res) => {
  try {
    const { message, system } = req.body;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: system || "Você é Crônica." },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      reply: response.data.choices[0].message.content
    });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ error: "Erro na Crônica" });
  }
});

// ✅ Porta obrigatória Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🌍 Crônica rodando global na porta ${PORT}`);
});
