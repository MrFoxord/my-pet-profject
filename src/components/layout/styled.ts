import styled, { css, keyframes } from "styled-components";
import { Avatar as MuiAvatar, Typography as MuiTypography } from "@mui/material";

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
  background:
    radial-gradient(circle at 8% 10%, rgba(11, 99, 206, 0.08), transparent 35%),
    radial-gradient(circle at 92% 5%, rgba(14, 165, 164, 0.06), transparent 28%),
    ${({ $bg }) => $bg || "#f6f8fc"};
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

export const BoardHeader = styled.div<{ $remotePulseToken?: number }>`
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 5px 18px rgba(15, 23, 42, 0.07);
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

export const BoardTitle = styled(MuiTypography)``;

export const BoardDescription = styled(MuiTypography)`
  margin-bottom: 18px;
  color: #5a6780;
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