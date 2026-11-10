import { PageTransition } from "@/components/scroll-pager";

/** Re-mounts on every navigation, so each page gets its entrance transition. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
