import React, { FC } from "react";
import { Button } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import Link, { LinkProps } from "next/link";

export type ButtonLinkProps = Omit<ButtonProps, "href"> &
  Omit<LinkProps, "children" | "passHref"> & {
    className?: string;
    target?: string;
  };

export const ButtonLink: FC<ButtonLinkProps> = ({
  href,
  as,
  prefetch,
  shallow,
  scroll,
  replace,
  className,
  children,
  ...otherProps
}) => (
  <Link
    href={href}
    as={as}
    prefetch={prefetch}
    shallow={shallow}
    scroll={scroll}
    replace={replace}
    passHref
  >
    <Button className={className} {...otherProps}>
      {children}
    </Button>
  </Link>
);
