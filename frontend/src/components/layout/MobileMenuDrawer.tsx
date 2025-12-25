"use client";

import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Heart,
  Bell,
  User,
  Layers,
  Gift,
  Tag,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { motion, AnimatePresence } from "framer-motion";

/* ================= ANIMATIONS ================= */

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      stiffness: 260,
      damping: 28,
    },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.25 },
  },
};


const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export default function MobileMenuDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, logout } = useAuthStore();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* 🔲 BACKDROP */}
          <motion.div
            onClick={onClose}
            className="absolute inset-0
            bg-black/60 backdrop-blur-md"
          />

          {/* 👉 DRAWER */}
          <motion.aside
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="
              absolute right-0 top-0 h-full w-72
              bg-linear-to-br
              from-[#0B0F1A] via-[#0E1324] to-[#111827]
              text-white
              shadow-2xl
              flex flex-col
            "
          >
            {/* ================= TOP HEADER ================= */}
            <div className="relative p-5 border-b border-white/10">
              {/* ❌ MINIMIZE ICON */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4
                text-slate-400 hover:text-white transition"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>

              {/* 👤 USER INFO */}
              {!user ? (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="
                    inline-block mt-2
                    px-5 py-2 rounded-xl
                    bg-linear-to-r from-indigo-500 to-purple-600
                    text-white font-semibold
                    shadow-lg
                  "
                >
                  Login / Signup
                </Link>
              ) : (
                <div className="pr-8">
                  <p className="font-semibold text-lg leading-tight">
                    {user.name || "User"}
                  </p>
                  <p className="text-sm text-slate-400">
                    {user.phone}
                  </p>
                </div>
              )}
            </div>

            {/* ================= SECTION 1 ================= */}
            <motion.nav
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="p-5 space-y-3 border-b border-white/10"
            >
              <MenuItem href="/orders" icon={Package} label="My Orders" onClick={onClose} />
              <MenuItem href="/cart" icon={ShoppingCart} label="My Cart" onClick={onClose} />
              <MenuItem href="/wishlist" icon={Heart} label="My Wishlist" onClick={onClose} />
              <MenuItem href="/notifications" icon={Bell} label="My Notifications" onClick={onClose} />
              <MenuItem href="/account" icon={User} label="My Account" onClick={onClose} />
            </motion.nav>

            {/* ================= SECTION 2 ================= */}
            <motion.nav
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="p-5 space-y-3 border-b border-white/10"
            >
              <MenuItem href="/categories" icon={Layers} label="All Categories" onClick={onClose} />
              <MenuItem href="/about" icon={Gift} label="More on GiftWallah365" onClick={onClose} />
              <MenuItem href="/offers" icon={Tag} label="New Offers" onClick={onClose} />
            </motion.nav>

            {/* ================= SECTION 3 ================= */}
            <motion.nav
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="p-5 space-y-3 mt-auto"
            >
              <MenuItem href="/help" icon={HelpCircle} label="Help Center" onClick={onClose} />

              {user && (
                <motion.button
                  variants={itemVariants}
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="
                    flex items-center gap-3
                    text-rose-400 font-medium
                    hover:text-rose-300 transition
                  "
                >
                  <LogOut size={18} />
                  Logout
                </motion.button>
              )}
            </motion.nav>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================= MENU ITEM ================= */

function MenuItem({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: any;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Link
        href={href}
        onClick={onClick}
        className="
          flex items-center gap-3
          px-3 py-2 rounded-xl
          text-slate-300
          hover:text-white
          hover:bg-white/10
          transition
        "
      >
        <Icon size={18} />
        <span className="text-sm font-medium">{label}</span>
      </Link>
    </motion.div>
  );
}
