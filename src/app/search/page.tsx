"use client";

import { useState } from "react";
import { getPersons, type Person } from "@/lib/api";
import PersonCard from "@/components/PersonCard";

const ELECTION_TYPES = ["전체", "지방선거", "국회의원선거", "대통령선거"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [electionType, setElectionType] = useState("전체");
  const [results, setResults] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const type = electionType === "전체" ? undefined : electionType;
      const data = await getPersons(query || undefined, type);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">인물 검색</h1>

      <form onSubmit={handleSearch} className="space-y-4 mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름으로 검색"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#4361ee]"
          />
          <button
            type="submit"
            className="bg-[#4361ee] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#3a56d4] transition-colors"
          >
            검색
          </button>
        </div>

        <div className="flex gap-2">
          {ELECTION_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setElectionType(type)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                electionType === type
                  ? "bg-[#4361ee] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </form>

      {loading && (
        <p className="text-center text-gray-400 py-12">검색 중...</p>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="text-center text-gray-400 py-12">
          검색 결과가 없습니다.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
}
