import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON payloads up to 15MB to allow base64 image data in photos
  app.use(express.json({ limit: '15mb' }));

  // API Route to save the user's edits permanently to src/defaultData.ts
  app.post("/api/save-config", (req, res) => {
    try {
      const data = req.body;
      if (!data || typeof data !== "object" || !data.name) {
        return res.status(400).json({ error: "Dados inválidos enviados para salvamento." });
      }

      // Format as beautiful TypeScript default data
      const fileContent = `import { BirthdayData } from './types';\n\nexport const defaultBirthdayData: BirthdayData = ${JSON.stringify(data, null, 2)};\n`;

      const targetPath = path.join(process.cwd(), "src", "defaultData.ts");
      fs.writeFileSync(targetPath, fileContent, "utf-8");

      console.log(`[Success] Successfully saved defaultData.ts from user edit.`);
      res.json({ success: true, message: "Suas edições foram salvas como a versão final permanente com sucesso!" });
    } catch (err: any) {
      console.error("[Error saving config]:", err);
      res.status(500).json({ error: `Erro ao salvar no servidor: ${err.message}` });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
