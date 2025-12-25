import Address from "../models/address.model.js";

export const addAddress = async (req, res) => {
  const address = await Address.create({
    ...req.body,
    user: req.user._id,
  });

  res.status(201).json(address);
};

export const getAddresses = async (req, res) => {
  const addresses = await Address.find({ user: req.user._id });
  res.json(addresses);
};
