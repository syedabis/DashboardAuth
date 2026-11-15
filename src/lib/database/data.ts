import { createAdminClient } from "@/lib/supabase/admin";

export interface TableSummary {
  name: string;
  displayName: string;
  category: "E-Commerce" | "CRM" | "System";
  description: string;
  rowCount: number;
  columns: string[];
  rows: Record<string, unknown>[];
}

export async function fetchAllDatabaseTables(): Promise<TableSummary[]> {
  const supabase = createAdminClient();

  const results: TableSummary[] = [];

  // 1. ecommerce_orders
  try {
    const { data, count } = await supabase
      .from("ecommerce_orders")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(100);

    const rows = (data || []) as Record<string, unknown>[];
    const columns =
      rows.length > 0
        ? Object.keys(rows[0])
        : [
            "order_number",
            "customer_name",
            "country",
            "total_amount",
            "items_count",
            "status",
            "payment_status",
            "created_at",
          ];

    results.push({
      name: "ecommerce_orders",
      displayName: "Ecommerce Orders",
      category: "E-Commerce",
      description: "Customer purchasing records, invoices, totals, fulfillment and refund statuses.",
      rowCount: count ?? rows.length,
      columns,
      rows,
    });
  } catch (e) {
    console.error("Error loading ecommerce_orders:", e);
  }

  // 2. ecommerce_products
  try {
    const { data, count } = await supabase
      .from("ecommerce_products")
      .select("*", { count: "exact" })
      .order("total_revenue", { ascending: false });

    const rows = (data || []) as Record<string, unknown>[];
    const columns =
      rows.length > 0
        ? Object.keys(rows[0])
        : ["name", "stock_code", "category", "price", "sales_volume", "total_revenue"];

    results.push({
      name: "ecommerce_products",
      displayName: "Ecommerce Products",
      category: "E-Commerce",
      description: "SKU catalog, inventory pricing, sales volumes, and generated revenues.",
      rowCount: count ?? rows.length,
      columns,
      rows,
    });
  } catch (e) {
    console.error("Error loading ecommerce_products:", e);
  }

  // 3. ecommerce_monthly_stats
  try {
    const { data, count } = await supabase
      .from("ecommerce_monthly_stats")
      .select("*", { count: "exact" })
      .order("month_num", { ascending: true });

    const rows = (data || []) as Record<string, unknown>[];
    const columns = rows.length > 0 ? Object.keys(rows[0]) : ["period", "month_num", "year", "revenue", "orders_count"];

    results.push({
      name: "ecommerce_monthly_stats",
      displayName: "Ecommerce Monthly Trends",
      category: "E-Commerce",
      description: "Aggregated monthly historical revenue and order quantities across the fiscal year.",
      rowCount: count ?? rows.length,
      columns,
      rows,
    });
  } catch (e) {
    console.error("Error loading ecommerce_monthly_stats:", e);
  }

  // 4. crm_opportunities
  try {
    const { data, count } = await supabase
      .from("crm_opportunities")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    const rows = (data || []) as Record<string, unknown>[];
    const columns =
      rows.length > 0
        ? Object.keys(rows[0])
        : [
            "opportunity_code",
            "account",
            "stage",
            "priority",
            "health",
            "value",
            "contact_person",
            "expected_close_date",
          ];

    results.push({
      name: "crm_opportunities",
      displayName: "CRM Opportunities",
      category: "CRM",
      description: "Sales pipeline deals, lead stages, account values, priority, and closing health.",
      rowCount: count ?? rows.length,
      columns,
      rows,
    });
  } catch (e) {
    console.error("Error loading crm_opportunities:", e);
  }

  // 5. crm_pipeline_stats
  try {
    const { data, count } = await supabase
      .from("crm_pipeline_stats")
      .select("*", { count: "exact" })
      .order("month_num", { ascending: true });

    const rows = (data || []) as Record<string, unknown>[];
    const columns =
      rows.length > 0
        ? Object.keys(rows[0])
        : [
            "period",
            "month_num",
            "year",
            "qualified_leads",
            "discovery_calls",
            "proposals_sent",
            "closed_deals",
            "pipeline_value",
          ];

    results.push({
      name: "crm_pipeline_stats",
      displayName: "CRM Pipeline Trends",
      category: "CRM",
      description: "Monthly conversion metrics from qualified leads to discovery calls and closed deals.",
      rowCount: count ?? rows.length,
      columns,
      rows,
    });
  } catch (e) {
    console.error("Error loading crm_pipeline_stats:", e);
  }

  // 6. crm_meetings
  try {
    const { data, count } = await supabase
      .from("crm_meetings")
      .select("*", { count: "exact" })
      .order("meeting_date", { ascending: true });

    const rows = (data || []) as Record<string, unknown>[];
    const columns =
      rows.length > 0 ? Object.keys(rows[0]) : ["title", "company", "time_slot", "meeting_date", "status"];

    results.push({
      name: "crm_meetings",
      displayName: "CRM Scheduled Meetings",
      category: "CRM",
      description: "Upcoming client demos, security reviews, and stakeholder alignment meetings.",
      rowCount: count ?? rows.length,
      columns,
      rows,
    });
  } catch (e) {
    console.error("Error loading crm_meetings:", e);
  }

  // 7. auth.users (System Users)
  try {
    const { data: authData } = await supabase.auth.admin.listUsers();
    if (authData?.users) {
      const userRows = authData.users.map((u) => ({
        id: u.id,
        email: u.email,
        name: (u.user_metadata?.name as string) || u.email?.split("@")[0],
        role: (u.user_metadata?.role as string) || "member",
        email_confirmed: u.email_confirmed_at ? "Yes" : "No",
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at || "Never",
      }));

      results.push({
        name: "auth_users",
        displayName: "System Users (auth.users)",
        category: "System",
        description: "Registered admin and member accounts authenticated with Supabase Auth.",
        rowCount: userRows.length,
        columns: ["id", "name", "email", "role", "email_confirmed", "created_at", "last_sign_in_at"],
        rows: userRows,
      });
    }
  } catch (e) {
    console.error("Error loading auth users:", e);
  }

  return results;
}
