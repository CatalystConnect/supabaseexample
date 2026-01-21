import React, { useEffect } from "react";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import CountryField from "./CountryField";
import { Button } from "../ui/button";
import { errorMessage, successMessage } from "../ToasterMessage";
import { useCountryDataById, useUpdateCountryData } from "@/hooks/dataHook";

const EditCountry = ({ editId, setEditId, setAddFormOpen }) => {
  const form = useForm({
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
        cuntry_code: country.cuntry_code ?? "",
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
    } catch (err) {
      errorMessage({ description: err?.message || "Failed to update country" });
    } finally {
      setAddFormOpen(false);
      setEditId("");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h2 className="font-semibold mb-4">Update Country</h2>

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
