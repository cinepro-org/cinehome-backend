import type { filterOptions } from "../types/filterOptions.js";
import type { Source } from "../types/source.js";
import { getMovieSources, getShowSources } from "./cineproService.js";

async function getMovieSource(
  tmdbId: number,
  filterOptions: filterOptions,
): Promise<Source | null> {
  const sources = await getMovieSources(tmdbId);
  if (!sources) {
    return null;
  }

  const filteredSources = await filterSources(sources, filterOptions);
  return filteredSources[0] || null;
}

async function getEpisodeSource(
  tmdbId: number,
  season: number,
  episode: number,
  filterOptions: filterOptions,
): Promise<Source | null> {
  const sources = await getShowSources(tmdbId, season, episode);
  if (!sources) {
    return null;
  }

  const filteredSources = await filterSources(sources, filterOptions);
  return filteredSources[0] || null;
}

async function filterSources(
  sources: Source[],
  options: filterOptions,
): Promise<Source[]> {
  const { type, minQualityP, audioLanguage } = options;
  return sources.filter((src) => {
    const qualityP = parseInt(src.quality.replace("p", ""));
    const hasAudio = src.audioTracks.some(
      (track) => track.language === audioLanguage,
    );
    return src.type === type && qualityP >= minQualityP && hasAudio;
  });
}
