"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EcommerceRefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    startTransition(() => {
      router.refresh();
      setTimeout(() => setIsRefreshing(false), 600);
    });
  };

  const spinning = isPending || isRefreshing;

  return (
    <Button
      size="icon-sm"
      variant="outline"
      title="Refresh data from Supabase"
      onClick={handleRefresh}
      disabled={spinning}
    >
      <RefreshCw className={`size-3.5 text-muted-foreground ${spinning ? "animate-spin text-emerald-600" : ""}`} />
    </Button>
  );
}
