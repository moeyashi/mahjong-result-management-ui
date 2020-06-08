import { FC, forwardRef } from "react";
import { MenuItem, MenuItemProps } from "@material-ui/core";
import Link, { LinkProps } from "next/link";

type MenuLinkItemProps = Omit<MenuItemProps, "href" | "component" | "button"> &
  Omit<LinkProps, "children" | "passHref"> & {
    className?: string;
  };

export const MenuItemLink: FC<MenuLinkItemProps> = forwardRef(
  (
    {
      href,
      as,
      prefetch,
      shallow,
      scroll,
      replace,
      className,
      children,
      ...otherProps
    },
    ref
  ) => (
    <Link
      href={href}
      as={as}
      prefetch={prefetch}
      shallow={shallow}
      scroll={scroll}
      replace={replace}
      passHref
    >
      <MenuItem ref={ref} className={className} {...otherProps}>
        {children}
      </MenuItem>
    </Link>
  )
);
