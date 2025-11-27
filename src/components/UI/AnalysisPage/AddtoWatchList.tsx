import { yupResolver } from "@hookform/resolvers/yup"
import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import {
  Box,
  Button,
  Slider,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { useDebouncedCallback } from "use-debounce"
import { useSnapshot } from "valtio"

import state from "../../../contexts/ValtioStore"
import { KeyWordActions } from "../../../lib/db/actions/KeyWords"
import { User } from "../../../types/user.model"
import { AddKeywordSchema } from "../../forms/schemas/AddKeywordSchema"
import MarketPlaces from "../../Marketplaces"

type FormValues = {
  keyword: string
  marketplaces: string[]
  limitInput: number
  isSpecificProduct: boolean
}

interface Props {
  readonly isDisabled: boolean
  readonly subPlan: User["subplan"]
  readonly count: number | undefined
  readonly setIsDisabled: (value: boolean) => void
  readonly refetchKeywords: (value: boolean) => any
  readonly refetching: boolean
}

export default function AddtoWatchList({
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
    resolver: yupResolver(AddKeywordSchema),
    defaultValues: {
      keyword: "",
      marketplaces: ["Noon"],
      limitInput: 2,
      isSpecificProduct: true,
    },
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

      const result = await KeyWordActions.AddKeyWord(
        snap.user?.id ?? "",
        target.keyword,
        target.marketplaces ?? ["noon"],
        target.limitInput,
        target.isSpecificProduct,
        subPlan
      )
      if (result.error) {
        throw result.message
      }
      toast.success("Successfully Added Keyword.")
      refetchKeywords(!refetching)
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Unable to Add Keyword")
    }
  }, 500)

  const onError = (errors: any) => {
    toast.error(errors)
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Controller
            name="keyword"
            control={control}
            render={({ field }) => (
              <Box>
                <Typography display={"flex"} gap={1}>
                  {" "}
                  <Tooltip title="Search Terms can be model numbers, serial numbers, or just plain phrases like 'Gift Ideas for Her'. Inputting phrases will return the top results of that search terms query on desired marketplace.">
                    <InfoOutlineIcon />
                  </Tooltip>
                  Add Search Term
                </Typography>

                <TextField
                  {...field}
                  fullWidth
                  placeholder="e.g. Makeup "
                  error={errors.keyword ? true : false}
                  helperText={errors.keyword?.message ?? ""}
                />
              </Box>
            )}
          />
          <Box display={"flex"} flexDirection={"column"} gap={2}>
            <Controller
              name="marketplaces"
              control={control}
              render={({ field }) => (
                <Box>
                  <Typography display={"flex"} gap={1}>
                    {" "}
                    <Tooltip title="Which Marketplace do you want to search with this keyword.">
                      <InfoOutlineIcon />
                    </Tooltip>
                    Marketplace Search
                  </Typography>
                  <MarketPlaces
                    selectedStores={field.value ?? ["Noon"]}
                    setSelectedStores={field.onChange}
                  />
                  {errors.marketplaces && (
                    <Typography color="error" variant="caption">
                      {errors.marketplaces.message as string}
                    </Typography>
                  )}
                </Box>
              )}
            />
            <Controller
              name="isSpecificProduct"
              control={control}
              render={({ field }) => (
                <Box>
                  <Typography display={"flex"} gap={1}>
                    {" "}
                    <Tooltip title="Which Marketplace do you want to search with this keyword.">
                      <InfoOutlineIcon />
                    </Tooltip>
                    Is this a Specifc Prouct?
                  </Typography>
                  <Switch
                    aria-label="Is this a Specifc Prouct?"
                    defaultChecked
                    onChange={(e) => field.onChange(e.target.checked)}
                  />

                  {errors.marketplaces && (
                    <Typography color="error" variant="caption">
                      {errors.marketplaces.message as string}
                    </Typography>
                  )}
                </Box>
              )}
            />
          </Box>
        </Box>
        <Controller
          name="limitInput"
          control={control}
          render={({ field }) => (
            <>
              <Typography display={"flex"} gap={1}>
                <Tooltip title="This is how many results you want returned to you based on the order of items on the page. E.g When you search Headphones and you only want the top 5 Results .">
                  <InfoOutlineIcon />
                </Tooltip>
                Top: <span style={{ fontWeight: 700 }}>{field.value}</span>
                Results
              </Typography>
              <Slider
                value={field.value}
                min={2}
                step={1}
                max={10}
                onChange={field.onChange}
                valueLabelDisplay="auto"
                aria-labelledby="non-linear-slider"
                marks
              />
            </>
          )}
        />
        <Typography>
          Term Limit {count ?? 0} / {subPlan === "free" ? 10 : null}{" "}
          {subPlan === "pro" ? 50 : null} {subPlan === "business" ? 300 : null}
        </Typography>

        <Button
          type="submit"
          disabled={isDisabled}
          variant="contained"
          fullWidth
        >
          Submit
        </Button>
      </Box>
    </form>
  )
}
