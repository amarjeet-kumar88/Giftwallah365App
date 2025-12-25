"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useRecentStore } from "@/store/recent.store";
import RelatedProducts from "@/components/product/RelatedProducts";
import CustomersAlsoBought from "@/components/product/CustomersAlsoBought";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showViewer, setShowViewer] = useState(false);

  const addToCart = useCartStore((s) => s.addToCart);
  const buyNow = useCartStore((s) => s.buyNow);
  const user = useAuthStore((s) => s.user);

  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addRecent = useRecentStore((s) => s.add);

  /* FETCH PRODUCT */
  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  /* ADD TO RECENTLY VIEWED */
  useEffect(() => {
    if (product) addRecent(product);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center
      bg-linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827]
      text-slate-400">
        Loading product...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-10
      bg-linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827]
      text-white"
    >
      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-2">

        {/* ================= IMAGE GALLERY ================= */}
        <div>

          {/* ===== MOBILE MAIN IMAGE (NO CROP) ===== */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 scrollbar-hide">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="min-w-full snap-center flex justify-center"
                  onClick={() => {
                    setActiveImage(i);
                    setShowViewer(true);
                  }}
                >
                  <img
                    src={img.url}
                    alt={product.title}
                    className="
                      max-h-80 w-full
                      object-contain
                      rounded-2xl
                      bg-black/40
                      cursor-pointer
                    "
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ===== THUMBNAILS (MOBILE + DESKTOP) ===== */}
          <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                onClick={() => setActiveImage(i)}
                className={`
                  h-16 w-16 shrink-0
                  rounded-xl cursor-pointer
                  object-cover border transition
                  ${
                    i === activeImage
                      ? "border-indigo-500 ring-2 ring-indigo-500/40"
                      : "border-white/10 hover:border-white/30"
                  }
                `}
                alt={product.title}
              />
            ))}
          </div>

          {/* ===== DESKTOP MAIN IMAGE ===== */}
          <div className="hidden md:block mt-4">
            <motion.img
              key={activeImage}
              src={product.images[activeImage]?.url}
              className="
                w-full max-h-130
                object-contain
                rounded-3xl
                bg-black/40
                shadow-2xl
              "
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* ================= DETAILS ================= */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            {product.title}
          </h1>

          {/* PRICE */}
          <div className="flex items-center gap-4 mb-3">
            <span className="text-3xl font-bold text-emerald-400">
              ₹{product.price}
            </span>
            {product.mrp && (
              <span className="line-through text-slate-400">
                ₹{product.mrp}
              </span>
            )}
          </div>

          {/* DISCOUNT */}
          {product.discountPercent > 0 && (
            <span className="inline-block mb-4
            bg-amber-400/20 text-amber-300
            text-sm font-semibold px-3 py-1 rounded-full">
              {product.discountPercent}% OFF
            </span>
          )}

          {/* DESCRIPTION */}
          <p className="mt-4 text-slate-300 leading-relaxed">
            {product.description || "Premium quality gift item."}
          </p>

          {/* ACTIONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">

            {/* ADD TO CART */}
            <button
              onClick={() => addToCart(product)}
              className="flex-1 py-3 rounded-xl font-semibold
              bg-linear-to-r from-indigo-500 to-purple-600
              text-white shadow-lg hover:opacity-90 transition"
            >
              Add to Cart
            </button>

            {/* WISHLIST */}
            <button
              onClick={async () => {
                const added = await toggleWishlist(product._id);
                alert(added ? "Added to wishlist ❤️" : "Removed from wishlist");
              }}
              className="flex items-center justify-center gap-2 px-4 py-3
              rounded-xl border border-pink-500
              text-pink-400 hover:bg-pink-500/10 transition"
            >
              <Heart size={18} />
              Wishlist
            </button>

            {/* BUY NOW */}
            <button
              onClick={() => {
                if (!user) {
                  router.push("/login");
                  return;
                }
                buyNow(product);
                router.push("/checkout");
              }}
              className="flex-1 py-3 rounded-xl font-semibold
              border border-indigo-500 text-indigo-400
              hover:bg-indigo-500/10 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* ================= RECOMMENDATIONS ================= */}
      <CustomersAlsoBought productId={product._id} />
      <RelatedProducts productId={product._id} />

      {/* ================= FULLSCREEN IMAGE VIEWER ================= */}
      {showViewer && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center"
          onClick={() => setShowViewer(false)}
        >
          <div
            className="flex overflow-x-auto snap-x snap-mandatory w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {product.images.map((img, i) => (
              <div
                key={i}
                className="min-w-full snap-center flex items-center justify-center"
              >
                <img
                  src={img.url}
                  className="max-h-full w-full object-contain"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowViewer(false)}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
