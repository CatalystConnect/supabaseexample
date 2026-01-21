import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

const HideValueInput = ({
  name,
  form,
  placeholder,
  label,
  disable,
  type,
  className,
  onClick,
  value,
  defaultValue,
  max,
  readOnly,
  inputType,
  searchError = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Determine the actual input type dynamically
  const getInputType = () => {
    if (inputType === "password") {
      return showPassword ? "text" : "password";
    }
    return inputType;
  };

  return (
    <FormField
      control={form?.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="relative">
          {label && <FormLabel className="!text-[#101828]">{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                onClick={onClick}
                disabled={disable}
                value={value ?? field.value ?? ""}
                readOnly={readOnly}
                defaultValue={defaultValue}
                className={`form-control-height${className} ${
                  fieldState.error ? "!border-red-500" : ""
                }`}
                placeholder={placeholder}
                type={getInputType()}
                min={0}
                max={max}
                step="any"
              />

              {/* 👁️ Eye Icon for show/hide password */}
              {inputType === "password" && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
          </FormControl>
          <FormMessage className={searchError} />
        </FormItem>
      )}
    />
  );
};

export default HideValueInput;
