import { Box, Button, Typography } from "@mui/material"
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridFooterContainer,
  GridPagination,
  GridRowParams,
} from "@mui/x-data-grid"
import { useEffect, useState } from "react"

import { useUsers } from "../../lib/db/hooks/users"
import { User } from "../../types/user.model"
import ErrorBoundary from "../ErrorBoundary"
import UserPermissionsModal from "../modals/UserPermissions"

type FooterTableProps = {
  readonly fetchNextPage: () => void
  readonly isFetchingNextPage: boolean
  readonly hasNextPage: boolean
}

function CustomFooter({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: FooterTableProps) {
  return (
    <GridFooterContainer>
      <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
        <Button
          sx={{ ml: 1 }}
          onClick={() => void fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          Load More
        </Button>
      </Box>
      <GridPagination />
    </GridFooterContainer>
  )
}

const columns: GridColDef[] = [
  { field: "firstName", headerName: "First Name", flex: 1 },
  { field: "lastName", headerName: "Last Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "phone", headerName: "Phone", flex: 1 },
  {
    field: "actions",
    type: "actions",
    getActions: (params: GridRowParams<User>) => [
      <GridActionsCellItem
        key={params.id}
        icon={<UserPermissionsModal user={params.row} />}
        label="Edit"
      />,
    ],
  },
]

export default function UsersTable({ term }: { readonly term: string }) {
  const [rows, setRows] = useState<User[]>([])
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useUsers(term)

  useEffect(() => {
    if (data) {
      const temp: User[] = []
      data.pages.forEach((p) => p.content.map((c) => temp.push(c)))
      setRows(temp)
    }
  }, [data])

  if (isError) {
    return <Typography mt={2}>Failed to load list of users.</Typography>
  }

  return (
    <>
      <ErrorBoundary>
        <DataGrid
          loading={isLoading || isFetchingNextPage}
          rows={rows}
          columns={columns}
          density="standard"
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "Mui-even" : "Mui-odd"
          }
          slots={{
            footer: () => (
              <CustomFooter
                fetchNextPage={() => void fetchNextPage()}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
            ),
          }}
        />
      </ErrorBoundary>
    </>
  )
}
