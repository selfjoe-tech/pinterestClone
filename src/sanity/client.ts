
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url"

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-11-01",
  useCdn: true,
  token: process.env.SANITY_ACCESS_TOKEN
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);