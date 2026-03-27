"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import AWQSidebar from "./AWQSidebar";

export default function SidebarWrapper() {
  const pathname = usePathname();
  const isAWQSection = pathname.startsWith("/awq");

  if (isAWQSection) {
    return <AWQSidebar />;
  }

  return <Sidebar />;
}
