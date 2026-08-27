import type { Metadata } from "next";
import { WritingArchive } from "@/components/writing/WritingArchive";

export const metadata: Metadata = { title: "Writing" };

export default function WritingPage() {
  return <WritingArchive />;
}
