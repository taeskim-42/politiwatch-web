import type { Clip } from "@/lib/api";
import VideoEmbed from "./VideoEmbed";

interface Props {
  clip: Clip;
  showPerson?: boolean;
}

export default function ClipCard({ clip, showPerson = true }: Props) {
  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <VideoEmbed url={clip.videoUrl} timestamp={clip.timestamp} />
      <div className="p-4">
        {showPerson && clip.personName && (
          <a
            href={`/person/${clip.personId}`}
            className="text-sm font-semibold text-[#4361ee] hover:underline"
          >
            {clip.personName}
          </a>
        )}
        <p className="mt-1 text-gray-800">{clip.description}</p>
        <time className="block mt-2 text-xs text-gray-400">
          {new Date(clip.clipDate).toLocaleDateString("ko-KR")}
        </time>
      </div>
    </article>
  );
}
