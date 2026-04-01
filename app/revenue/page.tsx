import { redirect } from "next/navigation";

/**
 * Legacy route — redirects to JACQES scoped revenue page.
 * Revenue data is now accessed through the isolated BU view.
 */
export default function RevenuePage() {
  redirect("/jacqes/revenue");
}
