import Link from "next/link";

import { ArrowLeft, Lock, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AccessDeniedProps {
  email: string;
  role: string;
}

export function AccessDenied({ email, role }: AccessDeniedProps) {
  return (
    <div className="flex min-h-[65vh] items-center justify-center p-4">
      <Card className="w-full max-w-md border-destructive/20 text-center shadow-lg">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <ShieldAlert className="size-8" />
          </div>
          <CardTitle className="font-bold text-xl">Admin Access Restricted</CardTitle>
          <CardDescription className="text-xs">
            The Database Explorer is restricted to administrators only.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2 text-xs">
          <div className="space-y-2 rounded-xl border bg-muted/40 p-3.5 text-left">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Account:</span>
              <span className="max-w-[200px] truncate font-semibold text-foreground">{email || "Unknown"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current Role:</span>
              <Badge variant="secondary" className="text-[11px] capitalize">
                {role || "member"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Required Role:</span>
              <Badge variant="default" className="bg-emerald-600 text-[11px] text-white">
                <Lock className="mr-1 size-3" />
                administrator
              </Badge>
            </div>
          </div>

          <p className="text-muted-foreground text-xs leading-relaxed">
            If you need access to raw database tables, please contact your workspace administrator to elevate your
            account permissions.
          </p>
        </CardContent>

        <CardFooter className="flex justify-center pt-2">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/dashboard/ecommerce">
              <ArrowLeft className="size-4" />
              Return to Dashboard
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
