import React from "react";
import { TextField } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { FieldError } from "react-hook-form";

interface MemoizedTextFieldProps {
    name: string;
    label: string;
}

export const MemoizedTextField: React.FC<MemoizedTextFieldProps> = React.memo(
    ({ name, label }) => {
        const {
            control,
            formState: { errors },
        } = useFormContext();

        const getErrorMessage = (error: FieldError | undefined): string =>
            typeof error?.message === "string" ? error.message : "";

        return (
            <Controller
                name={name}
                control={control}
                rules={{
                    required: "This field is required",
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label={label}
                        error={!!errors[name]}
                        helperText={getErrorMessage(errors[name] as FieldError)}
                        margin='normal'
                        fullWidth
                    />
                )}
            />
        );
    }
);
