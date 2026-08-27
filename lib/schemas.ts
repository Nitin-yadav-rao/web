import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address."),
  message: z.string().trim().min(5, "Message is a little short.").max(2000, "Message is too long."),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const subscribeSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});
export type SubscribeInput = z.infer<typeof subscribeSchema>;
