import axios from "axios"
import * as admin from "firebase-admin"
import { FieldValue, Timestamp } from "firebase-admin/firestore"
import { onRequest } from "firebase-functions/v2/https"
import { onSchedule } from "firebase-functions/v2/scheduler"

// import { onSchedule } from "firebase-functions/scheduler"

if (!admin.apps.length) {
  admin.initializeApp()
}
const firestore = admin.firestore()
const KEY = process.env.BRIGHT_DATA_API_KEY

//This is a dummy scraper functions
interface WatchListProduct {
  id: string
  productId: string
  productTitle: string
  marketPlace: string
  latestPrice: number
  zipcode?: string
  language?: string
  productImage?: string
  priceHistory: { price: number; timestamp: Timestamp | string }[]
  createdAt: Timestamp | string
}

interface FireBaseQueueShape {
  docId: string
  id: string
  marketPlace: string
  productID: string
  snapshot_id: string
  status: string
  timeStamp: Timestamp
}

interface BrightDataResponse {
  status: string
  snapshot_id: string
  dataset_id: string
  records: number
  errors: number
  collection_duration: number
}

async function runBrightDataScraper(
  productData: WatchListProduct
): Promise<any> {
  // Setting my constants and starting off the functions with adding delays
  // And solving the timeout

  if (productData.marketPlace === "Amazon") {
    const url = {
      url: productData.productId,
      zipcode: productData.zipcode,
      language: "EN",
    }

    const { data } = await axios.post(
      `https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l7q7dkf244hwjntr0&include_errors=true`,
      url,
      {
        headers: {
          Authorization: `Bearer ${KEY}`,
          "Content-Type": "application/json",
        },
      }
    )
    const result = await admin
      .firestore()
      .collection("scrapeQueue")
      .add({
        id: productData.id,
        marketPlace: productData.marketPlace,
        productID: productData.productId,
        snapshot_id: data.snapshot_id ?? "",
        status: "processing",
        createdAt: Timestamp.now(),
      })
    return result
  }

  if (productData.marketPlace === "Walmart") {
    const url = { url: productData.productId, all_variations: true }

    console.log("Sku of product ", url)
    const { data } = await axios.post(
      "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l95fol7l1ru6rlo116&include_errors=true",
      url,
      {
        headers: {
          Authorization: `Bearer ${KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    // This is the new strategy which is just submitting the queue and seeing what comes back
    // This will be creating a new document for the status of the watchlist item
    const result = await admin
      .firestore()
      .collection("scrapeQueue")
      .add({
        id: productData.id,
        marketPlace: productData.marketPlace,
        productID: productData.productId,
        snapshot_id: data.snapshot_id ?? "",
        status: "processing",
        createdAt: Timestamp.now(),
      })
    return result
  }
  if (productData.marketPlace === "Wayfair") {
    const url = { url: productData.productId }

    console.log("Product URL  ", url)
    const { data } = await axios.post(
      "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_ltr9ne3p24zrhrbu28&include_errors=true",
      url,
      {
        headers: {
          Authorization: `Bearer ${KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    // This is the new strategy which is just submitting the queue and seeing what comes back
    // This will be creating a new document for the status of the watchlist item
    const result = await admin
      .firestore()
      .collection("scrapeQueue")
      .add({
        id: productData.id,
        marketPlace: productData.marketPlace,
        productID: productData.productId,
        snapshot_id: data.snapshot_id ?? "",
        status: "processing",
        createdAt: Timestamp.now(),
      })
    return result
  }
  if (productData.marketPlace === "Target") {
    const url = { url: productData.productId }

    console.log("Product URL  ", url)
    const { data } = await axios.post(
      "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_ltppk5mx2lp0v1k0vo&include_errors=true",
      url,
      {
        headers: {
          Authorization: `Bearer ${KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    // This is the new strategy which is just submitting the queue and seeing what comes back
    // This will be creating a new document for the status of the watchlist item
    const result = await admin
      .firestore()
      .collection("scrapeQueue")
      .add({
        id: productData.id,
        marketPlace: productData.marketPlace,
        productID: productData.productId,
        snapshot_id: data.snapshot_id ?? "",
        status: "processing",
        createdAt: Timestamp.now(),
      })
    return result
  }
}
export const runScrape = onSchedule(
  {
    schedule: "every 5 hours",
    region: "us-central1",
    timeoutSeconds: 540,
    memory: "1GiB",
  },
  async () => {
    console.log("Starting scheduled watchlist update....")
    console.log("Non Scheduled Function")

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
        const productData = productDoc.data() as WatchListProduct
        console.log("Right before the runScraper", productData)
        await runBrightDataScraper(productData)
        console.log("After the loop, this should fix it ")
      }
    }

    console.log("Finished scheduled watchlist update.")
  }
)

// This needs to be scheudled every hours
export const runCheckSnapShotStatus = onSchedule(
  {
    schedule: "every 2 hours",
    region: "us-central1",
    timeoutSeconds: 540,
    memory: "1GiB",
  },
  async () => {
    console.log(
      "Checking the status of snapshots this should run every two hours and then grab the ones that are ready"
    )
    const snapshotQueue = await firestore
      .collection("scrapeQueue")
      .listDocuments()

    //Now need to loop through every document and run the BrightData API to see where the progress is at

    for (const snapshotDoc of snapshotQueue) {
      //This will be used to update the progress of the snapshots queue doc
      const snapshotDocId = snapshotDoc.id
      console.log(`Now Processing ${snapshotDocId}`)
      const queueDocData = await firestore
        .doc(`scrapeQueue/${snapshotDocId}`)
        .get()
      console.log("Check Status Function", queueDocData.data())
      //Now get the snapshot ID
      if (!queueDocData.exists) {
        console.error("Document Does not exist")
        return
      }
      const rawQueueData = queueDocData.data() as FireBaseQueueShape
      const snapshot_id = rawQueueData.snapshot_id
      //Send Request to Bright Data
      const brightDataRequest = await axios.get(
        `https://api.brightdata.com/datasets/v3/progress/${snapshot_id}`,
        {
          headers: {
            Authorization: `Bearer ${KEY}`,
          },
        }
      )
      const brightDataResponse = brightDataRequest.data as BrightDataResponse
      console.log(
        "Snapshot_ID:",
        snapshot_id,
        "BrightDatas Response:",
        brightDataResponse.status
      )
      //This checks if the bright data status is updated
      if (brightDataResponse.status === "ready") {
        await queueDocData.ref.update({
          status: "ready",
        })
      }
    }
  }
)
//This needs to run every 5 hours arguably
export const runUpdatePriceHistory = onSchedule(
  {
    schedule: "every 3 hours",
    region: "us-central1",
    timeoutSeconds: 540,
    memory: "1GiB",
  },
  async () => {
    const scrapeQueue = await firestore
      .collection("scrapeQueue")
      .where("status", "==", "ready")
      .get()

    const readyDocs = scrapeQueue.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    })) as FireBaseQueueShape[]
    console.log("What is the ready docs", readyDocs)

    await Promise.all(
      readyDocs.map(async (doc) => {
        const response = await axios.get(
          `https://api.brightdata.com/datasets/v3/snapshot/${doc.snapshot_id}?format=json`,
          {
            headers: {
              Authorization: `Bearer ${KEY}`,
            },
          }
        )

        const data = response.data
        const raw_price = (data[0]?.final_price as string) ?? null
        const final_price = raw_price
          ? parseFloat(raw_price.replace(/[^0-9.]/g, ""))
          : null
        console.log(
          `Final price for ${doc.productID} (${doc.marketPlace}):`,
          final_price
        )
        // Now update the correct product in watchlist(s)
        const watchlistSnap = await firestore
          .collection("watchlists")
          .listDocuments()
        console.log("This is the doc ID find it", doc.docId)

        for (const userDocRef of watchlistSnap) {
          const userId = userDocRef.id
          const productRef = firestore.doc(
            `watchlists/${userId}/products/${doc.id}`
          )
          const productSnap = await productRef.get()

          if (productSnap.exists) {
            await productRef.update({
              latestPrice: final_price,
              productTitle: data[0]?.title || data[0]?.product_name,
              productImage:
                data[0]?.images || data[0]?.image_urls || data[0]?.image_url,
              priceHistory: FieldValue.arrayUnion({
                price: final_price,
                timestamp: Timestamp.now(),
              }),
            })
          }
        }

        // Optional: mark scrapeQueue entry as processed
        await firestore
          .collection("scrapeQueue")
          .doc(doc.docId)
          .update({ status: "processed" })
      })
    )
  }
)

const runBrightScraperManually = async () => {
  console.log("Starting scheduled watchlist update....")
  console.log("Non Scheduled Function")

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
      const productData = productDoc.data() as WatchListProduct
      console.log("Right before the runScraper", productData)
      await runBrightDataScraper(productData)
      console.log("After the loop, this should fix it ")
    }
  }

  console.log("Finished scheduled watchlist update.")
}

