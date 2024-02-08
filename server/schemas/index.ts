import * as z from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Valid email is required",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Valid email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),

  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Valid email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
  confirmPassword: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const PersonalInfoSchema = z.object({
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  bio: z.optional(z.string()),
  birthDay: z.string(),
  phoneNumber: z
    .string()
    .min(11, {
      message: "Contact number required",
    })
    .max(11, {
      message: "Invalid phone number",
    })
    .regex(phoneRegex, "Invalid phone number."),
  type: z.enum(["Homeowner", "Tenant"], {
    required_error: "Please specify if you are a homeowner or a tenant.",
  }),
  address: z.string({
    required_error: "Please choose your home address.",
  }),
});

export const VehicleSchema = z.object({ plateNum: z.string() });

export const PropertySchema = z.object({
  address: z.string().min(1, {
    message: "Complete address required",
  }),
  lotNumber: z.string().min(1, {
    message: "Lot number required",
  }),
  lotSize: z.string().min(1, {
    message: "Lot size in square meters required",
  }),
  purchaseDate: z.string({
    required_error: "Please specify when the property was bought.",
  }),
});

export const SettingsSchema = z
  .object({
    password: z.optional(
      z.string().min(6, {
        message: "Minimum of 6 characters required",
      })
    ),
    newPassword: z.optional(
      z.string().min(6, {
        message: "Minimum of 6 characters required",
      })
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    }
  );

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});
