import styled, { css, keyframes } from "styled-components";
import { Avatar as MuiAvatar, Typography as MuiTypography } from "@mui/material";
import { UI_COLORS } from "@/lib/ui-tokens";
import { ambientDashboardBackground, glassPanelSurface } from "@/lib/styled-surfaces";

const boardHeaderPulse = keyframes`
  0% {
    transform: translateY(0);
    filter: drop-shadow(0 0 0 rgba(14, 165, 233, 0));
  }
  35% {
    transform: translateY(-1px);
    filter: drop-shadow(0 0 12px rgba(14, 165, 233, 0.45));
  }
  100% {
    transform: translateY(0);
    filter: drop-shadow(0 0 0 rgba(14, 165, 233, 0));
  }
`;

export const Root = styled.div<{ $bg?: string }>`
  display: flex;
  min-height: 100vh;
  ${ambientDashboardBackground};
  background-color: ${({ $bg }) => $bg || UI_COLORS.pageBackground};

  @media (max-width: 900px) {
    display: block;
  }
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

  @media (max-width: 900px) {
    padding: 16px 12px 20px;
  }
`;

export const BoardHeader = styled.div<{ $remotePulseToken?: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding: 10px 12px;
  border-radius: 12px;
  ${glassPanelSurface};
  ${({ $remotePulseToken }) =>
    ($remotePulseToken ?? 0) > 0
      ? css`
          animation: ${boardHeaderPulse} 520ms ease-out
            ${(($remotePulseToken ?? 0) % 2 === 0) ? "0ms" : "1ms"};
        `
      : ""}
`;

export const BoardAvatar = styled(MuiAvatar)`
  margin-right: 10px;
  width: 34px;
  height: 34px;
`;

export const BoardTitle = styled(MuiTypography)`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const BoardDescription = styled(MuiTypography)`
  margin-bottom: 18px;
  color: ${UI_COLORS.textSecondary};
`;

export const TicketsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 2px 2px 8px;
`;

export const EmptyBoardText = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
`;