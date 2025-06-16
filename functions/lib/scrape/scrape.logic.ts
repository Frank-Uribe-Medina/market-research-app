import axios from "axios"

import { SnapShotActions } from "../../../src/lib/db/actions/Snapshots"
import {
  BrightDataKeyWordShape,
  KeyWordObjectModal,
} from "../../../src/types/keyWordList.model"

export default async function scrape(
  userId: string,
  list?: KeyWordObjectModal,
  snapshotBucketId?: string
) {
  try {
    const walmart_list: BrightDataKeyWordShape[] = []
    const amazon_list: BrightDataKeyWordShape[] = []
    const target_list: BrightDataKeyWordShape[] = []

    list?.keyWords.map((keyword) => {
      if (keyword.marketplaces.includes("Walmart")) {
        const data = { keyword: "", domain: "", limitInput: 0 }
        data.keyword = keyword.keyword
        data.domain = "www.walmart.com"
        data.limitInput = keyword.quantity
        walmart_list.push(data)
      }
      if (keyword.marketplaces.includes("Amazon")) {
        // https://brightdata.com/cp/scrapers/api/gd_l7q7dkf244hwjntr0/keyword/api?id=hl_76f10dfb
        // This is the API shape for Amazon doesnt need domain
        const data = { keyword: "", limitInput: 0 }
        data.keyword = keyword.keyword
        data.limitInput = keyword.quantity
        amazon_list.push(data)
      }
      if (keyword.marketplaces.includes("Target")) {
        //https://brightdata.com/cp/scrapers/api/gd_ltppk5mx2lp0v1k0vo/keywords/api?id=hl_76f10dfb
        // This is the API shape for the Target also does not need domain
        const data = { keyword: "", limitInput: 0 }
        data.keyword = keyword.keyword
        data.limitInput = keyword.quantity
        target_list.push(data)
      }
    })
    console.log("Walmart List", walmart_list)
    console.log("Amazon List", amazon_list)
    console.log("Target List", target_list)
    const groupByQuantity = (list: BrightDataKeyWordShape[]) => {
      const groups: Record<number, BrightDataKeyWordShape[]> = {}
      for (const item of list) {
        if (!groups[item.limitInput]) {
          groups[item.limitInput] = []
        }
        groups[item.limitInput].push(item)
      }
      return groups
    }

    const walmartGrouped = groupByQuantity(walmart_list)
    const amazonGrouped = groupByQuantity(amazon_list)
    const targetGrouped = groupByQuantity(target_list)
    console.log("Target not implemented logged here", targetGrouped)

    const walmartRequest = Object.entries(walmartGrouped).map(
      async ([quantity, inputs]) => {
        const payload = {
          deliver: {
            type: "gcs",
            filename: { template: "{[snapshot_id]}", extension: "csv" },
            bucket: `${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}`,
            credentials: {
              client_email: `${process.env.FIREBASE_ADMIN_EMAIL}`,
              private_key: `${process.env.FIREBASE_ADMIN_KEY}`,
            },
          },
          input: inputs.map((k) => ({
            keyword: k.keyword,
            domain: "https://www.walmart.com/",
          })),
        }

        await axios
          .post(
            `https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l95fol7l1ru6rlo116&include_errors=true&type=discover_new&discover_by=keyword&limit_per_input=${quantity}`,
            JSON.stringify(payload),
            {
              headers: {
                Authorization: `Bearer ${process.env.BRIGHT_DATA_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) =>
            SnapShotActions.AddSnapShotToBucket(
              userId,
              list?.name ?? "",
              snapshotBucketId ?? "",
              response.data
            )
          )
          .catch((error) => console.error(error))
      }
    )
    const amazonRequest = Object.entries(amazonGrouped).map(
      async ([quantity, inputs]) => {
        const payload = {
          deliver: {
            type: "gcs",
            filename: { template: "{[snapshot_id]}", extension: "csv" },
            bucket: `${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}`,
            credentials: {
              client_email: `${process.env.FIREBASE_ADMIN_EMAIL}`,
              private_key: `${process.env.FIREBASE_ADMIN_KEY}`,
            },
          },
          input: inputs.map((k) => ({
            keyword: k.keyword,
          })),
        }

        await axios
          .post(
            `https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l7q7dkf244hwjntr0&include_errors=true&type=discover_new&discover_by=keyword&limit_per_input=${quantity}`,
            JSON.stringify(payload),
            {
              headers: {
                Authorization: `Bearer ${process.env.BRIGHT_DATA_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) =>
            SnapShotActions.AddSnapShotToBucket(
              userId,
              list?.name ?? "",
              snapshotBucketId ?? "",
              response.data
            )
          )
          .catch((error) => console.error(error))
      }
    )
    await Promise.all([walmartRequest, amazonRequest])

    return {
      error: false,
      message: "Running KeyWord Search",
    }
  } catch (err: any) {
    console.error(err)
    return {
      error: true,
      message: typeof err === "string" ? err : "Unable to create an account.",
    }
  }
}
