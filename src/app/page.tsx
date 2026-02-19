"use client";

import { useEffect, useState } from "react";
import { getRecentClips, type Clip } from "@/lib/api";
import ClipCard from "@/components/ClipCard";

export default function Home() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRecentClips()
      .then(setClips)
      .catch(() => setError("클립을 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1a1a2e] text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            정치인의 말이 아닌
            <br />
            행동을 기록합니다
          </h1>
          <p className="mt-4 text-gray-300 text-lg">
            피선거권자의 영상 클립을 아카이빙하여
            <br className="hidden sm:block" />
            시민이 직접 확인하고 판단할 수 있도록 돕습니다.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <a
              href="/search"
              className="bg-[#4361ee] px-5 py-2.5 rounded-lg font-medium hover:bg-[#3a56d4] transition-colors"
            >
              인물 검색
            </a>
            <a
              href="/upload"
              className="border border-white/30 px-5 py-2.5 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              클립 등록
            </a>
          </div>
        </div>
      </section>

      {/* Recent Clips */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold mb-6">최근 등록된 클립</h2>

        {loading && (
          <p className="text-center text-gray-400 py-12">불러오는 중...</p>
        )}
        {error && (
          <p className="text-center text-gray-400 py-12">{error}</p>
        )}
        {!loading && !error && clips.length === 0 && (
          <p className="text-center text-gray-400 py-12">
            아직 등록된 클립이 없습니다.
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clips.map((clip) => (
            <ClipCard key={clip.id} clip={clip} />
          ))}
        </div>
      </section>
    </div>
  );
}
