import styled from "styled-components";
import { MuiLikeTheme } from "@/types";

export const ModalOuter = styled.div`
  min-height: 100vh;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalCard = styled.div`
  width: min(640px, 90vw);
  max-height: 90vh;
  background: ${({ theme }) =>
    (theme as MuiLikeTheme)?.palette?.background?.paper ?? "#ffffff"};
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(15, 23, 42, 0.35);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
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
  background: ${({ theme }) =>
    (theme as MuiLikeTheme)?.palette?.action?.hover ?? "#f4f4f5"};
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  background: ${({ theme }) =>
    (theme as MuiLikeTheme)?.palette?.action?.hover ?? "#f4f4f5"};
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

export const CommentCard = styled.div`
  padding: 12px;
  border-radius: 8px;
  background: ${({ theme }) =>
    (theme as MuiLikeTheme)?.palette?.action?.hover ?? "#f4f4f5"};
  display: flex;
  flex-direction: column;
  gap: 6px;
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
