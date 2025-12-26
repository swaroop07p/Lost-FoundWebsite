const Item = require("../models/Item");

exports.postItem = async (req, res) => {
  const item = await Item.create({
    ...req.body,
    postedBy: req.user.id
  });
  res.json(item);
};

exports.getItems = async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const items = await Item.find(filter).populate("postedBy", "name email");
  res.json(items);
};


exports.claimItem = async (req, res) => {
  const { itemId } = req.body;

  const item = await Item.findById(itemId);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  item.claimed = true;
  item.claimedBy = req.user.id;
  item.claimedAt = new Date();

  await item.save();

  res.json({ message: "Item claimed successfully" });
};


exports.getClaimedItems = async (req, res) => {
  const items = await Item.find({ claimed: true })
    .populate("claimedBy", "name email");

  res.json(items);
};
