import * as yup from "yup"

export const AddCompetitorSchema = yup
  .object({
    competitor_url: yup
      .string()
      .trim()
      .required("Please enter a competitors url."),
    marketplaces: yup
      .array(yup.string().required())
      .min(1, "Select at least one marketplace"),
    find_similar: yup.bool().required(),
  })
  .required()
export type FormValues = yup.InferType<typeof AddCompetitorSchema>
