import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  phone: z.string().min(8, "Phone number must be at least 8 characters long"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  projectType: z.enum(["home", "office", "interior"]),
  location: z.string().min(2, "Location must be at least 2 characters long"),
  budget: z.string().optional().nullable(),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});
