const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5010;
const JSON_SERVER_URL = "http://localhost:3000";

app.use(cors());
app.use(express.json());

let clients = [];

app.get("/events/:productId", (req, res) => {
  const productId = req.params.productId;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  clients.push({ res, productId });

  res.on("close", () => {
    clients = clients.filter((client) => client.res !== res);
  });
});

app.post("/bid/:productId", async (req, res) => {
  const { productId } = req.params;
  const { bid, userId } = req.body;

  try {
    const productResponse = await axios.get(`${JSON_SERVER_URL}/products/${productId}`);
    const currentProduct = productResponse.data;

    if (!currentProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (bid <= currentProduct.currentPrice || bid < 0 || bid > 10000000) {
      return res.status(400).json({ error: "Puja inválida" });
    }

    const updatedProduct = {
      ...currentProduct,
      currentPrice: bid,
      winnerId: userId,
    };
    await axios.put(`${JSON_SERVER_URL}/products/${productId}`, updatedProduct);

    const newBid = {
      productId,
      userId,
      bid,
      timestamp: new Date().toISOString(),
    };
    await axios.post(`${JSON_SERVER_URL}/bids`, newBid);

    // Fetch user name
    const userResponse = await axios.get(`${JSON_SERVER_URL}/users/${userId}`);
    const user = userResponse.data;
    const userName = user ? user.name : `Usuario ${userId}`;

    const broadcastData = {
      currentPrice: bid,
      winnerId: userId,
      newBid,
      userName,
    };

    clients
      .filter((client) => client.productId === productId)
      .forEach((client) => {
        client.res.write(`data: ${JSON.stringify(broadcastData)}\n\n`);
      });

    res.status(200).json({ success: true, currentPrice: bid, winnerId: userId });
  } catch (error) {
    console.error("Error updating bid:", error);
    res.status(500).json({ error: "Error al procesar la puja" });
  }
});

app.listen(PORT, () => {
  console.log(`El servidor SSE está UP en el puerto: ${PORT}`);
});