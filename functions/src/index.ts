import * as admin from "firebase-admin"
import * as functions from "firebase-functions"
import { onSchedule } from "firebase-functions/scheduler"

admin.initializeApp()
const firestore = admin.firestore()

//This is a dummy scraper functions

async function runScraperForProduct(productData: any): Promise<number> {
  console.log("Scraping price this is whats going on here  ", productData)
  await new Promise((resolve) => setTimeout(resolve, 500))

  return Math.floor(Math.random() * 1000) + 1
}

export const updateWatchListPrices = onSchedule(
  {
    schedule: "every 5 hours",
  },
  async () => {
    console.log("Starting scheduled watchlist update....")

    const watchlistsSnap = await firestore
      .collection("watchlists")
      .listDocuments()

    //Now looping through every document and running this search
    for (const userDocRef of watchlistsSnap) {
      const userId = userDocRef.id
      console.log(`Now processing watchlist for user ${userId}`)

      const productsSnap = await firestore
        .collection(`watchlists/${userId}/products`)
        .get()

      for (const productDoc of productsSnap.docs) {
        const productData = productDoc.data()
        const latestPrice = await runScraperForProduct(productData)
        console.log(
          `Updating product ${productDoc.id} with price ${latestPrice}`
        )
        await productDoc.ref.update({
          latestPrice,
          priceHistory: admin.firestore.FieldValue.arrayUnion({
            price: latestPrice,
            timestamp: admin.firestore.Timestamp.now(),
          }),
        })
      }
    }
    console.log("Finished scheduled watchlist update.")
  }
)
export async function updateWatchListPricesLogic() {
  console.log("Starting scheduled watchlist update....")

  const watchlistsSnap = await firestore
    .collection("watchlists")
    .listDocuments()

  //Now looping through every document and running this search
  for (const userDocRef of watchlistsSnap) {
    const userId = userDocRef.id
    console.log(`Now processing watchlist for user ${userId}`)

    const productsSnap = await firestore
      .collection(`watchlists/${userId}/products`)
      .get()

    for (const productDoc of productsSnap.docs) {
      const productData = productDoc.data()
      const latestPrice = await runScraperForProduct(productData)
      console.log(`Updating product ${productDoc.id} with price ${latestPrice}`)
      await productDoc.ref.update({
        latestPrice,
        priceHistory: admin.firestore.FieldValue.arrayUnion({
          price: latestPrice,
          timestamp: admin.firestore.Timestamp.now(),
        }),
      })
    }
  }

  console.log("Finished scheduled watchlist update.")
}

export const runUpdateWatchListPricesNow = functions.https.onRequest(
  async (req, res) => {
    await updateWatchListPricesLogic() // your existing logic
    res.send("UpdateWatchListPrices completed")
  }
)
