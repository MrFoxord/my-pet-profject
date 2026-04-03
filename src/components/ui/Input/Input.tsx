"use client";

import { TextField, type TextFieldProps } from "@mui/material";

type InputProps = Omit<TextFieldProps, "onChange"> & {
  onChange?: TextFieldProps["onChange"] | ((val: string) => void);
};

export const Input = ({ onChange, sx, margin = "normal", size = "small", fullWidth = true, ...props }: InputProps) => {
    const handleChange: TextFieldProps["onChange"] = (event) => {
        if (typeof onChange !== "function") {
            return;
        }

        if (onChange.length <= 1) {
            (onChange as (val: string) => void)(event.target.value);
            return;
        }

        (onChange as NonNullable<TextFieldProps["onChange"]>)(event);
    };

    return (
        <TextField
            {...props}
            onChange={handleChange}
            fullWidth={fullWidth}
            margin={margin}
            size={size}
            sx={{
                "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                },
                ...sx,
            }}
        />
    );
};