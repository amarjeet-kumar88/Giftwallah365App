"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
import ReviewForm from "@/components/reviews/ReviewForm";
import ReviewList from "@/components/reviews/ReviewList";
import RatingStars from "@/components/reviews/RatingStars";
import RatingDistribution from "@/components/reviews/RatingDistribution";
import ReviewsSection from "@/components/reviews/ReviewsSection";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showViewer, setShowViewer] = useState(false);

  const mobileSliderRef = useRef<HTMLDivElement>(null);

  const addToCart = useCartStore((s) => s.addToCart);
  const buyNow = useCartStore((s) => s.buyNow);
  const user = useAuthStore((s) => s.user);

  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addRecent = useRecentStore((s) => s.add);

  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState<any>(null);

  const loadReviews = async (productId: string) => {
    const res = await api.get(`/reviews/${productId}`);
    setReviews(res.data);
  };

  const loadRatingStats = async (productId: string) => {
    const res = await api.get(`/reviews/stats/${productId}`);
    setRatingStats(res.data);
  };

  useEffect(() => {
    if (product?._id) {
      loadReviews(product._id);
      loadRatingStats(product._id);
    }
  }, [product]);

  /* FETCH PRODUCT */
  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  /* ADD TO RECENTLY VIEWED */
  useEffect(() => {
    if (product) addRecent(product);
  }, [product]);

  /* 🔥 SCROLL MOBILE IMAGE ON THUMB CLICK */
  const scrollToImage = (index: number) => {
    setActiveImage(index);
    if (mobileSliderRef.current) {
      mobileSliderRef.current.scrollTo({
        left: index * mobileSliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  if (!product) {
    return (
      <div
        className="min-h-screen flex items-center justify-center
      bg-linear-to-br from-[#0B0F1A] via-[#0E1324] to-[#111827]
      text-slate-400"
      >
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
          {/* ===== MOBILE MAIN IMAGE ===== */}
          <div className="md:hidden">
            <div
              ref={mobileSliderRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-4 scrollbar-hide"
            >
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
                    className="max-h-80 w-full object-contain
                    rounded-2xl bg-black/40 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ===== THUMBNAILS ===== */}
          <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                onClick={() => scrollToImage(i)}
                className={`h-16 w-16 shrink-0 rounded-xl
                cursor-pointer object-cover border transition
                ${
                  i === activeImage
                    ? "border-indigo-500 ring-2 ring-indigo-500/40"
                    : "border-white/10 hover:border-white/30"
                }`}
                alt={product.title}
              />
            ))}
          </div>

          {/* ===== DESKTOP MAIN IMAGE ===== */}
          <div className="hidden md:block mt-4">
            <motion.img
              key={activeImage}
              src={product.images[activeImage]?.url}
              className="w-full max-h-130
              object-contain rounded-3xl
              bg-black/40 shadow-2xl"
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

          {/* ⭐ RATING SUMMARY */}
          {/* ⭐ RATING SUMMARY */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT: AVG RATING */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-extrabold text-yellow-400">
                  {product.rating}
                </span>
                <div>
                  <RatingStars value={product.rating} />
                  <p className="text-sm text-slate-400">
                    {product.numReviews} reviews
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: DISTRIBUTION BARS */}
            {ratingStats && (
              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <RatingDistribution stats={ratingStats} />
              </div>
            )}
          </div>

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

          {product.discountPercent > 0 && (
            <span
              className="inline-block mb-4
            bg-amber-400/20 text-amber-300
            text-sm font-semibold px-3 py-1 rounded-full"
            >
              {product.discountPercent}% OFF
            </span>
          )}

          <p className="mt-4 text-slate-300 leading-relaxed">
            {product.description || "Premium quality gift item."}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 py-3 rounded-xl font-semibold
              bg-linear-to-r from-indigo-500 to-purple-600
              text-white shadow-lg hover:opacity-90 transition cursor-pointer"
            >
              Add to Cart
            </button>

            <button
              onClick={async () => {
                const added = await toggleWishlist(product._id);
                alert(added ? "Added to wishlist ❤️" : "Removed from wishlist");
              }}
              className="flex items-center justify-center gap-2
              px-4 py-3 rounded-xl border
              border-pink-500 text-pink-400
              hover:bg-pink-500/10 transition cursor-pointer"
            >
              <Heart size={18} />
              Wishlist
            </button>

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
              hover:bg-indigo-500/10 transition cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* ================= REVIEWS SECTION ================= */}
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-extrabold mb-6">Ratings & Reviews</h2>

        {user ? (
          <ReviewForm
            productId={product._id}
            onSuccess={() => loadReviews(product._id)}
          />
        ) : (
          <p className="text-slate-400 mb-4">Please login to write a review.</p>
        )}

        <ReviewList reviews={reviews} />
      </div>
      {/* ================= REVIEWS ================= */}
      <ReviewsSection productId={product._id} />
      <CustomersAlsoBought productId={product._id} />
      <RelatedProducts productId={product._id} />

      {/* ================= FULLSCREEN VIEWER ================= */}
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
                className="min-w-full snap-center
                flex items-center justify-center"
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
            className="absolute top-4 right-4 text-white text-2xl cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
