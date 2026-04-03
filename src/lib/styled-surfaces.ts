import { css } from "styled-components";
import { UI_BACKGROUNDS, UI_COLORS, UI_SHADOWS } from "./ui-tokens";
import { MuiLikeTheme } from "@/types";

export const resolvePaperBackground = (theme: unknown) =>
  (theme as MuiLikeTheme)?.palette?.background?.paper ?? UI_COLORS.surface;

export const resolveHoverBackground = (theme: unknown) =>
  (theme as MuiLikeTheme)?.palette?.action?.hover ?? "#f4f4f5";

export const ambientPageBackground = css`
  background: ${UI_BACKGROUNDS.ambient}, ${UI_COLORS.pageBackground};
`;

export const ambientDashboardBackground = css`
  background: ${UI_BACKGROUNDS.ambientDashboard}, ${UI_COLORS.pageBackground};
`;

export const elevatedPanelSurface = css`
  background: ${({ theme }) => resolvePaperBackground(theme)};
  border: 1px solid ${UI_COLORS.borderMuted};
  box-shadow: ${UI_SHADOWS.surfaceMd};
`;

export const glassPanelSurface = css`
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid ${UI_COLORS.borderSoft};
  box-shadow: 0 5px 18px rgba(15, 23, 42, 0.07);
`;

export const interactiveCardSurface = css`
  background: ${UI_COLORS.surface};
  border: 1px solid ${UI_COLORS.borderStrong};
  box-shadow: 0 5px 14px rgba(15, 23, 42, 0.08);

  &:hover {
    border-color: ${UI_COLORS.borderHover};
    box-shadow: ${UI_SHADOWS.surfaceHover};
  }
`;

export const homeCardSurface = css`
  background: ${UI_COLORS.surfaceStrong};
  border: 1px solid #dbe3f0;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.07);

  &:hover {
    border-color: ${UI_COLORS.borderHoverStrong};
    box-shadow: ${UI_SHADOWS.surfaceHoverLg};
  }
`;

export const modalSurface = css`
  background: ${({ theme }) => resolvePaperBackground(theme)};
  box-shadow: ${UI_SHADOWS.modal};
`;

export const mutedBlockSurface = css`
  background: ${({ theme }) => resolveHoverBackground(theme)};
`;