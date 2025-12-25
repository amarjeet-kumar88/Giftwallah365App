export interface Product {
  _id: string;
  title: string;
  description: string;

  mrp: number;       // Original price
  price: number;     // Selling price
  discountPercent: number;

  stock: number;

  images: {
    url: string;
  }[];

  category?: {
    _id: string;
    name: string;
    type: "FESTIVAL" | "OCCASION" | "CORPORATE";
  };
}
