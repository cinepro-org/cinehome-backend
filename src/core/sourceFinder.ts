import type { filterOptions } from "../types/filterOptions.js";
import type { Source } from "../types/source.js";
import { getMovieSources, getShowSources } from "./cineproService.js";

export async function getMovieSource(
  tmdbId: number,
  filterOptions: filterOptions | null,
): Promise<Source | null> {
  const sources = await getMovieSources(tmdbId);
  if (!sources) {
    return null;
  }
  if (!filterOptions) {
    return sources[0] || null;
  }

  const filteredSources = filterSources(sources, filterOptions);

  // Sort descending by quality
  const sortedSources = sortSources(filteredSources);
  return sortedSources[0] || null;
}

export async function getEpisodeSource(
  tmdbId: number,
  season: number,
  episode: number,
  filterOptions: filterOptions | null,
): Promise<Source | null> {
  const sources = await getShowSources(tmdbId, season, episode);
  if (!sources) {
    return null;
  }

  if (!filterOptions) {
    return sources[0] || null;
  }
  const filteredSources = await filterSources(sources, filterOptions);
  const sortedSources = sortSources(filteredSources);
  return sortedSources[0] || null;
}

function sortSources(sources: Source[]): Source[] {
  return sources.sort((a, b) => {
    const qualityA = parseInt(a.quality.replace("p", ""));
    const qualityB = parseInt(b.quality.replace("p", ""));
    return qualityB - qualityA;
  });
}

function filterSources(sources: Source[], options: filterOptions): Source[] {
  const { type, minQualityP, audioLanguage } = options;
  return sources.filter((src) => {
    let matches = true;

    if (type != null) {
      matches = matches && src.type === type;
    }
    if (minQualityP != null) {
      const qualityP = parseInt(src.quality.replace("p", ""));
      matches = matches && qualityP >= minQualityP;
    }
    if (audioLanguage != null) {
      const hasAudio = src.audioTracks.some(
        (track) => track.language === audioLanguage,
      );
      matches = matches && hasAudio;
    }
    if (options.providerWhitelist) {
      matches = matches && options.providerWhitelist.includes(src.provider.id);
    }
    if (options.providerBlacklist) {
      matches = matches && !options.providerBlacklist.includes(src.provider.id);
    }

    return matches;
  });
}
