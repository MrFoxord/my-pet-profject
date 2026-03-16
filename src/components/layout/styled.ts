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
  min-width: 0;
`;

export const Content = styled.div`
  padding: 24px;
  min-width: 0;
  overflow-x: hidden;
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
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 4px;
`;

export const EmptyBoardText = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
`;