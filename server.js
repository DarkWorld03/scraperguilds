const express = require("express");
const scrapeAllGuilds = require("./scraperAllGuilds");
const subirAGithub = require("./subirAGithub");

const app = express();

app.get("/ping", (req, res) => {
  res.send("🏓 Ping recibido (scraperAllGuilds)");
});

app.get("/ejecutar-scraper", (req, res) => {
  res.send("⏳ Scraper iniciado en segundo plano (scraperAllGuilds)");

  setTimeout(async () => {
    try {
      const data = await scrapeAllGuilds();
      if (!data || data.length === 0) throw new Error("No se pudo scrapear.");

      const filename = "allguilds.json";
      const content = JSON.stringify(data, null, 2);

      const subida = await subirAGithub({
        repo: "DarkWorld03/guild-data",
        path: `guilds/${filename}`,
        content,
        message: "📦 Actualización automática de allguilds.json",
        token: process.env.GITHUB_TOKEN,
      });

      console.log("✅ Archivo subido:", subida);
    } catch (err) {
      console.error("❌ Error en scraperAllGuilds:", err);
    }
  }, 100);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Servidor activo scraperAllGuilds en puerto ${PORT}`)
);


