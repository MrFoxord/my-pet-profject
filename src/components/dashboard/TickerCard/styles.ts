import styled, { css, keyframes } from "styled-components";
import { UI_COLORS } from "@/lib/ui-tokens";
import { interactiveCardSurface } from "@/lib/styled-surfaces";

const movedCardSmoothing = keyframes`
  0% {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  45% {
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.12);
    transform: translateY(-1px) scale(1.005);
    opacity: 0.72;
  }
  100% {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const movedCardFadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-2px) scale(0.99);
  }
`;

const movedCardFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(2px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const Card = styled.div<{ $moveTransitionPhase?: "out" | "in" }>`
    width: 100%;
    border-radius: 12px;
    padding: 12px 13px;
    margin-bottom: 8px;
    ${interactiveCardSurface};
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
    &:hover {
      transform: translateY(-1px);
    }
    ${({ $moveTransitionPhase }) =>
      $moveTransitionPhase === "out"
        ? css`
            animation: ${movedCardFadeOut} 140ms ease-in forwards;
          `
        : $moveTransitionPhase === "in"
        ? css`
            animation: ${movedCardFadeIn} 220ms ease-out forwards, ${movedCardSmoothing} 420ms ease-out;
          `
        : ""}
`

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TicketId = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${UI_COLORS.textMuted};
`;

export const TypeBadge = styled.div<{ $type: string }>`
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
  text-transform: capitalize;
  background: ${({ $type }) =>
    $type === "bug" ? "#fde3e3" :
    $type === "feature" ? "#deebff" :
    "#edf1f8"};
  color: ${({ $type }) =>
    $type === "bug" ? "#b91c1c" :
    $type === "feature" ? "#1d4ed8" :
    "#374151"};
`;

export const Title = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${UI_COLORS.textPrimaryStrong};
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const TaskSummary = styled.div`
  font-size: 13px;
  color: ${UI_COLORS.textSecondary};
`;

export const Progress = styled.div`
  height: 4px;
  background: ${UI_COLORS.progressTrack};
  border-radius: 4px;
  width: 100%;
`;

export const ProgressBar = styled.div`
  height: 100%;
  background: ${UI_COLORS.progressSuccess};
  border-radius: 4px;
  transition: width .3s ease;
`;

export const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
`;