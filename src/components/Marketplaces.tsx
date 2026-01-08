import { Box, InputLabel, MenuItem, Select } from "@mui/material"
import { Controller, useWatch } from "react-hook-form"

import { MARKETPLACES } from "../types/supported.marketplaces"

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
