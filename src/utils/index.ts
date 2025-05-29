import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import isBetween from "dayjs/plugin/isBetween"
import relativeTime from "dayjs/plugin/relativeTime"
import timezone from "dayjs/plugin/timezone"
import updateLocale from "dayjs/plugin/updateLocale"
import utc from "dayjs/plugin/utc"

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(isBetween)
dayjs.extend(timezone)

/*
 * Generate radom string that consist of letters and numbers
 */

export const randomStr = (length = 10) => {
  let result = ""
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

/*
 * Format number to dollars returns $xxx.xx format
 */
export const numberToCurrencyStr = (num: number) => {
  if (!num || Number.isNaN(num) || num.toString() === "TBD") {
    return "TBD"
  }
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })
}

export const stringsToArray = (term: string) => {
  return term
    .trim() // remove lingering spaces
    .toUpperCase() // transform all text to uppercase
    .replaceAll(/[^\d A-Za-z]/g, " ") // change special characters to spaces
    .replaceAll(/\s\s+/g, " ") // change multiple concurrent spaces to single spaces
    .split(" ") // transform string to array of strings
}

/*
 * Return firebase date as formated string
 * the return value should NOT be reformatted again. It will loose date time precision
 */
export const formatFirebaseDate = (
  date: any,
  format = "YYYY-MM-DDTHH:mm:ssZ"
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!date.toDate) {
    return dayjs(date).tz("America/Los_Angeles").format(format)
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return dayjs(date.toDate()).tz("America/Los_Angeles").format(format)
}

/*
 * Removes all special characters from a string and string of numbers
 */
export const numbersOnly = (str: string) => {
  return str.replaceAll(/\D/g, "")
}

/*
 * Format number to with max and min decimals. returns xxx.xxx
 */
export const formatNumberToDollars = (
  num: number,
  maxDecimals = 6,
  minDecimals = 0
): string => {
  try {
    if (!num || Number.isNaN(+num)) return "0"

    // count how many zeros between decimal point and a non zero number
    const zerosCount = -Math.floor(Math.log10(+num) + 1)

    // if zerosCount is positive number, use zero count + 4
    // if zerosCount is negative number use maxDecimals prop
    const options = {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: zerosCount > 0 ? zerosCount + 4 : maxDecimals,
    }
    return new Intl.NumberFormat("en-US", options).format(Number(num))
  } catch {
    return "0"
  }
}

/*
 * Replaces text middle text to "....", returns example: str...ing
 */

export function truncateMiddle(text: string | number, maxLength = 15) {
  const temp = text.toString()
  if (temp.length <= maxLength) {
    return temp // Return the text unchanged if it's shorter than maxLength
  }

  const half = Math.floor((maxLength - 3) / 2) // Account for "..." (3 characters)
  const start = temp.slice(0, half)
  const end = temp.slice(-half)

  return `${start}...${end}`
}

/*
 * Checks if object doesnt have any key,values. returns a boolean
 */
export const isObjectEmpty = (obj: object) => {
  return Object.keys(obj).length === 0
}

export const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOsrKyoBwAEyAHrxvdSbAAAAABJRU5ErkJggg=="
