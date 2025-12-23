import styled from "styled-components";

export const PageRoot = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f4f5;
`;

export const PageMain = styled.main`
  width: 100%;
  max-width: 960px;
  padding: 32px 24px;
`;

export const Header = styled.header`
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #111827;
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
`;

export const BoardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
`;

export const BoardCard = styled.div`
  display: block;
  padding: 14px 16px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    border-color: #9ca3af;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
    transform: translateY(-1px);
  }
`;

export const BoardId = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9ca3af;
  margin-bottom: 4px;
`;

export const BoardName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
`;

export const BoardDescription = styled.p`
  margin: 0 0 8px;
  font-size: 13px;
  color: #6b7280;
`;

export const BoardMeta = styled.div`
  font-size: 12px;
  color: #9ca3af;
`;