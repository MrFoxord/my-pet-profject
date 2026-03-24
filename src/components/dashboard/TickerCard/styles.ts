import styled, { css, keyframes } from "styled-components";

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
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #dfe6f2;
    padding: 12px 13px;
    margin-bottom: 8px;
    box-shadow: 0 5px 14px rgba(15, 23, 42, 0.08);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
    &:hover {
      transform: translateY(-1px);
      border-color: #b7c9e4;
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.1);
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
  color: #74839a;
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
  color: #1a2a43;
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
  color: #5f6f86;
`;

export const Progress = styled.div`
  height: 4px;
  background: #e2e8f2;
  border-radius: 4px;
  width: 100%;
`;

export const ProgressBar = styled.div`
  height: 100%;
  background: #10b981;
  border-radius: 4px;
  transition: width .3s ease;
`;

export const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
`;