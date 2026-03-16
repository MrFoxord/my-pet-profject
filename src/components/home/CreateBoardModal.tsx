"use client";

import { useMemo, useState } from "react";
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
  label: string;
  Icon: typeof DashboardRoundedIcon;
};

type ThemeOption = {
  value: string;
  label: string;
};

const iconOptions: IconOption[] = [
  { value: "dashboard", label: "Dashboard", Icon: DashboardRoundedIcon },
  { value: "campaign", label: "Marketing", Icon: CampaignRoundedIcon },
  { value: "code", label: "Development", Icon: CodeRoundedIcon },
  { value: "design", label: "Design", Icon: DesignServicesRoundedIcon },
];

const themeOptions: ThemeOption[] = [
  { value: "#f3f4f6", label: "Slate" },
  { value: "#e0f7fa", label: "Aqua" },
  { value: "#fff3e0", label: "Amber" },
  { value: "#fce4ec", label: "Rose" },
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [themeColor, setThemeColor] = useState(themeOptions[0].value);
  const [icon, setIcon] = useState(iconOptions[0].value);
  const [columns, setColumns] = useState(["Backlog", "In Progress", "Done"]);

  const selectedIcon = useMemo(
    () => iconOptions.find((option) => option.value === icon) ?? iconOptions[0],
    [icon]
  );

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setThemeColor(themeOptions[0].value);
    setIcon(iconOptions[0].value);
    setColumns(["Backlog", "In Progress", "Done"]);
  };

  const normalizedColumns = useMemo(
    () => columns.map((column) => column.trim()).filter(Boolean),
    [columns]
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
    });

    resetForm();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Создать доску</DialogTitle>
      <DialogContent>
        <Content>
          <TextField
            label="Название"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={3}
            fullWidth
          />

          <TextField
            label="Цвет темы"
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
                    {option.label}
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
                  {option.label}
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
              <Typography variant="subtitle2">Колонки дашборда</Typography>
              <Button onClick={addColumn} startIcon={<AddRoundedIcon />} variant="outlined" size="small">
                Добавить
              </Button>
            </Box>

            {columns.map((column, index) => (
              <ColumnRow key={index}>
                <TextField
                  size="small"
                  label={`Колонка ${index + 1}`}
                  value={column}
                  onChange={(e) => updateColumn(index, e.target.value)}
                  fullWidth
                />
                <IconButton
                  aria-label="Удалить колонку"
                  onClick={() => removeColumn(index)}
                  disabled={columns.length <= 1}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </ColumnRow>
            ))}

            <Typography variant="caption" color="text.secondary">
              Нужно минимум 1 колонка с названием.
            </Typography>
          </ColumnsSection>

          <TextField
            label="Иконка"
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
                    {option.label}
                  </Box>
                </MenuItem>
              );
            })}
          </TextField>

          <PreviewCard $bg={themeColor}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <selectedIcon.Icon fontSize="small" />
              <Typography variant="subtitle2">{title || "Новая доска"}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description || "Описание появится после заполнения поля."}
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
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={creating || !title.trim() || normalizedColumns.length === 0}
          variant="contained"
        >
          {creating ? "Создаем..." : "Создать"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
