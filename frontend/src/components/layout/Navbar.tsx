"use client";

import { useState } from "react";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import MobileMenuDrawer from "./MobileMenuDrawer";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* MOBILE */}
      <MobileNavbar onMenuOpen={() => setMenuOpen(true)} />
      <MobileMenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {/* DESKTOP */}
      <DesktopNavbar />
    </>
  );
}
