import styled from "styled-components";
import { Typography as MuiTypography } from "@mui/material";
import { UI_COLORS } from "@/lib/ui-tokens";
import { elevatedPanelSurface } from "@/lib/styled-surfaces";



export const ColumnsContainer = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-start;
  width: max-content;
  min-width: 100%;
  overflow-x: visible;
  padding-bottom: 10px;
`;

export const ColumnWrapper = styled.div`
  flex: 0 0 294px;
`;

export const ColumnCard = styled.div`
  border-radius: 14px;
  padding: 12px;
  ${elevatedPanelSurface};
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

export const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
`;

export const ColumnActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const AddTicketButton = styled.button`
  border: 0;
  background: ${UI_COLORS.primary};
  color: ${UI_COLORS.primaryContrast};
  width: 26px;
  height: 26px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 17px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform .16s ease, filter .16s ease;

  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
`;

export const ColumnTitle = styled(MuiTypography)`
  font-weight: 700;
  font-size: 0.95rem;
  color: ${UI_COLORS.textPrimaryStrong};
`;

export const ColumnTicketList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;