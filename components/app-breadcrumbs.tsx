"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const LABEL_MAP: Record<string, string> = {
  "": "Dashboard",
  chat: "Dialogue",
};

export function AppBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // 根路径：仅显示 Dashboard
  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{LABEL_MAP[""]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const items = [];
  let acc = "";
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    acc += `/${seg}`;
    const isLast = i === segments.length - 1;
    const label = LABEL_MAP[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);

    if (!isLast) {
      items.push(
        <BreadcrumbItem key={acc}>
          <BreadcrumbLink asChild>
            <Link href={acc}>{label}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      );
      items.push(<BreadcrumbSeparator key={`${acc}-sep`} />);
    } else {
      items.push(
        <BreadcrumbItem key={acc}>
          <BreadcrumbPage>{label}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>{items}</BreadcrumbList>
    </Breadcrumb>
  );
}


