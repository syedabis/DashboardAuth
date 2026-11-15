"use client";

import { useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Database,
  Download,
  FileSpreadsheet,
  Layers,
  RefreshCw,
  Search,
  ShieldCheck,
  Table as TableIcon,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TableSummary } from "@/lib/database/data";

interface DatabaseExplorerProps {
  tables: TableSummary[];
  adminEmail: string;
}

function getCategoryIcon(category: string) {
  if (category === "E-Commerce") {
    return <FileSpreadsheet className="size-4 shrink-0" />;
  }
  if (category === "CRM") {
    return <Layers className="size-4 shrink-0" />;
  }
  return <Users className="size-4 shrink-0" />;
}

function formatCellValue(key: string, value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground text-xs italic">null</span>;
  }

  const str = String(value);

  // Currency columns
  const lowerKey = key.toLowerCase();
  if (
    (lowerKey.includes("amount") ||
      lowerKey.includes("price") ||
      lowerKey.includes("value") ||
      lowerKey.includes("revenue")) &&
    typeof value === "number"
  ) {
    return (
      <span className="font-medium font-mono">
        ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    );
  }

  // Status badges
  if (
    lowerKey === "status" ||
    lowerKey === "payment_status" ||
    lowerKey === "fulfillment_status" ||
    lowerKey === "health"
  ) {
    const variant: "default" | "secondary" | "destructive" | "outline" = "outline";
    const valLower = str.toLowerCase();

    if (valLower === "completed" || valLower === "paid" || valLower === "fulfilled" || valLower === "on track") {
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400"
        >
          {str}
        </Badge>
      );
    }
    if (valLower === "returned" || valLower === "refunded" || valLower === "at risk") {
      return (
        <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-[10px] text-red-600 dark:text-red-400">
          {str}
        </Badge>
      );
    }
    if (valLower === "pending" || valLower === "unfulfilled" || valLower === "needs review" || valLower === "on hold") {
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-600 dark:text-amber-400"
        >
          {str}
        </Badge>
      );
    }

    return (
      <Badge variant={variant} className="text-[10px]">
        {str}
      </Badge>
    );
  }

  // Role badges
  if (lowerKey === "role") {
    const isAdmin = str.toLowerCase() === "admin" || str.toLowerCase() === "administrator";
    return (
      <Badge variant={isAdmin ? "default" : "secondary"} className="text-[10px] capitalize">
        {str}
      </Badge>
    );
  }

  // Date strings
  if (lowerKey.includes("date") || lowerKey.includes("_at")) {
    try {
      const d = new Date(str);
      if (!Number.isNaN(d.getTime())) {
        return (
          <span className="font-mono text-[11px] text-muted-foreground">
            {d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </span>
        );
      }
    } catch {
      // fallback
    }
  }

  return (
    <span className="block max-w-[200px] truncate text-xs" title={str}>
      {str}
    </span>
  );
}

