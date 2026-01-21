import React from "react";
import InputField from "../share/form/InputField";

const CountryField = ({ form }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <InputField
        form={form}
        name="name"
        placeholder="Country name"
        className="border border-[#E2E2E2] rounded-lg h-12 px-4"
      />

      <InputField
        form={form}
        name="cuntry_code"
        placeholder="Country code"
        className="border border-[#E2E2E2] rounded-lg h-12 px-4"
        type="number"
      />

      <InputField
        form={form}
        name="country_region"
        placeholder="Region"
        className="border border-[#E2E2E2] rounded-lg h-12 px-4"
      />
    </div>
  );
};

export default CountryField;
