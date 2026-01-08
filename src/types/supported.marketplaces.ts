export type SupportedCountry = {
  code: number
  flagClass: string
  name: string
}

export type Marketplace = {
  label: string
  logo: string
  marketplace: string
  countries: SupportedCountry[]
}

export const MARKETPLACES: Marketplace[] = [
  {
    label: "Amazon",
    logo: "https://1000logos.net/wp-content/uploads/2016/10/Amazon-Logo-500x281.png",
    marketplace: "AMAZON",
    countries: [
      { code: 1, flagClass: "fi fi-us", name: "USA" },
      { code: 20, flagClass: "fi fi-eg", name: "Egypt" },
      { code: 52, flagClass: "fi fi-mx", name: "Mexico" },
    ],
  },
]
