"use client";

import styled from "styled-components";
import { Button as MuiButton, ButtonProps as MuiButtonProps } from "@mui/material";

export type ButtonProps = MuiButtonProps;

const StyledButton = styled(MuiButton)`
  text-transform: none;
`;

export function Button(props: ButtonProps) {
  return <StyledButton {...props} />;
}