"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPerson, getPersonClips, type Person, type Clip } from "@/lib/api";
import Timeline from "@/components/Timeline";

export default function PersonPage() {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([getPerson(id), getPersonClips(id)])
      .then(([p, c]) => {
        setPerson(p);
        setClips(c);
      })
      .catch(() => setError("정보를 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <p className="text-center text-gray-400 py-20">불러오는 중...</p>
    );
  }

  if (error || !person) {
    return (
      <p className="text-center text-gray-400 py-20">
        {error || "인물을 찾을 수 없습니다."}
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Person Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{person.name}</h1>
        <p className="text-gray-500 mt-1">
          {person.party} · {person.position}
        </p>
        <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
          {person.electionType}
        </span>
      </div>

      {/* Clip Timeline */}
      <h2 className="text-lg font-bold mb-4">
        클립 타임라인 ({clips.length}개)
      </h2>
      <Timeline clips={clips} />
    </div>
  );
}
