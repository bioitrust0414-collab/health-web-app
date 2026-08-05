import indexData from "@/data/itrust/index.json";
import type { Article, EpisodeIndex, EpisodeMeta } from "@/types/content";

const modules = import.meta.glob<{ default: Article }>(
  "../data/itrust/episodes/*/article.json",
  { eager: true },
);

const articles: Record<string, Article> = {};
for (const [path, mod] of Object.entries(modules)) {
  const folder = path.split("/").slice(-2)[0];
  if (folder) articles[folder] = mod.default;
}

export const episodeIndex = indexData as EpisodeIndex;

export const releasedEpisodes: EpisodeMeta[] = episodeIndex.episodes
  .filter((ep) => ep.has_content)
  .sort((a, b) => a.episode_number - b.episode_number);

export function getEpisode(slug: string) {
  const meta = episodeIndex.episodes.find(
    (ep) => ep.folder === slug && ep.has_content,
  );
  if (!meta) return null;
  return { meta, article: articles[slug] ?? null };
}

export function assetUrl(folder: string, relative: string) {
  return `/content/itrust/episodes/${folder}/${relative.replace(/^\/+/, "")}`;
}
