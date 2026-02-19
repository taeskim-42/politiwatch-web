"use client";

function parseYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch {
    // invalid URL
  }
  return null;
}

function timestampToSeconds(ts: string): number {
  const parts = ts.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] ?? 0;
}

interface Props {
  url: string;
  timestamp?: string;
}

export default function VideoEmbed({ url, timestamp }: Props) {
  const videoId = parseYoutubeId(url);
  if (!videoId) {
    return (
      <div className="flex items-center justify-center aspect-video bg-gray-100 rounded-lg text-gray-400 text-sm">
        유효하지 않은 영상 URL
      </div>
    );
  }

  const start = timestamp ? timestampToSeconds(timestamp) : 0;
  const src = `https://www.youtube.com/embed/${videoId}${start ? `?start=${start}` : ""}`;

  return (
    <div className="aspect-video w-full">
      <iframe
        className="w-full h-full rounded-lg"
        src={src}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
