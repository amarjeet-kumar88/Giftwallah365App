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


export const setDefaultAddress = async (req, res) => {
  const { id } = req.params;

  // remove old default
  await Address.updateMany(
    { user: req.user._id },
    { isDefault: false }
  );

  const address = await Address.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { isDefault: true },
    { new: true }
  );

  res.json(address);
};

export const updateAddress = async (req, res) => {
  const address = await Address.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );

  res.json(address);
};

export const deleteAddress = async (req, res) => {
  await Address.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  res.json({ success: true });
};
