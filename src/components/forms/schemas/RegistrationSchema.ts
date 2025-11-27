import * as yup from "yup"

const phoneRegExp = /^\d{3}-\d{3}-\d{4}$/

export const RegistrationSchema = yup
  .object({
    name: yup.string().trim().required("Please enter your full name."),
    phone: yup
      .string()
      .trim()
      .required("Please enter your contact phone number.")
      .matches(phoneRegExp, "Invalid phone number."),
    email: yup
      .string()
      .trim()
      .email("Invalid email.")
      .required("Email is required."),
    confirmEmail: yup
      .string()
      .trim()
      .email("Invalid email.")
      .required("Email is required.")
      .oneOf([yup.ref("email")], "Emails do not match."),
    password: yup
      .string()
      .trim()
      .required("Password is required.")
      .min(6, "Password length should at least be 6 characters."),
    confirmPassword: yup
      .string()
      .trim()
      .required("Password is required.")
      .oneOf([yup.ref("password")], "Passwords do not match."),
  })
  .required()
