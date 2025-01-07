import { z } from "zod";
import { ticketCategory } from "~/lib/utils";
export const ticketSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  price: z.string().regex(/^\d+$/, "Price must be a number"),

  category: z.enum(Object.keys(ticketCategory) as [string, ...string[]]),
  thumbnail: z
    .instanceof(File, { message: "Thumbnail image is required" })
    .refine((file) => !file || file.size <= 5000000, "Max file size is 5MB.")
    .refine(
      (file) => !file || ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type),
      "Only .jpg, .png and .gif formats are supported."
    ),
  ticket: z
    .instanceof(File, { message: "Ticket image is required" })
    // .nullable()
    .refine((file) => !file || file.size <= 5000000, "Max file size is 5MB.")
    .refine(
      (file) => !file || ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type),
      "Only .jpg, .png and .gif formats are supported."
    ),
  thumbnailImagePublicId: z.string().min(1, "Image is required"),
  ticketImagePublicId: z.string().min(1, "Image is required"),
  description: z.string().superRefine((value, ctx) => {
    const MAX_IMAGES = 3;
    const MAX_TOTAL_SIZE = 5_000_000; // 5MB in bytes

    const imgCount = (value.match(/<img/g) || []).length;
    const textContent = value.replace(/<[^>]*>/g, "");
    const textCount = textContent.trim().length;
    const totalSize = new Blob([value]).size;

    if (textCount < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description must contain at least 3 characters",
      });
    } else if (textCount > 1000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description must be at most 1000 characters",
      });
    } else if (imgCount > MAX_IMAGES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description must contain at most 3 images",
      });
    } else if (totalSize > MAX_TOTAL_SIZE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description must be at most 5MB",
      });
    }
  }),
});

export const ProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  address: z.string().min(3, "Address must be at least 3 characters"),
  postalCode: z
    .string()
    .min(3, "Postal code must be at least 3 numbers")
    .regex(/^\d+$/, "Postal code must contain only numeric values"),
  city: z.string().min(1, "City must be defined"),
  state: z.string().min(1, "State must be defined"),
  country: z.string().min(1, "Country must be defined"),
});
