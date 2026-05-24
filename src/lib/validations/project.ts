import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  slug: z.string().min(3, "Slug must be at least 3 characters long"),
  category: z.enum(["home", "office", "interior"]),
  location: z.string().min(2, "Location must be at least 2 characters long"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters long"),
  fullDescription: z.string().min(20, "Full description must be at least 20 characters long"),
  coverImage: z.string().url("Cover image must be a valid URL").optional().nullable(),
  media: z.array(
    z.object({
      url: z.string().url("Media url must be a valid URL"),
      type: z.enum(["image", "video"]),
    })
  ).optional(),
  gallery: z.array(z.string().url("Gallery images must be valid URLs")).optional(),
  year: z.number().optional().nullable(),
  area: z.string().optional().nullable(),
  status: z.enum(["draft", "published", "featured"]),
  styleTags: z.array(z.string()).optional(),
});