export function DatabaseExplorer({ tables, adminEmail }: DatabaseExplorerProps) {
  const [selectedTableName, setSelectedTableName] = useState<string>(tables[0]?.name ?? "ecommerce_orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const activeTable = useMemo(
    () => tables.find((t) => t.name === selectedTableName) ?? tables[0],
    [tables, selectedTableName],
  );

  const totalRecordsAcrossDb = useMemo(() => tables.reduce((acc, t) => acc + t.rowCount, 0), [tables]);

  const filteredRows = useMemo(() => {
    if (!activeTable) return [];
    if (!searchQuery.trim()) return activeTable.rows;

    const query = searchQuery.toLowerCase().trim();
    return activeTable.rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [activeTable, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  const handleTableChange = (name: string) => {
    setSelectedTableName(name);
    setCurrentPage(1);
    setSearchQuery("");
  };

  const handleDownloadCsv = () => {
    if (!activeTable || activeTable.rows.length === 0) return;
    const headers = activeTable.columns;
    const lines = [headers.join(",")];

    for (const row of activeTable.rows) {
      const vals = headers.map((h) => {
        const v = String(row[h] ?? "");
        return v.includes(",") || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v;
      });
      lines.push(vals.join(","));
    }

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${activeTable.name}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-bold text-3xl tracking-tight">Database Explorer</h1>
            <Badge
              variant="outline"
              className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-medium text-[11px] text-emerald-600 dark:text-emerald-400"
            >
              <ShieldCheck className="size-3" />
              Admin Restricted
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Inspect, filter, and export all live PostgreSQL tables synced with Supabase. Logged in as{" "}
            <span className="font-semibold text-foreground">{adminEmail}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            onClick={() => window.location.reload()}
            title="Refresh database records"
          >
            <RefreshCw className="size-3.5" />
            Refresh Tables
          </Button>

          <Button
            size="sm"
            variant="default"
            className="gap-1.5 bg-emerald-600 text-white text-xs hover:bg-emerald-500"
            onClick={handleDownloadCsv}
            disabled={!activeTable || activeTable.rows.length === 0}
          >
            <Download className="size-3.5" />
            Export Table CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TableIcon className="size-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Total Tables</p>
              <p className="font-bold text-2xl leading-tight">{tables.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Layers className="size-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Total Records</p>
              <p className="font-bold text-2xl leading-tight">{totalRecordsAcrossDb.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Database className="size-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Database Provider</p>
              <p className="font-semibold text-base leading-tight">Supabase (Postgres 15)</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Security Access</p>
              <p className="font-semibold text-base leading-tight">Admin Level (RLS On)</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content: Tables Sidebar & Table View */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Table Selector Sidebar */}
        <div className="space-y-4 lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-semibold text-sm">Available Tables</CardTitle>
              <CardDescription className="text-xs">Select a table to inspect live records.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 p-2">
              {tables.map((t) => {
                const isSelected = t.name === selectedTableName;
                return (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => handleTableChange(t.name)}
                    className={`flex w-full items-center justify-between rounded-lg p-2.5 text-left text-xs transition ${
                      isSelected
                        ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      {getCategoryIcon(t.category)}
                      <span className="truncate">{t.displayName}</span>
                    </div>

                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 font-mono text-[10px] ${
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {t.rowCount}
                    </span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Table Records View */}
        <div className="space-y-4 lg:col-span-9">
          {activeTable ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="font-bold font-mono text-base">public.{activeTable.name}</CardTitle>
                      <Badge variant="secondary" className="text-[10px]">
                        {activeTable.category}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1 text-xs">
                      {activeTable.description} ({filteredRows.length}{" "}
                      {filteredRows.length === 1 ? "record" : "records"} found)
                    </CardDescription>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={`Search ${activeTable.displayName}...`}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-8 pl-8 text-xs"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Responsive Table Container */}
                <div className="overflow-x-auto border-t">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-12 text-center text-[11px]">#</TableHead>
                        {activeTable.columns.map((col) => (
                          <TableHead key={col} className="whitespace-nowrap font-semibold text-[11px] capitalize">
                            {col.replace(/_/g, " ")}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRows.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={activeTable.columns.length + 1}
                            className="h-32 text-center text-muted-foreground text-xs"
                          >
                            No records found matching your query.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedRows.map((row, idx) => {
                          const rowNum = (currentPage - 1) * pageSize + idx + 1;
                          return (
                            <TableRow key={`row-${rowNum}`} className="transition hover:bg-muted/40">
                              <TableCell className="text-center font-mono text-[11px] text-muted-foreground">
                                {rowNum}
                              </TableCell>
                              {activeTable.columns.map((col) => (
                                <TableCell key={`${rowNum}-${col}`} className="whitespace-nowrap text-xs">
                                  {formatCellValue(col, row[col])}
                                </TableCell>
                              ))}
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col gap-2 border-t p-3 text-muted-foreground text-xs sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <Select
                      value={String(pageSize)}
                      onValueChange={(val) => {
                        setPageSize(Number(val));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="h-7 w-16 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>

                    <span className="hidden sm:inline">
                      Showing {(currentPage - 1) * pageSize + 1} to{" "}
                      {Math.min(currentPage * pageSize, filteredRows.length)} of {filteredRows.length} rows
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-1">
                    <span className="mr-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-7"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                    >
                      <ChevronLeft className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-7"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                    >
                      <ChevronRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center text-muted-foreground text-xs">No tables found in Supabase.</Card>
          )}
        </div>
      </div>
    </div>
  );
}
