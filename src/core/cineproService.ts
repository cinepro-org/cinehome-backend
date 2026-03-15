import { tryCatch } from "../utils/try-catch.js";
import type { ApiResponse } from "../types/apiResponse.js";
const CINEPRO_URL = process.env.cinproUrl;

if (!CINEPRO_URL) {
  throw new Error("CINEPRO_URL is not defined in environment variables");
}

export async function getMovieSources(tmdbId: number) {
  const endpoint = `${CINEPRO_URL}/v1/movie/${tmdbId}`;
  const result = await tryCatch(fetch(endpoint));

  if (result.error) {
    console.error(
      `Failed to fetch movie sources for movie ${tmdbId}:`,
      result.error,
    );
    return null;
  }

  const json = await tryCatch<ApiResponse>(result.data.json());
  if (json.error) {
    console.error(`Failed to parse response for movie ${tmdbId}:`, json.error);
    return null;
  }
  if (!json.data.sources || json.data.sources.length === 0) {
    console.warn(`No sources found for movie ${tmdbId}`);
    return [];
  }
  return json.data.sources;
}

export async function getShowSources(
  tmdbId: number,
  season: number,
  episode: number,
) {
  const endpoint = `${CINEPRO_URL}/v1/tv/${tmdbId}/seasons/${season}/episodes/${episode}`;
  const result = await tryCatch(fetch(endpoint));

  if (result.error) {
    console.error(
      `Failed to fetch show sources for show ${tmdbId} S${season} E${episode}:`,
      result.error,
    );
    return null;
  }
  const json = await tryCatch<ApiResponse>(result.data.json());
  if (json.error) {
    console.error(
      `Failed to parse response for show ${tmdbId} S${season} E${episode}:`,
      json.error,
    );
    return null;
  }
  if (!json.data.sources || json.data.sources.length === 0) {
    console.warn(`No sources found for show ${tmdbId} S${season} E${episode}`);
    return [];
  }
  return json.data.sources;
}