const runProgressCheckManually = async () => {
  console.log(
    "Checking the status of snapshots this should run every two hours and then grab the ones that are ready"
  )
  const snapshotQueue = await firestore
    .collection("scrapeQueue")
    .listDocuments()

  //Now need to loop through every document and run the BrightData API to see where the progress is at

  for (const snapshotDoc of snapshotQueue) {
    //This will be used to update the progress of the snapshots queue doc
    const snapshotDocId = snapshotDoc.id
    console.log(`Now Processing ${snapshotDocId}`)
    const queueDocData = await firestore
      .doc(`scrapeQueue/${snapshotDocId}`)
      .get()
    console.log("Check Status Function", queueDocData.data())
    //Now get the snapshot ID
    if (!queueDocData.exists) {
      console.error("Document Does not exist")
      return
    }
    const rawQueueData = queueDocData.data() as FireBaseQueueShape
    const snapshot_id = rawQueueData.snapshot_id
    //Send Request to Bright Data
    const brightDataRequest = await axios.get(
      `https://api.brightdata.com/datasets/v3/progress/${snapshot_id}`,
      {
        headers: {
          Authorization: `Bearer ${KEY}`,
        },
      }
    )
    const brightDataResponse = brightDataRequest.data as BrightDataResponse
    console.log(
      "Snapshot_ID:",
      snapshot_id,
      "BrightDatas Response:",
      brightDataResponse.status
    )
    //This checks if the bright data status is updated
    if (brightDataResponse.status === "ready") {
      await queueDocData.ref.update({
        status: "ready",
      })
    }
  }
}

