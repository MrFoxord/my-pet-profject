import styled from "styled-components";
import { Avatar as MuiAvatar, Typography as MuiTypography } from "@mui/material";

export const Root = styled.div<{ $bg?: string }>`
  display: flex;
  min-height: 100vh;
  background-color: ${({ $bg }) => $bg || "inherit"};
`;

export const Main = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const Content = styled.div`
  padding: 24px;
`;

export const BoardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

export const BoardAvatar = styled(MuiAvatar)`
  margin-right: 8px;
`;

export const BoardTitle = styled(MuiTypography)``;

export const BoardDescription = styled(MuiTypography)`
  margin-bottom: 24px;
`;

export const TicketsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const EmptyBoardText = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
`;