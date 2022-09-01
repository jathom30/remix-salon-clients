import { useWindowDimensions } from "~/hooks/useWindowDimensions";
import type { ButtonProps } from "./Button"
import { Button } from "./Button"

export const CollapsingButton = (props: ButtonProps) => {
  const { children } = props
  const { isMobile } = useWindowDimensions()
  return (
    <Button {...props}>{!isMobile ? children : null}</Button>
  )
}