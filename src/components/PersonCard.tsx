import Link from "next/link";
import type { Person } from "@/lib/api";

export default function PersonCard({ person }: { person: Person }) {
  return (
    <Link
      href={`/person/${person.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-[#4361ee] transition-colors"
    >
      <h3 className="text-lg font-bold text-gray-900">{person.name}</h3>
      <p className="text-sm text-gray-500 mt-1">
        {person.party} · {person.position}
      </p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {person.electionType}
        </span>
        {person.clipCount !== undefined && (
          <span className="text-xs text-gray-400">
            클립 {person.clipCount}개
          </span>
        )}
      </div>
    </Link>
  );
}
