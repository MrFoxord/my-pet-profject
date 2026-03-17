import styled from "styled-components";
import { Typography as MuiTypography } from "@mui/material";
import { MuiLikeTheme } from "@/types";



export const ColumnsContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  width: max-content;
  min-width: 100%;
  overflow-x: visible;
  padding-bottom: 8px;
`;

export const ColumnWrapper = styled.div`
  flex: 0 0 280px;
`;

export const ColumnCard = styled.div`
  background: ${({ theme }) =>
    (theme as MuiLikeTheme)?.palette?.background?.paper ?? "#ffffff"};
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

export const ColumnActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AddTicketButton = styled.button`
  border: 0;
  background: #0f172a;
  color: #fff;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const ColumnTitle = styled(MuiTypography)`
  font-weight: 600;
  font-size: 0.95rem;
`;

export const ColumnTicketList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;