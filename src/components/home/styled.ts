import styled from "styled-components";
import { Button as MuiButton } from "@mui/material";

export const PageRoot = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background:
    radial-gradient(circle at 8% 8%, rgba(11, 99, 206, 0.09), transparent 36%),
    radial-gradient(circle at 84% 12%, rgba(14, 165, 164, 0.08), transparent 30%),
    #f6f8fc;
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
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(15, 23, 42, 0.06);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);

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
  color: #142036;
  letter-spacing: -0.01em;

  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #596983;
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
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #dbe3f0;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.07);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    border-color: #adc4e5;
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.11);
    transform: translateY(-2px);
  }
`;

export const BoardId = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8da0bc;
  margin-bottom: 4px;
`;

export const BoardName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #142036;
  margin-bottom: 6px;
`;

export const BoardDescription = styled.p`
  margin: 0 0 8px;
  font-size: 13px;
  color: #596983;
`;

export const BoardMeta = styled.div`
  font-size: 12px;
  color: #8195b3;
`;

export const AddBoardButton = styled(MuiButton)`
  border-radius: 11px;
  text-transform: none;
  font-weight: 700;
  padding-inline: 14px;
`;