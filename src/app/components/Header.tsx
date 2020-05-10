import Link from "next/link";
import { FC } from "react";

export const Header: FC<{ pathname?: any }> = ({ pathname }) => (
  <header>
    <Link href="/">
      <a className={pathname === "/" ? "is-active" : ""}>Home</a>
    </Link>
    <Link href="/about">
      <a className={pathname === "/about" ? "is-active" : ""}>About</a>
    </Link>
  </header>
);
