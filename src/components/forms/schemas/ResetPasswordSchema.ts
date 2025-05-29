import * as yup from "yup"

export const ResetPasswordSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email("invalid email format.")
      .required("Email is required."),
  })
  .required()
