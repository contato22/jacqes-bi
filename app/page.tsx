import { redirect } from "next/navigation";

/**
 * Root route redirects to AWQ Control Tower.
 * The old JACQES-only overview no longer serves as the home page —
 * the AWQ holding view is the authoritative entry point.
 */
export default function RootPage() {
  redirect("/awq");
}
