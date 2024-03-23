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
      createdAt: waste?.createdAt,
    }
  );
};

exports.fetchWastes = async (req, res) => {
  try {
    var wasteCategory = req.query?.wasteCategory;
    var province = req.query?.province;
    var cityMunicipality = req.query?.cityMunicipality;

    var wastes = await Waste.find({});

    if (cityMunicipality && !province && !wasteCategory) {
      console.log("1");
      var wasteData = Promise.all(
        wastes.map(async (waste) => {
          const user = await Users.findById(waste.user);
          return (
            user?.cityMunicipality == cityMunicipality &&
            wasteItems(user, waste)
          );
        })
      );
    } else if (province && !cityMunicipality && !wasteCategory) {
      console.log("2");
      var wasteData = Promise.all(
        wastes.map(async (waste) => {
          const user = await Users.findById(waste.user);
          return user?.province == province && wasteItems(user, waste);
        })
      );
      console.log("wasteData", await wasteData);
    } else if (wasteCategory && province && !cityMunicipality) {
      console.log("3");
      var wastes = await Waste.find({ wasteCategory: wasteCategory });
      var wasteData = Promise.all(
        wastes.map(async (waste) => {
          const user = await Users.findById(waste.user);
          console.log(
            "user?.province",
            user?.province == province && waste?.wasteCategory == wasteCategory
          );
          console.log("province", province);
          return (
            user?.province == province &&
            waste?.wasteCategory == wasteCategory &&
            wasteItems(user, waste)
          );
        })
      );
    } else if (wasteCategory && cityMunicipality && !province) {
      console.log("4");
      var wastes = await Waste.find({ wasteCategory: wasteCategory });
      var wasteData = Promise.all(
        wastes.map(async (waste) => {
          const user = await Users.findById(waste.user);
          return (
            user?.cityMunicipality == cityMunicipality &&
            waste?.wasteCategory == wasteCategory &&
            wasteItems(user, waste)
          );
        })
      );
    } else {
      var wasteData = Promise.all(
        wastes.map(async (waste) => {
          const user = await Users.findById(waste.user);
          return wasteItems(user, waste);
        })
      );
    }

    res.status(200).json(await wasteData);
  } catch (error) {
    console.log("Error", error);
  }
};

exports.fetchUserWaste = async (req, res) => {
  try {
    const { userId } = req.body;
    const wastes = await Waste.find({ user: userId });
    const wasteData = Promise.all(
      wastes.map(async (waste) => {
        return {
          waste: {
            post: waste.post,
            wasteCategory: waste.wasteCategory,
            image: waste.image,
            user: waste.user,
          },
        };
      })
    );

    res.status(200).json(wasteData);
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
