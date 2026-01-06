import { ImageList, ImageListItem, Paper } from "@mui/material"

import { DatabaseProductData } from "../../../types/productdata.model"

interface Props {
  readonly productHistory: DatabaseProductData
}
export default function AssetsGrid({ productHistory }: Props) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        overflow: "auto",
        height: "100%",
      }}
    >
      <ImageList variant="masonry" cols={3} gap={8} sx={{ height: "100%" }}>
        {productHistory.images.map((item) => (
          <ImageListItem key={item}>
            <img
              srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${item}?w=248&fit=crop&auto=format`}
              alt={item}
              loading="lazy"
              style={{ borderRadius: 20 }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Paper>
  )
}
