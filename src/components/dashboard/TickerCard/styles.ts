import styled from "styled-components";

export const Card = styled.div`
    width: 100%;
    background: #fff;
    border-radius: 10px;
    padding: 14px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 8px;
`

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TicketId = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
`;

export const TypeBadge = styled.div<{ $type: string }>`
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
  text-transform: capitalize;
  background: ${({ $type }) =>
    $type === "bug" ? "#fee2e2" :
    $type === "feature" ? "#dbeafe" :
    "#f3f4f6"};
  color: ${({ $type }) =>
    $type === "bug" ? "#b91c1c" :
    $type === "feature" ? "#1d4ed8" :
    "#374151"};
`;

export const Title = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
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
  color: #6b7280;
`;

export const Progress = styled.div`
  height: 4px;
  background: #e5e7eb;
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