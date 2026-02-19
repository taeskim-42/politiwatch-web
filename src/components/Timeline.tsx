import type { Clip } from "@/lib/api";
import ClipCard from "./ClipCard";

export default function Timeline({ clips }: { clips: Clip[] }) {
  if (clips.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">
        등록된 클립이 없습니다.
      </p>
    );
  }

  const sorted = [...clips].sort(
    (a, b) => new Date(a.clipDate).getTime() - new Date(b.clipDate).getTime()
  );

  return (
    <div className="relative pl-6 border-l-2 border-gray-200 space-y-8">
      {sorted.map((clip) => (
        <div key={clip.id} className="relative">
          <span className="absolute -left-[25px] top-6 w-3 h-3 bg-[#4361ee] rounded-full border-2 border-white" />
          <ClipCard clip={clip} showPerson={false} />
        </div>
      ))}
    </div>
  );
}
