import Link from "next/link";
import { topicHref } from "@/lib/utils";

export default function TopicList({
  topics,
  active,
}: {
  topics: [string, number][];
  active?: string;
}) {
  if (topics.length === 0) return null;

  return (
    <nav className="topics" aria-label="Chủ đề">
      <Link href="/#bai-viet" className={active ? "" : "active"}>Tất cả</Link>
      {topics.map(([topic, count]) => (
        <Link key={topic} href={topicHref(topic)} className={topic === active ? "active" : ""}>
          {topic} <span>{count}</span>
        </Link>
      ))}
    </nav>
  );
}
