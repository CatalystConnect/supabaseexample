import React from "react";
import { z } from "zod";
import InputField from "../share/form/InputField";

export const countrySchema = z.object({
  name: z.string().trim().min(1, "Country name is required"),
  cuntry_code: z
    .string()
    .trim()
    .min(1, "Country code is required")
    .refine((v) => Number.isFinite(Number(v)), "Country code must be a number"),
  country_region: z.string().trim().min(1, "Region is required"),
});

const CountryField = ({ form }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <InputField
        form={form}
        name="name"
        label="Country name"
        placeholder="Country name"
        className="h-12"
      />

      <InputField
        form={form}
        name="cuntry_code"
        label="Country code"
        placeholder="Country code"
        className="h-12"
        type="number"
      />

      <InputField
        form={form}
        name="country_region"
        label="Region"
        placeholder="Region"
        className="h-12"
      />
    </div>
  );
};

export default CountryField;
