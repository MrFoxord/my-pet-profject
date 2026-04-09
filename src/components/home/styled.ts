import styled from "styled-components";
import { Button as MuiButton } from "@mui/material";
import { UI_COLORS } from "@/lib/ui-tokens";
import { ambientPageBackground, glassPanelSurface, homeCardSurface } from "@/lib/styled-surfaces";

export const PageRoot = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  ${ambientPageBackground};
  padding: 22px 0;

  @media (max-width: 600px) {
    padding: 14px 0;
  }
`;

export const PageMain = styled.main`
  width: 100%;
  max-width: 1040px;
  padding: 30px 24px;

  @media (max-width: 600px) {
    padding: 18px 12px 26px;
  }
`;

export const Header = styled.header`
  margin-bottom: 22px;
  padding: 18px 20px;
  border-radius: 14px;
  ${glassPanelSurface};

  @media (max-width: 600px) {
    padding: 16px 14px;
    border-radius: 12px;
  }
`;

export const HeaderTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: ${UI_COLORS.textPrimary};
  letter-spacing: -0.01em;

  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${UI_COLORS.textSecondary};
`;

export const BoardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const BoardCard = styled.div`
  display: block;
  padding: 15px 16px;
  border-radius: 14px;
  ${homeCardSurface};
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const BoardId = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${UI_COLORS.textFaint};
  margin-bottom: 4px;
`;

export const BoardName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${UI_COLORS.textPrimary};
  margin-bottom: 6px;
`;

export const BoardDescription = styled.p`
  margin: 0 0 8px;
  font-size: 13px;
  color: ${UI_COLORS.textSecondary};
`;

export const BoardMeta = styled.div`
  font-size: 12px;
  color: ${UI_COLORS.textSubtle};
`;

export const AddBoardButton = styled(MuiButton)`
  border-radius: 11px;
  text-transform: none;
  font-weight: 700;
  padding-inline: 14px;
`;