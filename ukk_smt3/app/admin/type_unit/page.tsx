"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const tableData = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "Admin",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    email: "marcus.rodriguez@example.com",
    role: "User",
  },
  {
    id: "3",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    role: "User",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@example.com",
    role: "Editor",
  },
]

export default function CheckboxInTable() {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(
    new Set(["1"])
  )

  const selectAll =
    tableData.length > 0 && selectedRows.size === tableData.length

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(tableData.map((row) => row.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRows(newSelected)
  }

  return (
    <Card className="m-6 px-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mb-1 text-2xl font-bold">User Management</h1>
          <p className="text-sm text-muted-foreground">Kelola akun pengguna.</p>
        </div>
        <Button onClick={() => router.push("/admin/user-management/form/add")}>
          <Plus aria-hidden="true" />
          Tambah user
        </Button>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-5 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">
                <Checkbox
                  id="select-all-checkbox"
                  name="select-all-checkbox"
                  checked={selectAll}
                  onCheckedChange={(checked) =>
                    handleSelectAll(checked === true)
                  }
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row) => (
              <TableRow
                key={row.id}
                data-state={selectedRows.has(row.id) ? "selected" : undefined}
              >
                <TableCell>
                  <Checkbox
                    id={`row-${row.id}-checkbox`}
                    name={`row-${row.id}-checkbox`}
                    checked={selectedRows.has(row.id)}
                    onCheckedChange={(checked) =>
                      handleSelectRow(row.id, checked === true)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

function getPageItems(
  currentPage: number,
  totalPages: number
): Array<number | "ellipsis"> {
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }
  if (currentPage <= 2) return [1, 2, 3, "ellipsis"]
  if (currentPage >= totalPages - 1) {
    return ["ellipsis", totalPages - 2, totalPages - 1, totalPages]
  }
  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
  ]
}