import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

export function urlForImage(source: { asset?: { _ref?: string; _id?: string } } | null | undefined) {
  if (!source?.asset) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return builder.image(source as any);
}

export function getImageLqip(image: { asset?: { metadata?: { lqip?: string } } } | null | undefined): string | undefined {
  return image?.asset?.metadata?.lqip;
}
