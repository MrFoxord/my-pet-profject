"use client";

import type { AiChatMessage, AiChatResponse } from "@/lib/ai/types";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { type KeyboardEvent } from "react";
import type { AiAssistantCopy } from "./copy";

type AiAssistantPanelProps = {
  open: boolean;
  copy: AiAssistantCopy;
  messages: AiChatMessage[];
  value: string;
  isLoading: boolean;
  error: string | null;
  lastMeta: AiChatResponse["meta"] | null;
  onClose: () => void;
  onClear: () => void;
  onValueChange: (value: string) => void;
  onSend: () => void;
  onSuggestionClick: (value: string) => void;
};

function AiMessageBubble({ message }: { message: AiChatMessage }) {
  const isAssistant = message.role === "assistant";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isAssistant ? "flex-start" : "flex-end",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: "86%",
          px: 1.5,
          py: 1.25,
          borderRadius: 3,
          background: isAssistant
            ? "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(246,248,252,0.94) 100%)"
            : "linear-gradient(135deg, #0b63ce 0%, #0ea5a4 100%)",
          color: isAssistant ? "text.primary" : "#fff",
          border: isAssistant ? "1px solid rgba(15, 23, 42, 0.08)" : "none",
          boxShadow: isAssistant
            ? "0 6px 16px rgba(15, 23, 42, 0.06)"
            : "0 12px 28px rgba(11, 99, 206, 0.22)",
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.55 }}>
          {message.content}
        </Typography>
      </Paper>
    </Box>
  );
}

export function AiAssistantPanel({
  open,
  copy,
  messages,
  value,
  isLoading,
  error,
  lastMeta,
  onClose,
  onClear,
  onValueChange,
  onSend,
  onSuggestionClick,
}: AiAssistantPanelProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: isMobile ? "78vh" : 560,
        width: "100%",
        background:
          "linear-gradient(180deg, rgba(249,251,255,0.98) 0%, rgba(241,246,252,0.98) 100%)",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          background: "linear-gradient(90deg, #14325f 0%, #0f4b82 52%, #0e6f8f 100%)",
          color: "#fff",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
          <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.14)",
                border: "1px solid rgba(255, 255, 255, 0.22)",
              }}
            >
              <SmartToyRoundedIcon />
            </Box>
            <Box minWidth={0}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                {copy.title}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.82)" }}>
                {copy.subtitle}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center">
            {lastMeta?.isMock ? (
              <Chip
                label={copy.mockBadge}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.16)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              />
            ) : null}
            <IconButton onClick={onClose} aria-label={copy.close} sx={{ color: "#fff" }}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflowY: "auto", px: 1.5, py: 1.5 }}>
        {messages.length === 0 ? (
          <Stack spacing={2}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                background: "rgba(255,255,255,0.84)",
                border: "1px solid rgba(15, 23, 42, 0.08)",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75 }}>
                {copy.introTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                {copy.introBody}
              </Typography>
            </Paper>

            <Stack spacing={1}>
              {copy.suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outlined"
                  color="inherit"
                  onClick={() => onSuggestionClick(suggestion)}
                  sx={{
                    justifyContent: "flex-start",
                    borderRadius: 3,
                    borderColor: "rgba(15, 23, 42, 0.1)",
                    backgroundColor: "rgba(255,255,255,0.72)",
                    color: "text.primary",
                    px: 1.5,
                    py: 1,
                    textAlign: "left",
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={1.25}>
            {messages.map((message, index) => (
              <AiMessageBubble key={`${message.role}-${index}-${message.content.slice(0, 24)}`} message={message} />
            ))}

            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Paper
                  elevation={0}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 1.25,
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.88)",
                    border: "1px solid rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <CircularProgress size={16} />
                  <Typography variant="body2">{copy.loading}</Typography>
                </Paper>
              </Box>
            ) : null}
          </Stack>
        )}
      </Box>

      <Divider />

      <Box sx={{ p: 1.5, backgroundColor: "rgba(255,255,255,0.78)" }}>
        {error ? (
          <Alert severity="error" sx={{ mb: 1.25, borderRadius: 2 }}>
            {error}
          </Alert>
        ) : null}

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {copy.subtitle}
          </Typography>
          {messages.length > 0 ? (
            <Button
              onClick={onClear}
              size="small"
              startIcon={<DeleteSweepRoundedIcon />}
              sx={{ minWidth: 0, px: 1 }}
            >
              {copy.clear}
            </Button>
          ) : null}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="flex-end">
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={5}
            value={value}
            placeholder={copy.placeholder}
            onChange={(event) => onValueChange(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={onSend}
            disabled={isLoading || !value.trim()}
            aria-label={copy.send}
            sx={{ minWidth: 52, height: 52, px: 1.5, borderRadius: 3 }}
          >
            <SendRoundedIcon />
          </Button>
        </Stack>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        sx={{ zIndex: (currentTheme) => currentTheme.zIndex.modal + 2 }}
        anchor="bottom"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            overflow: "hidden",
            height: "78vh",
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return open ? (
    <Paper
      elevation={0}
      sx={{
        position: "fixed",
        right: 20,
        bottom: 92,
        width: 390,
        maxWidth: "calc(100vw - 40px)",
        zIndex: (currentTheme) => currentTheme.zIndex.modal + 2,
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid rgba(15, 23, 42, 0.08)",
        boxShadow: "0 24px 56px rgba(15, 23, 42, 0.2)",
      }}
    >
      {content}
    </Paper>
  ) : null;
}
