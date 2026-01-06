import * as yup from "yup"

export const AddSkuSchema = yup
  .object({
    sku: yup.string().trim().required("Please enter a valid SKU."),
    marketplace: yup.string().required("Please Select a MarketPlace"),
    countryCode: yup.number().required("Country Code REquired"),
  })
  .required()
export type FormValues = yup.InferType<typeof AddSkuSchema>
