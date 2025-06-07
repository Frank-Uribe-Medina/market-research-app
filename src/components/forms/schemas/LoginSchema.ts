import * as yup from "yup"

export const LoginSchema = yup.object({
  email: yup.string().trim().email("Please enter a valid email."),
  password: yup.string().trim().required("Password is required."),
})
