"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import styled from "styled-components";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import DesignServicesRoundedIcon from "@mui/icons-material/DesignServicesRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

type IconOption = {
  value: string;
  labelKey: string;
  Icon: typeof DashboardRoundedIcon;
};

type ThemeOption = {
  value: string;
  labelKey: string;
};

const iconOptions: IconOption[] = [
  { value: "dashboard", labelKey: "iconDashboard", Icon: DashboardRoundedIcon },
  { value: "campaign", labelKey: "iconMarketing", Icon: CampaignRoundedIcon },
  { value: "code", labelKey: "iconDevelopment", Icon: CodeRoundedIcon },
  { value: "design", labelKey: "iconDesign", Icon: DesignServicesRoundedIcon },
];

const themeOptions: ThemeOption[] = [
  { value: "#f3f4f6", labelKey: "themeSlate" },
  { value: "#e0f7fa", labelKey: "themeAqua" },
  { value: "#fff3e0", labelKey: "themeAmber" },
  { value: "#fce4ec", labelKey: "themeRose" },
];

function getThemeOption(value: string): ThemeOption {
  return themeOptions.find((option) => option.value === value) ?? themeOptions[0];
}

const Content = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 480px;

  @media (max-width: 640px) {
    min-width: 0;
    width: 100%;
  }
`;

const PreviewCard = styled(Box)<{ $bg: string }>`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  background: ${(props) => props.$bg};
`;

const ColumnsSection = styled(Box)`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ColumnRow = styled(Box)`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
`;

const PreviewColumns = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

export type CreateBoardPayload = {
  title: string;
  description: string;
  themeColor: string;
  icon: string;
  columns: string[];
  customRoles: string[];
};

interface CreateBoardModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateBoardPayload) => Promise<void>;
  creating: boolean;
}

export default function CreateBoardModal({
  open,
  onClose,
  onCreate,
  creating,
}: CreateBoardModalProps) {
  const t = useTranslations("createBoardModal");
  const defaultColumns = useMemo(
    () => [t("defaultColumnBacklog"), t("defaultColumnInProgress"), t("defaultColumnDone")],
    [t]
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [themeColor, setThemeColor] = useState(themeOptions[0].value);
  const [icon, setIcon] = useState(iconOptions[0].value);
  const [columns, setColumns] = useState<string[]>(() => [...defaultColumns]);
  const [customRoles, setCustomRoles] = useState([""]);

  const selectedIcon = useMemo(
    () => iconOptions.find((option) => option.value === icon) ?? iconOptions[0],
    [icon]
  );

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setThemeColor(themeOptions[0].value);
    setIcon(iconOptions[0].value);
    setColumns([...defaultColumns]);
    setCustomRoles([""]);
  };

  const normalizedColumns = useMemo(
    () => columns.map((column) => column.trim()).filter(Boolean),
    [columns]
  );

  const normalizedCustomRoles = useMemo(
    () => customRoles.map((role) => role.trim()).filter(Boolean),
    [customRoles]
  );

  const updateColumn = (index: number, value: string) => {
    setColumns((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const addColumn = () => {
    setColumns((prev) => [...prev, ""]);
  };

  const removeColumn = (index: number) => {
    setColumns((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCustomRole = (index: number, value: string) => {
    setCustomRoles((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const addCustomRole = () => {
    setCustomRoles((prev) => [...prev, ""]);
  };

  const removeCustomRole = (index: number) => {
    setCustomRoles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    if (creating) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!title.trim() || normalizedColumns.length === 0) return;

    await onCreate({
      title: title.trim(),
      description: description.trim(),
      themeColor,
      icon,
      columns: normalizedColumns,
      customRoles: normalizedCustomRoles,
    });

    resetForm();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogContent>
        <Content>
          <TextField
            label={t("nameLabel")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label={t("descriptionLabel")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={3}
            fullWidth
          />

          <TextField
            label={t("themeColorLabel")}
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            select
            fullWidth
            SelectProps={{
              renderValue: (selected) => {
                const option = getThemeOption(String(selected));
                return (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        backgroundColor: option.value,
                        border: "1px solid #d1d5db",
                      }}
                    />
                    {t(option.labelKey)}
                  </Box>
                );
              },
            }}
          >
            {themeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      backgroundColor: option.value,
                      border: "1px solid #d1d5db",
                    }}
                  />
                  {t(option.labelKey)}
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <ColumnsSection>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Typography variant="subtitle2">{t("columnsSectionTitle")}</Typography>
              <Button onClick={addColumn} startIcon={<AddRoundedIcon />} variant="outlined" size="small">
                {t("addColumn")}
              </Button>
            </Box>

            {columns.map((column, index) => (
              <ColumnRow key={index}>
                <TextField
                  size="small"
                  label={t("columnLabel", { index: index + 1 })}
                  value={column}
                  onChange={(e) => updateColumn(index, e.target.value)}
                  fullWidth
                />
                <IconButton
                  aria-label={t("removeColumn")}
                  onClick={() => removeColumn(index)}
                  disabled={columns.length <= 1}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </ColumnRow>
            ))}

            <Typography variant="caption" color="text.secondary">
              {t("columnsHint")}
            </Typography>
          </ColumnsSection>

          <ColumnsSection>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Typography variant="subtitle2">{t("rolesSectionTitle")}</Typography>
              <Button onClick={addCustomRole} startIcon={<AddRoundedIcon />} variant="outlined" size="small">
                {t("addRole")}
              </Button>
            </Box>

            {customRoles.map((role, index) => (
              <ColumnRow key={`role-${index}`}>
                <TextField
                  size="small"
                  label={t("roleLabel", { index: index + 1 })}
                  value={role}
                  onChange={(e) => updateCustomRole(index, e.target.value)}
                  fullWidth
                />
                <IconButton
                  aria-label={t("removeRole")}
                  onClick={() => removeCustomRole(index)}
                  disabled={customRoles.length <= 1}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </ColumnRow>
            ))}

            <Typography variant="caption" color="text.secondary">
              {t("rolesHint")}
            </Typography>
          </ColumnsSection>

          <TextField
            label={t("iconLabel")}
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            select
            fullWidth
          >
            {iconOptions.map((option) => {
              const IconComponent = option.Icon;
              return (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconComponent fontSize="small" />
                    {t(option.labelKey)}
                  </Box>
                </MenuItem>
              );
            })}
          </TextField>

          <PreviewCard $bg={themeColor}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <selectedIcon.Icon fontSize="small" />
              <Typography variant="subtitle2">{title || t("previewTitle")}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description || t("previewDescription")}
            </Typography>
            <PreviewColumns>
              {normalizedColumns.map((column, index) => (
                <Chip
                  key={`${column}-${index}`}
                  label={column}
                  size="small"
                  variant="outlined"
                />
              ))}
            </PreviewColumns>
          </PreviewCard>
        </Content>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={creating} variant="text">
          {t("cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={creating || !title.trim() || normalizedColumns.length === 0}
          variant="contained"
        >
          {creating ? t("creating") : t("create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
