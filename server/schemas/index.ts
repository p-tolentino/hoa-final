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
  firstName: z.string(),
  lastName: z.string(),
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
  relation: z.string({
    required_error: "Please choose your home relation.",
  }),
});

export const PersonalInfoSchema = z.object({
  firstName: z.string(),
  middleName: z.optional(z.string()),
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
  relation: z.string({
    required_error: "Please choose your home relation.",
  }),
});

export const VehicleSchema = z.object({
  plateNum: z
    .string()
    .min(7, {
      message: "Valid plate number required",
    })
    .max(8, {
      message: "Valid plate number required",
    }),
});

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
  latitude: z.string({
    required_error: "Please specify latitude value of address.",
  }),
  longitude: z.string({
    required_error: "Please specify longitude value of address.",
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

export const NewTransactionSchema = z.object({
  dateIssued: z.string().refine((date) => new Date(date) <= new Date(), {
    message: "Date issued cannot be in the future",
  }),
  type: z.enum(["REVENUE", "EXPENSE"], {
    required_error: "Please specify if it is an revenue or expense.",
  }),
  purpose: z.string(),
  amount: z.string(),
  description: z.string(),
});

export const NewPostSchema = z.object({
  type: z.enum(["DISCUSSION", "BUSINESS", "OFFICER"], {
    required_error: "Please specify if it is an revenue or expense.",
  }),
  title: z.string(),
  category: z.enum([ "MEETING",
    "ELECTION",
    "INQUIRY",
    "EVENT",
    "FOODANDDRINK",
    "CLOTHING",
    "HOUSEHOLDITEMS",
    "HOMESERVICES",
    "OTHER"], {
    required_error: "Please specify the category",
  }),
  description: z.string(),
  media:z.string().optional(),
  status:z.string().optional(),
});

export const NewBudgetPlanSchema = z.object({
  title: z.string(),
  forYear: z.number(),
  cybAssocDues: z.number(),
  cybToll: z.number(),
  cybFacility: z.number(),
  cybConstruction: z.number(),
  cybCarSticker: z.number(),
  cybOtherRev: z.number(),

  cybSalariesBenefits: z.number(),
  cybUtilities: z.number(),
  cybOfficeSupplies: z.number(),
  cybRepairMaintenance: z.number(),
  cybDonations: z.number(),
  cybFurnituresFixtures: z.number(),
  cybRepresentation: z.number(),
  cybLegalProfessionalFees: z.number(),
  cybAdministrativeCosts: z.number(),
  cybOtherExp: z.number(),

  cybTotalYearlyRev: z.number(),
  cybTotalYearlyExp: z.number(),
  cybTotalYearlySurplus: z.number(),
});

export const OptionSchema = z.object({
  text: z.string(),
});

export const QuestionSchema = z.object({
  text: z.string(),
  options: z.array(OptionSchema),
});

export const PollSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.enum([ "MEETING",
  "ELECTION",
  "INQUIRY",
  "EVENT",
  "OTHER"], {
    required_error: "Please specify the category",
  }),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"]), // Assuming Status is an enum with values ACTIVE and INACTIVE
  questions: z.array(QuestionSchema),
}).refine((data) => {
  // Ensure endDate is not in the past
  const now = new Date();
  const endDate = data.endDate ? new Date(data.endDate) : null;
  if (endDate && endDate < now) {
    return false;
  }

  // Ensure startDate is not after endDate
  const startDate = data.startDate ? new Date(data.startDate) : null;
  if (startDate && endDate && startDate > endDate) {
    return false;
  }

  return true;
}, {
  // Custom error message
  message: "End date cannot be in the past, and start date must be before end date.",
});

export const newEventSchema = z.object({
  title: z.string(),
  date: z.string(),
  venue: z.string(),
  description: z.string(),
})

export const newHoaSchema = z.object({
  name: z.string(),
  contactNumber: z.string(),
  funds: z.string(),
  fixedDue: z.string(),
  officerTerm: z.string(),
  overdueDelinquent: z.string(),
  violationDelinquent: z.string(),
  cancelPeriod: z.string(),
  cancelFee: z.string(),
})

export const NewFacilitySchema = z.object({
  name: z.string(),
  hourlyRate: z.string(),
  description: z.string(),
  address: z.string(),
  media:z.string().optional(),
});


export const EditFacilitySchema = z.object({
  name: z.string(),
  hourlyRate: z.string(),
  description: z.string(),
  address: z.string(),
  mediaLink:z.string().optional(),
});

export const FacilityReservationSchema = z.object({
  facilityId: z.string(),
  userId: z.string(),
  startTime: z.instanceof(Date, {
    message: "Start time must be a valid Date object",
  }),
  endTime: z.instanceof(Date, {
    message: "End time must be a valid Date object",
  }),
  numHours:z.string(),
  reservationFee: z.string(),
});
