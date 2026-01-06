import { Box, InputLabel, MenuItem, Select } from "@mui/material"
import { Controller, useWatch } from "react-hook-form"

type SupportedCountry = {
  code: number
  flagClass: string
  name: string
}

type Marketplace = {
  label: string
  logo: string
  marketplace: string
  countries: SupportedCountry[]
}

const MARKETPLACES: Marketplace[] = [
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

interface Props {
  readonly control: any
}
export default function MarketPlaces({ control }: Props) {
  const selectedMarketplace = useWatch({ name: "marketplace", control })
  return (
    <Box width={"100%"}>
      <Controller
        name="marketplace"
        control={control}
        render={({ field }) => (
          <Box>
            <InputLabel id="marketplace-available-label">
              Select Marketplace
            </InputLabel>
            <Select
              fullWidth
              labelId="marketplace-available-label"
              id="marketplace-available-id"
              value={field.value}
              label="Marketplace"
              onChange={(e) => {
                console.log(e.target.value)
                field.onChange(e.target.value as string)
              }}
            >
              {MARKETPLACES.map((marketplace) => {
                return (
                  <MenuItem value={marketplace.marketplace}>
                    {marketplace.label}
                  </MenuItem>
                )
              })}
            </Select>
          </Box>
        )}
      />
      {selectedMarketplace && (
        <Controller
          name="countryCode"
          control={control}
          render={({ field }) => (
            <Box>
              <InputLabel id="marketplace-country-label">
                Select Country
              </InputLabel>{" "}
              <Select
                fullWidth
                id="marketplace-countries-id"
                value={field.value ?? null}
                labelId="marketplace-country-label"
                label="Country"
                onChange={(e) => field.onChange(e.target.value as string)}
              >
                {MARKETPLACES.filter(
                  (marketplace) =>
                    marketplace.marketplace === selectedMarketplace
                )[0].countries.map((country) => (
                  <MenuItem value={country.code}>{country.name}</MenuItem>
                ))}
              </Select>
            </Box>
          )}
        />
      )}
    </Box>
  )
}
