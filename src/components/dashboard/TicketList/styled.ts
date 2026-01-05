import styled from "styled-components";
type MuiLikeTheme = {
  palette?: {
    divider?: string;
    text?: { secondary?: string };
  };
};
export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const EmptyState = styled.div`
  padding: 16px;
  border-radius: 12px;
  border: 1px dashed
    ${({ theme }) => (theme as MuiLikeTheme)?.palette?.divider ?? "#e4e4e7"};
  color: ${({ theme }) =>
    (theme as MuiLikeTheme)?.palette?.text?.secondary ?? "#71717a"};
  font-size: 0.9rem;
`;