import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";

const InputField = ({
  form,
  name,
  label,
  placeholder,
  disabled,
  type,
  className,
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field, fieldState }) => (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input
                id={field.name}
                {...field}
                value={field.value ?? ""}
                placeholder={placeholder}
                disabled={disabled}
                type={type}
                className={`${className ?? ""} ${
                  fieldState.error ? "!border-destructive" : ""
                }`}
              />
            </FormControl>
            <FormMessage>
              {fieldState.error ? fieldState.error.message : ""}
            </FormMessage>
          </FormItem>
        )}
      />
    </>
  );
};

export default InputField;
