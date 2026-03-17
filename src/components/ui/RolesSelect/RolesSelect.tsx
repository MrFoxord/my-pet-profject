"use client";

import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  type SelectChangeEvent,
} from "@mui/material";

export const STANDARD_ROLES = ["owner", "admin", "member", "viewer"] as const;

export interface RolesSelectProps {
  value: string[];
  onChange: (roles: string[]) => void;
  label?: string;
  boardRoleNames?: string[];
  fullWidth?: boolean;
}

export function RolesSelect({
  value,
  onChange,
  label = "Access roles",
  boardRoleNames = [],
  fullWidth = true,
}: RolesSelectProps) {
  const customRoles = boardRoleNames.filter(
    (name) => !STANDARD_ROLES.includes(name.toLowerCase() as (typeof STANDARD_ROLES)[number])
  );

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    onChange(event.target.value as string[]);
  };

  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel id="roles-select-label">{label}</InputLabel>
      <Select
        labelId="roles-select-label"
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (selected as string[]).join(", ")}
      >
        <MenuItem disabled>— Стандартные роли —</MenuItem>
        {STANDARD_ROLES.map((role) => (
          <MenuItem key={role} value={role}>
            <Checkbox checked={value.includes(role)} />
            <ListItemText primary={role} />
          </MenuItem>
        ))}
        {customRoles.length > 0 && (
          <MenuItem disabled>— Роли доски —</MenuItem>
        )}
        {customRoles.map((role) => (
          <MenuItem key={role} value={role}>
            <Checkbox checked={value.includes(role)} />
            <ListItemText primary={role} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
