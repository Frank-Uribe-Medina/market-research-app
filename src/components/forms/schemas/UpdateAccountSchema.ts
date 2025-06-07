import * as yup from "yup"

const phoneRegExp = /^\d{3}-\d{3}-\d{4}$/

export const UpdateAccountSchema = yup.object({
  firstName: yup.string().trim().required("Please enter your first name."),
  lastName: yup.string().trim().required("Please enter your last name."),
  phone: yup
    .string()
    .trim()
    .required("Please enter your contact phone number")
    .matches(phoneRegExp, "Invalid Phone Number."),
})
