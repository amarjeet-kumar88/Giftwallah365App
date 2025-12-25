import Category from "../models/category.model.js";
import slugify from "slugify";

export const createCategory = async (req, res) => {
  const { name, type } = req.body;

  const category = await Category.create({
    name,
    type,
    slug: slugify(name),
  });

  res.json(category);
};

export const getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json(categories);
};
