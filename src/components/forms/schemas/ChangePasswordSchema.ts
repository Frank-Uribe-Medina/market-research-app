import * as yup from "yup"

export const ChangePasswordSchema = yup.object({
  password: yup
    .string()
    .trim()
    .required("Password is required.")
    .min(6, "Password is too weak."),
  confirmPassword: yup
    .string()
    .trim()
    .required("Password is required.")
    .oneOf([yup.ref("password")], "Password does not match"),
})