const runUpdatePricesManually = async () => {
  console.log("This is where the real magic happens")
  const scrapeQueue = await firestore
    .collection("scrapeQueue")
    .where("status", "==", "ready")
    .get()

  const readyDocs = scrapeQueue.docs.map((doc) => ({
    docId: doc.id,
    ...doc.data(),
  })) as FireBaseQueueShape[]
  console.log("What is the ready docs", readyDocs)

  await Promise.all(
    readyDocs.map(async (doc) => {
      const response = await axios.get(
        `https://api.brightdata.com/datasets/v3/snapshot/${doc.snapshot_id}?format=json`,
        {
          headers: {
            Authorization: `Bearer ${KEY}`,
          },
        }
      )

      const data = response.data
      const raw_price = (data[0]?.final_price as string) ?? null
      const final_price = raw_price
        ? parseFloat(raw_price.replace(/[^0-9.]/g, ""))
        : null
      console.log(
        `Final price for ${doc.productID} (${doc.marketPlace}):`,
        final_price
      )
      // Now update the correct product in watchlist(s)
      const watchlistSnap = await firestore
        .collection("watchlists")
        .listDocuments()
      console.log("This is the doc ID find it", doc.docId)

      for (const userDocRef of watchlistSnap) {
        const userId = userDocRef.id
        const productRef = firestore.doc(
          `watchlists/${userId}/products/${doc.id}`
        )
        const productSnap = await productRef.get()

        if (productSnap.exists) {
          await productRef.update({
            latestPrice: final_price,
            productTitle: data[0]?.title || data[0]?.product_name,
            productImage:
              data[0]?.images || data[0]?.image_urls || data[0]?.image_url,
            priceHistory: FieldValue.arrayUnion({
              price: final_price,
              timestamp: Timestamp.now(),
            }),
          })
        }
      }

      // Optional: mark scrapeQueue entry as processed
      await firestore
        .collection("scrapeQueue")
        .doc(doc.docId)
        .update({ status: "processed" })
    })
  )
}

export const runScrapeNow = onRequest(
  {
    region: "us-central1",
    timeoutSeconds: 540,
    memory: "1GiB",
  },
  async (req, res) => {
    await runBrightScraperManually() // separate out your logic to reuse
    res.send("Scrape run triggered manually.")
  }
)

export const runProgressCheckNow = onRequest(
  {
    region: "us-central1",
    timeoutSeconds: 540,
    memory: "1GiB",
  },
  async (req, res) => {
    console.log("TEST")
    await runProgressCheckManually()
    res.send("Checking Progress Manually")
  }
)

export const runUpdatePricesNow = onRequest(
  {
    region: "us-central1",
    timeoutSeconds: 540,
    memory: "1GiB",
  },
  async (req, res) => {
    await runUpdatePricesManually()
    res.send("Updating Prices Manually.")
  }
)
