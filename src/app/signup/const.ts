import { z } from "zod";

const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;

export const SignupFormSchema = z
  .object({
    username: z.string().min(1, { message: "아이디를 입력해주세요" }),
    password: z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    confirmPassword: z.string(),
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    phone: z.string().regex(phoneRegex, {
      message: "전화번호는 000-0000-0000 형식이어야 합니다.",
    }),
    postalCode: z
      .string()
      .min(1, { message: "우편번호를 입력해주세요." })
      .trim(),
    address: z.string().min(1, { message: "주소지를 입력해주세요." }).trim(),
    detailAddress: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
