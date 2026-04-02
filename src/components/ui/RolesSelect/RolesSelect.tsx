"use client";

import { useTranslations } from "next-intl";
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
  label,
  boardRoleNames = [],
  fullWidth = true,
}: RolesSelectProps) {
  const t = useTranslations("rolesSelect");
  const resolvedLabel = label ?? t("accessRoles");
  const customRoles = boardRoleNames.filter(
    (name) => !STANDARD_ROLES.includes(name.toLowerCase() as (typeof STANDARD_ROLES)[number])
  );

  const getRoleLabel = (role: string) => {
    switch (role.toLowerCase()) {
      case "owner":
        return t("owner");
      case "admin":
        return t("admin");
      case "member":
        return t("member");
      case "viewer":
        return t("viewer");
      default:
        return role;
    }
  };

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    onChange(event.target.value as string[]);
  };

  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel id="roles-select-label">{resolvedLabel}</InputLabel>
      <Select
        labelId="roles-select-label"
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={resolvedLabel} />}
        renderValue={(selected) => (selected as string[]).map(getRoleLabel).join(", ")}
      >
        <MenuItem disabled>{t("standardRolesSection")}</MenuItem>
        {STANDARD_ROLES.map((role) => (
          <MenuItem key={role} value={role}>
            <Checkbox checked={value.includes(role)} />
            <ListItemText primary={getRoleLabel(role)} />
          </MenuItem>
        ))}
        {customRoles.length > 0 && (
          <MenuItem disabled>{t("boardRolesSection")}</MenuItem>
        )}
        {customRoles.map((role) => (
          <MenuItem key={role} value={role}>
            <Checkbox checked={value.includes(role)} />
            <ListItemText primary={getRoleLabel(role)} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
