import { forwardRef } from "react";

export const FormField = forwardRef<
  HTMLInputElement,
  {
    label: string;
    name: string;
    error?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(function FormField({ label, name, error, ...inputProps }, ref) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        className={`block w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        }`}
        {...inputProps}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});
