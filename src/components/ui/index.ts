// ── Custom components (with consistent app-level styling) ─────────────────────
export { Button } from "./Button/Button";
export type { ButtonProps } from "./Button/Button";
export { Input } from "./Input/Input";
export { Card } from "./Card/Card";
export { Loader } from "./Loader/Loader";
export { Modal } from "./Modal/Modal";
export { default as ActionDialog } from "./ActionDialog/ActionDialog";

// ── Composite domain-specific components ──────────────────────────────────────
export { RolesSelect } from "./RolesSelect/RolesSelect";
export type { RolesSelectProps } from "./RolesSelect/RolesSelect";
export {
  TicketTypeSelect,
  TicketPrioritySelect,
  TicketStatusSelect,
} from "./TicketSelects";

// ── MUI pass-throughs (centralized — add custom styles here when needed) ──────
export {
  Alert,
  Avatar,
  Box,
  Card as MuiCard,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
