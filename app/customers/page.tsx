import { redirect } from "next/navigation";

/**
 * Legacy route — redirects to JACQES scoped customers page.
 * Customer data is now accessed through the isolated BU view.
 */
export default function CustomersPage() {
  redirect("/jacqes/customers");
}
