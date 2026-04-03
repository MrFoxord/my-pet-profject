import styled, { css, keyframes } from "styled-components";
import { modalSurface, mutedBlockSurface } from "@/lib/styled-surfaces";

const modalRemotePulse = keyframes`
  0% {
    box-shadow: 0 10px 40px rgba(15, 23, 42, 0.35);
  }
  45% {
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.28), 0 20px 48px rgba(2, 132, 199, 0.22);
  }
  100% {
    box-shadow: 0 10px 40px rgba(15, 23, 42, 0.35);
  }
`;

const commentAppearFromTop = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px) scale(0.985);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const sectionRemotePulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(14, 165, 233, 0);
    background: transparent;
  }
  40% {
    box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.16);
    background: rgba(14, 165, 233, 0.07);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(14, 165, 233, 0);
    background: transparent;
  }
`;

export const ModalOuter = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalCard = styled.div<{ $isRemotePulse?: boolean }>`
  width: min(640px, 90vw);
  max-height: 90vh;
  border-radius: 16px;
  ${modalSurface};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  ${({ $isRemotePulse }) =>
    $isRemotePulse
      ? css`
          animation: ${modalRemotePulse} 680ms ease-out;
        `
      : ""}
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
`;

export const HeaderMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
  align-items: center;
`;

/** Строка с ролями доступа — всегда видна в шапке тикета */
export const AccessRolesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  margin-top: 8px;
  padding: 4px 8px;
  border-radius: 8px;
  ${mutedBlockSurface};
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
`;

export const Section = styled.div<{ $isRemotePulse?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 10px;
  ${({ $isRemotePulse }) =>
    $isRemotePulse
      ? css`
          animation: ${sectionRemotePulse} 680ms ease-out;
        `
      : ""}
`;

export const SubtasksHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SubtasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
`;

export const SubtaskRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 8px;
  ${mutedBlockSurface};
`;

export const CommentsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CommentInputRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CommentCard = styled.div<{ $isNew?: boolean }>`
  padding: 12px;
  border-radius: 8px;
  ${mutedBlockSurface};
  display: flex;
  flex-direction: column;
  gap: 6px;
  transform-origin: top center;
  ${({ $isNew }) =>
    $isNew
      ? css`
          animation: ${commentAppearFromTop} 420ms ease-out;
        `
      : ""}
`;

export const CommentHeader = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const RelatedRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

export const EstimatesRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;
