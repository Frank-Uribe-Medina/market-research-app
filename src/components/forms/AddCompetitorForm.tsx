import { yupResolver } from "@hookform/resolvers/yup"
import InfoOutlineIcon from "@mui/icons-material/InfoOutline"
import {
  Box,
  Button,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-toastify"

import { User } from "../../types/user.model"
import MarketPlaces from "../Marketplaces"
import { AddCompetitorSchema } from "./schemas/AddCompetitorSchema"

interface Props {
  readonly isDisabled: boolean
  readonly subPlan: User["subplan"]
  readonly count: number | undefined
  readonly setIsDisabled: (value: boolean) => void
  readonly refetchKeywords: (value: boolean) => any
  readonly refetching: boolean
}

export default function AddCompetitorForm({
  setIsDisabled,
  subPlan,
  count,
  isDisabled,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddCompetitorSchema),
    defaultValues: {
      competitor_url: "",
      marketplaces: [],
      find_similar: false,
    },
  })

  const onSubmit = async (data: any) => {
    try {
      console.log(data)
      setIsDisabled(true)
      // await addingKeyword(data)
      setIsDisabled(false)
    } catch (err: any) {
      toast.error(err)
    }
  }
  // const addingKeyword = useDebouncedCallback(async (data: FormValues) => {
  //   try {
  //     const target = data

  //     const result = await KeyWordActions.AddKeyWord(
  //       snap.user?.id ?? "",
  //       target.competitor_url,
  //       target.marketplaces ?? ["noon"],

  //       subPlan
  //     )
  //     if (result.error) {
  //       throw result.message
  //     }
  //     toast.success("Successfully Added Keyword.")
  //     refetchKeywords(!refetching)
  //   } catch (err: any) {
  //     toast.error(typeof err === "string" ? err : "Unable to Add Keyword")
  //   }
  // }, 500)

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
            name="competitor_url"
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
                  // error={errors.keyword ? true : false}
                  // helperText={errors.keyword?.message ?? ""}
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
              name="marketplaces"
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
