const Waste = require("../models/Waste");
const Users = require("../models/Users");
const Cloudinary = require("../utils/cloudinary");

const wasteItems = (user, waste) => {
  return (
    waste && {
      user: user,
      id: waste?._id,
      post: waste?.post,
      wasteCategory: waste?.wasteCategory,
      image: waste?.image,
      available: waste?.available,
      createdAt: waste?.createdAt,
    }
  );
};

exports.fetchWastes = async (req, res) => {
  try {
    var wastes = await Waste.find().sort({ createdAt: -1 });

    var wasteData = Promise.all(
      wastes.map(async (waste) => {
        const user = await Users.findById(waste.user);
        return wasteItems(user, waste);
      })
    );

    res.status(200).json(await wasteData);
  } catch (error) {
    console.log("Error", error);
  }
};

exports.postWasteImage = async (req, res) => {
  try {
    const { post, image, wasteCategory, user } = req.body;
    let wasteImage;
    if (image?.length > 0) {
      wasteImage = await Cloudinary.uploader.upload(image, {
        folder: "wastes",
        width: 450,
        crop: "scale",
      });
    }

    const newWaste = await Waste.create({
      post,
      wasteCategory,
      image: {
        url: wasteImage?.secure_url,
        public_id: wasteImage?.public_id,
      },
      user,
    });
    res.status(200).json(newWaste);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json(err);
  }
};

exports.updateWaste = async (req, res) => {
  try {
    const { post, wasteCategory, image } = req.body;
    const wasteId = req.params.wasteId;

    const waste = await Waste.findById(wasteId);
    if (waste) {
      let newImage;
      if (image?.length > 0) {
        newImage = await Cloudinary.uploader.upload(image, {
          folder: "wastes",
          width: 450,
          crop: "scale",
        });
      }
      if (waste?.image?.public_id !== newImage?.public_id) {
        await Cloudinary.uploader.destroy(waste.image.public_id);
        waste.image = {
          url: newImage?.secure_url,
          public_id: newImage?.public_id,
        };
      }
      waste.post = post;
      waste.wasteCategory = wasteCategory;
    }
    await waste.save({ validateBeforeSave: false });
    res.status(200).json(waste);
  } catch (error) {
    res.status(500).json(error);
    console.log("Error", error);
  }
};

exports.deleteWaste = async (req, res) => {
  try {
    console.log("req.params", req.params);
    await Waste.findByIdAndDelete(req.params.wasteId);
  } catch (error) {
    console.log("Error", error);
  }
};

exports.wasteAvailableOrNot = async (req, res) => {
  try {
    const wasteId = req.params.wasteId;
    const { available } = req.body;
    const waste = await Waste.updateOne(
      { _id: wasteId },
      {
        $set: { available: Boolean(available) },
      }
    );
    console.log("wasteUpdatedAvailable: ", waste);
  } catch (error) {
    console.log("Error", error);
  }
};
