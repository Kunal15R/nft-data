require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = 4000 || process.env.PORT;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/sol", async (req, res) => {
  const { address } = req.query;
  try {
    console.log(address);
    // random number between 1 to 4
    const random = Math.floor(Math.random() * 4) + 1;
    console.log(random);
    const request = await axios.post(
      "https://rest-api.hellomoon.io/v0/nft/magiceden/wallet-all-time-stats",
      {
        ownerAccount: address,
      },
      {
        headers: {
            // HELLO_MOON_API_KEY_1 - here 1 is the random number
            Authorization: `Bearer ${process.env[`HELLO_MOON_API_KEY_${random}`]}`,
        },
      }
    );

    let data = request.data?.data;
    let nftData = {}

    if (data?.length > 0) {
        data = data[0]
        nftData = {
            realizedProfits: data?.totalRealizedProfits,
            volume: data?.volumeNftPurchased,
            minted: data?.nftMintedCount,
            sold: data?.nftSoldCount,
            purchased: data?.nftPurchasedCount,
            profitAndLossPercentage: data?.profitAndLossPercentage,
            nftVolumeTraded: data?.volumeNftTraded,
            nftSoldVolume: data?.volumeNftSold
        }
    }

    res.status(200).json({
      address: address,
      nftData: nftData,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
