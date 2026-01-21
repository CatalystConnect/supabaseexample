import React from "react";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import CountryField from "./CountryField";
import { Button } from "../ui/button";
import { errorMessage, successMessage } from "../ToasterMessage";
import { useUploadCountryData } from "@/hooks/dataHook";

const AddCountry = ({ setAddFormOpen }) => {
  const form = useForm({
    defaultValues: {
      name: "",
      cuntry_code: "",
      country_region: "",
    },
  });

  const addCountryMutation = useUploadCountryData();

  const onSubmit = async (values) => {
    try {
      await addCountryMutation.mutateAsync({
        name: values.name,
        cuntry_code: Number(values.cuntry_code),
        country_region: values.country_region,
      });

      successMessage({ description: "Country added successfully" });
      form.reset();
    } catch (err) {
      errorMessage({ description: err?.message || "Failed to add country" });
    } finally {
      setAddFormOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h2 className="font-semibold mb-4">New Country</h2>

        <CountryField form={form} />

        <div className="mt-6">
          <Button
            className="cursor-pointer"
            type="submit"
            disabled={addCountryMutation.isPending}
          >
            {addCountryMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddCountry;
