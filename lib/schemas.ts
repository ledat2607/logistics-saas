import z, { email } from "zod";

const ROLE = {
  MANAGER: "manager",
  DRIVER: "driver",
  DISPATCHER: "dispatcher",
} as const;

const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

const signUpSchema = z
  .object({
    name: z.string().min(2, { message: "Tên phải dài hơn 2 ký tự" }),
    companyName: z
      .string()
      .min(2, { message: "Tên công ty không được để trống" }),
    email: z.string().email({ message: "Email không hợp lệ" }),
    role: z.nativeEnum(ROLE),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải từ 8 ký tự trở lên" }),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với điều khoản dịch vụ",
    }),

    licenseNumber: z.string().optional(),
    fleetSize: z.string().optional(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu xác nhận không trùng khớp",
        path: ["confirmPassword"],
      });
    }
  });

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
});

export { loginSchema, signUpSchema, ROLE, forgotPasswordSchema };
