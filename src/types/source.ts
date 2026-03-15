export interface Source {
  url: string;
  type: string;
  quality: string;
  audioTracks: { language: string; label: string }[];
  provider: { id: string; name: string };
}
