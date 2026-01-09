import { yupResolver } from "@hookform/resolvers/yup"
import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import {
  Box,
  Button,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { useDebouncedCallback } from "use-debounce"
import { useSnapshot } from "valtio"

import state from "../../contexts/ValtioStore"
import { KeyWordActions } from "../../lib/db/actions/KeyWords"
import { User } from "../../types/user.model"
import MarketPlaces from "../Marketplaces"
import { AddSkuSchema } from "./schemas/AddSkuSchema"

type FormValues = {
  sku: string
  marketplace: string
  countryCode: number
}

interface Props {
  readonly isDisabled: boolean
  readonly subPlan: User["subplan"]
  readonly count: number | undefined
  readonly setIsDisabled: (value: boolean) => void
  readonly refetchKeywords: (value: boolean) => any
  readonly refetching: boolean
}

export default function AddKeywordForm({
  setIsDisabled,
  subPlan,
  count,
  isDisabled,
  refetchKeywords,
  refetching,
}: Props) {
  const snap = useSnapshot(state)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddSkuSchema),
  })

  const onSubmit = async (data: any) => {
    try {
      setIsDisabled(true)
      await addingKeyword(data)
      setIsDisabled(false)
    } catch (err: any) {
      toast.error(err)
    }
  }
  const addingKeyword = useDebouncedCallback(async (data: FormValues) => {
    try {
      const target = data

      const result = await KeyWordActions.AddSKu(
        snap.user?.id ?? "",
        target.sku,
        target.marketplace,
        target.countryCode,
        subPlan
      )
      if (result.error) {
        throw result.message
      }
      toast.success("Successfully Added SKU.")
      refetchKeywords(!refetching)
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Unable to Add SKU")
    }
  }, 500)

  const onError = (errors: any) => {
    toast.error(errors)
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Grid container>
          <Grid size={{ xs: 12 }}>
            {" "}
            <Controller
              name="sku"
              control={control}
              render={({ field }) => (
                <Box width={"100%"}>
                  <Typography display={"flex"} gap={1}>
                    {" "}
                    <Tooltip title="SKU can be ASINS, Product ID, whatever the platform youre searching uses internally.">
                      <InfoOutlineIcon />
                    </Tooltip>
                    Add SKU
                  </Typography>

                  <TextField
                    {...field}
                    fullWidth
                    placeholder="e.g. B094KYXQYN "
                    error={errors.sku ? true : false}
                    helperText={errors.sku?.message ?? ""}
                  />
                </Box>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <MarketPlaces control={control} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography>
              Term Limit {count ?? 0} / {subPlan === "free" ? 10 : null}{" "}
              {subPlan === "pro" ? 50 : null}{" "}
              {subPlan === "business" ? 300 : null}
            </Typography>
            <Button
              type="submit"
              disabled={isDisabled}
              variant="contained"
              fullWidth
            >
              Add ASIN
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  )
}
