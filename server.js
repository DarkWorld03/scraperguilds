const express = require("express");
const scrapeAllGuilds = require("./scraperAllGuilds");
const subirAGithub = require("./subirAGithub");

const app = express();

app.get("/ejecutar-scraper", async (req, res) => {
  try {
    const data = await scrapeAllGuilds();
    if (!data || data.length === 0) throw new Error("No se pudo scrapear.");

    const filename = "allguilds.json";
    const content = JSON.stringify(data, null, 2);

    const subida = await subirAGithub({
      repo: "darkworldaxie/guild-data", // Cambia por tu repo correcto
      path: `guilds/${filename}`, // Carpeta donde guardarás el JSON
      content,
      message: "📦 Actualización automática de allguilds.json",
      token: process.env.GITHUB_TOKEN,
    });

    res.send("✅ JSON generado y subido a GitHub");
  } catch (err) {
    console.error("❌ Error al ejecutar todo:", err);
    res.status(500).send("❌ Error general");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor activo en puerto ${PORT}`));
