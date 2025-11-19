import * as yup from "yup"

export const AddKeywordSchema = yup
  .object({
    keyword: yup.string().trim().required("Please enter a keyword."),
    marketplaces: yup
      .array(yup.string().required())
      .min(1, "Select at least one marketplace"),
    limitInput: yup.number().required(),
  })
  .required()
export type FormValues = yup.InferType<typeof AddKeywordSchema>
