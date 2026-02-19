"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { getPersons, createClip, type Person } from "@/lib/api";
import VideoEmbed from "@/components/VideoEmbed";

export default function UploadPage() {
  const { isLoggedIn, token } = useAuth();
  const router = useRouter();

  const [persons, setPersons] = useState<Person[]>([]);
  const [personQuery, setPersonQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [videoUrl, setVideoUrl] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [description, setDescription] = useState("");
  const [clipDate, setClipDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (personQuery.length < 1) {
      setPersons([]);
      return;
    }
    const timer = setTimeout(() => {
      getPersons(personQuery).then(setPersons).catch(() => setPersons([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [personQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPerson || !token) return;
    setSubmitting(true);
    setError("");
    try {
      await createClip(
        {
          personId: selectedPerson.id,
          videoUrl,
          timestamp: timestamp || undefined,
          description,
          clipDate,
        },
        token
      );
      router.push(`/person/${selectedPerson.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">클립 등록</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Person selector */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">인물 선택</label>
          {selectedPerson ? (
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5">
              <span className="flex-1">
                {selectedPerson.name} ({selectedPerson.party})
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedPerson(null);
                  setPersonQuery("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                변경
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                value={personQuery}
                onChange={(e) => {
                  setPersonQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="이름으로 검색"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#4361ee]"
              />
              {showDropdown && persons.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                  {persons.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPerson(p);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50"
                      >
                        {p.name}{" "}
                        <span className="text-sm text-gray-400">
                          {p.party}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium mb-1">영상 URL</label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#4361ee]"
          />
        </div>

        {/* Preview */}
        {videoUrl && (
          <div>
            <p className="text-sm font-medium mb-1">미리보기</p>
            <VideoEmbed url={videoUrl} timestamp={timestamp} />
          </div>
        )}

        {/* Timestamp */}
        <div>
          <label className="block text-sm font-medium mb-1">
            타임스탬프 (선택)
          </label>
          <input
            type="text"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="HH:MM:SS"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#4361ee]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">한줄 설명</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="이 영상에서 어떤 일이 있었나요?"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#4361ee]"
          />
        </div>

        {/* Clip Date */}
        <div>
          <label className="block text-sm font-medium mb-1">영상 날짜</label>
          <input
            type="date"
            value={clipDate}
            onChange={(e) => setClipDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#4361ee]"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !selectedPerson}
          className="w-full bg-[#4361ee] text-white py-3 rounded-lg font-medium hover:bg-[#3a56d4] transition-colors disabled:opacity-50"
        >
          {submitting ? "등록 중..." : "클립 등록"}
        </button>
      </form>
    </div>
  );
}
