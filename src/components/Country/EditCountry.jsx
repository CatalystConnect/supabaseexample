import React, { useEffect } from "react";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CountryField, { countrySchema } from "./CountryField";
import { Button } from "../ui/button";
import { errorMessage, successMessage } from "../ToasterMessage";
import { useCountryDataById, useUpdateCountryData } from "@/hooks/dataHook";

const EditCountry = ({ editId, setEditId, setAddFormOpen }) => {
  const form = useForm({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      name: "",
      cuntry_code: "",
      country_region: "",
    },
  });

  const updateCountryMutation = useUpdateCountryData();
  const { data: country, isLoading } = useCountryDataById(editId);

  useEffect(() => {
    if (country) {
      form.reset({
        name: country.name ?? "",
        cuntry_code: String(country.cuntry_code ?? ""),
        country_region: country.country_region ?? "",
      });
    }
  }, [country, form]);

  const onSubmit = async (values) => {
    try {
      await updateCountryMutation.mutateAsync({
        id: editId,
        name: values.name,
        cuntry_code: Number(values.cuntry_code),
        country_region: values.country_region,
      });

      successMessage({ description: "Country updated successfully" });
      setAddFormOpen(false);
      setEditId(null);
    } catch (err) {
      errorMessage({ description: err?.message || "Failed to update country" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>

        {isLoading ? <p>Loading...</p> : <CountryField form={form} />}

        <div className="mt-6 flex gap-3">
          <Button
            className="cursor-pointer"
            type="submit"
            disabled={updateCountryMutation.isPending}
          >
            {updateCountryMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditCountry;
