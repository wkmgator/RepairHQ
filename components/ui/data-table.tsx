"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"
import { useIsRtl } from "@/lib/rtl-utils"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const t = useTranslations("dataTable")
  const isRtl = useIsRtl()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  // Determine pagination controls based on RTL
  const PrevButton = isRtl ? ChevronRight : ChevronLeft
  const NextButton = isRtl ? ChevronLeft : ChevronRight

  return (
    <div>
      {searchKey && (
        <div className="flex items-center py-4">
          <div className="relative max-w-sm">
            <Search className={cn("absolute top-2.5 h-4 w-4 text-muted-foreground", isRtl ? "right-3" : "left-3")} />
            <Input
              placeholder={searchPlaceholder || t("search")}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
              className={cn(isRtl ? "pr-9 text-right" : "pl-9")}
            />
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={cn(isRtl ? "text-right" : "")}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cn(isRtl ? "text-right" : "")}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className={cn("flex items-center justify-end space-x-2 py-4", isRtl && "flex-row-reverse space-x-reverse")}>
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          <PrevButton className="h-4 w-4" />
        </Button>
        <div
          className={cn("flex w-[100px] items-center justify-center text-sm font-medium", isRtl && "flex-row-reverse")}
        >
          {t("page")} {table.getState().pagination.pageIndex + 1} {t("of")} {table.getPageCount()}
        </div>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          <NextButton className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
