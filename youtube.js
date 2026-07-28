(function () {
  "use strict";

  const config = window.JIXEGO_CONFIG;
  const API_ROOT = "https://www.googleapis.com/youtube/v3";
  const CACHE_KEY = "jixego-youtube-cache-v2";
  const categoryNames = {
    "1": "Film & Animation", "2": "Autos & Vehicles", "10": "Music", "15": "Pets & Animals",
    "17": "Sports", "19": "Travel & Events", "20": "Gaming", "22": "People & Blogs",
    "23": "Comedy", "24": "Entertainment", "25": "News & Politics", "26": "How-to & Style",
    "27": "Education", "28": "Science & Technology", "29": "Nonprofits"
  };

  function apiUrl(path, params) {
    const url = new URL(`${API_ROOT}/${path}`);
    Object.entries({ ...params, key: config.YOUTUBE_API_KEY }).forEach(([key, value]) => {
      if (value !== undefined && value !== "") url.searchParams.set(key, value);
    });
    return url.toString();
  }

  async function request(path, params) {
    const response = await fetch(apiUrl(path, params));
    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message || "YouTube could not be reached right now.";
      throw new Error(message);
    }
    return data;
  }

  function parseDuration(duration = "PT0S") {
    const values = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    return Number(values?.[1] || 0) * 3600 + Number(values?.[2] || 0) * 60 + Number(values?.[3] || 0);
  }

  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}` : `${minutes}:${String(secs).padStart(2, "0")}`;
  }

  function normalizeVideo(item) {
    const seconds = parseDuration(item.contentDetails?.duration);
    return {
      id: item.id,
      title: item.snippet?.title || "Untitled video",
      description: item.snippet?.description || "",
      publishedAt: item.snippet?.publishedAt,
      thumbnail: item.snippet?.thumbnails?.maxres?.url || item.snippet?.thumbnails?.standard?.url || item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url,
      category: categoryNames[item.snippet?.categoryId] || "JixeGo Live",
      durationSeconds: seconds,
      duration: formatDuration(seconds),
      views: Number(item.statistics?.viewCount || 0),
      likes: Number(item.statistics?.likeCount || 0),
      isShort: seconds > 0 && seconds <= 180
    };
  }

  async function fetchChannel() {
    const data = await request("channels", {
      part: "snippet,statistics,contentDetails,brandingSettings",
      forHandle: config.CHANNEL_HANDLE
    });
    if (!data.items?.length) throw new Error("The configured YouTube channel was not found.");
    const channel = data.items[0];
    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      publishedAt: channel.snippet.publishedAt,
      country: channel.snippet.country || "",
      logo: channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.medium?.url || channel.snippet.thumbnails?.default?.url,
      banner: channel.brandingSettings?.image?.bannerExternalUrl || "",
      subscribers: Number(channel.statistics?.subscriberCount || 0),
      videos: Number(channel.statistics?.videoCount || 0),
      views: Number(channel.statistics?.viewCount || 0),
      uploadsPlaylist: channel.contentDetails.relatedPlaylists.uploads
    };
  }

  async function fetchUploads(playlistId) {
    let nextPageToken = "";
    const ids = [];
    do {
      const data = await request("playlistItems", {
        part: "contentDetails",
        playlistId,
        maxResults: 50,
        pageToken: nextPageToken
      });
      ids.push(...data.items.map((item) => item.contentDetails.videoId));
      nextPageToken = data.nextPageToken || "";
    } while (nextPageToken);

    const videos = [];
    for (let index = 0; index < ids.length; index += 50) {
      const data = await request("videos", {
        part: "snippet,contentDetails,statistics",
        id: ids.slice(index, index + 50).join(",")
      });
      videos.push(...data.items.map(normalizeVideo));
    }
    const order = new Map(ids.map((id, index) => [id, index]));
    return videos.sort((a, b) => order.get(a.id) - order.get(b.id));
  }

  function getCache() {
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY));
      const age = Date.now() - cache.savedAt;
      return age < config.CACHE_MINUTES * 60 * 1000 ? cache.data : null;
    } catch (_) {
      return null;
    }
  }

  async function load() {
    if (!config.YOUTUBE_API_KEY.trim()) throw new Error("API_KEY_MISSING");
    const cached = getCache();
    if (cached) return cached;
    const channel = await fetchChannel();
    const uploads = await fetchUploads(channel.uploadsPlaylist);
    const data = {
      channel,
      uploads,
      videos: uploads.filter((video) => !video.isShort),
      shorts: uploads.filter((video) => video.isShort),
      popular: [...uploads].sort((a, b) => b.views - a.views).slice(0, 12)
    };
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data })); } catch (_) {}
    return data;
  }

  window.JixeGoYouTube = { load };
})();
