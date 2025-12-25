"use client";
import { motion } from "framer-motion";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {products.map((p) => (
        <motion.div key={p._id} variants={item}>
          <ProductCard product={p} />
        </motion.div>
      ))}
    </motion.div>
  );
}
