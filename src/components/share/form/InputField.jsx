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
            <FormLabel className='!text-[#101828]'>{label}</FormLabel>
            <FormControl>
              <Input
                value={field.value}
                id={field.name}
                {...field}
                placeholder={placeholder}
                disabled={disabled}
                type={type}
                className={`form-control-height${className} ${
                  fieldState.error ? "!border-red-500" : ""
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
