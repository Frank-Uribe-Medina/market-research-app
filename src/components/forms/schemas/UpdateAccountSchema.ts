import * as yup from "yup"

const phoneRegExp = /^\d{3}-\d{3}-\d{4}$/

export const UpdateAccountSchema = yup.object({
  name: yup.string().trim().required("Please enter your full name."),
  phone: yup
    .string()
    .trim()
    .required("Please enter your contact phone number")
    .matches(phoneRegExp, "Invalid Phone Number."),
})
