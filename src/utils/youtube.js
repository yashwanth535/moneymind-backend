const YT_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

const extractYouTubeId = (input) => {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (YT_ID_REGEX.test(trimmed)) return trimmed;

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const url = new URL(withProtocol);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.replace(/^\//, "").split("/")[0];
      return YT_ID_REGEX.test(id) ? id : null;
    }

    if (host.endsWith("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v && YT_ID_REGEX.test(v)) return v;

      const pathMatch = url.pathname.match(
        /\/(embed|shorts|live)\/([a-zA-Z0-9_-]{11})/
      );
      if (pathMatch) return pathMatch[2];
    }
  } catch {
    return null;
  }

  return null;
};

const fetchYouTubeMeta = async (videoId) => {
  const fallback = {
    title: `YouTube Video (${videoId})`,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };

  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (!response.ok) return fallback;
    const data = await response.json();
    return {
      title: data?.title || fallback.title,
      thumbnailUrl: data?.thumbnail_url || fallback.thumbnailUrl,
    };
  } catch {
    return fallback;
  }
};

module.exports = {
  extractYouTubeId,
  fetchYouTubeMeta,
};
