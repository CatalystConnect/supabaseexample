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
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                onClick={onClick}
                disabled={disable}
                value={value ?? field.value ?? ""}
                readOnly={readOnly}
                defaultValue={defaultValue}
                className={`${className ?? ""} ${
                  inputType === "password" ? "pr-10" : ""
                } ${fieldState.error ? "!border-destructive" : ""}`}
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
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
