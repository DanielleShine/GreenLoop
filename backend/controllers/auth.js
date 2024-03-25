const bcryptjs = require("bcryptjs");
const Cloudinary = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");

exports.registerUser = async (req, res, next) => {
  try {
    const {
      companyName,
      email,
      username,
      password,
      confirmPassword,
      organizationType,
      province,
      cityMunicipality,
      token,
      image,
    } = req.body;

    let result;
    if (image?.length > 0) {
      result = await Cloudinary.uploader.upload(image, {
        folder: "users/profile",
        width: 300,
        crop: "scale",
      });
    }

    if (!req.body?.onAdmin && password !== confirmPassword) {
      res.status(400).send("Password does not match");
    } else if (!username || !email || !password) {
      res.status(400).send("Please fill all required fields");
    } else {
      const userNameExist = await Users.findOne({ username });
      const emailExist = await Users.findOne({ email });
      if (userNameExist || emailExist) {
        res
          .status(400)
          .send(`${userNameExist ? "Username " : "Email "}already exists`);
      } else {
        const newUser = new Users({
          companyName,
          email,
          username,
          password,
          organizationType,
          province,
          cityMunicipality,
          token,
          image: {
            url: result?.secure_url,
            public_id: result?.public_id,
          },
        });

        bcryptjs.hash(password, 10, (err, hashedPassword) => {
          newUser.set("password", hashedPassword);
          newUser.save();
          next();
        });
        return res.status(200).send("Company registered successfully");
      }
    }
  } catch (error) {
    console.log(error, "Error");
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res
        .status(400)
        .send(`Please fill ${!username ? "username" : "password"}`);
    } else {
      const user = await Users.findOne({ username: username });
      console.log("user: ", user);
      if (!user) {
        res.status(400).send("Username or password is incorrect");
      } else {
        const validateUser = await bcryptjs.compare(password, user.password);
        if (!validateUser) {
          res.status(400).send("Password is incorrect");
        } else {
          const payload = {
            userId: user._id,
            email: user.email,
          };
          const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "JWT_SECRET_KEY";

          jwt.sign(
            payload,
            JWT_SECRET_KEY,
            { expiresIn: 84600 },
            async (err, token) => {
              await Users.updateOne(
                { _id: user._id },
                {
                  $set: { token },
                }
              );
              user.save();

              return res.status(200).json({
                user: {
                  id: user._id,
                  username: user.username,
                  companyName: user.companyName,
                  province: user.province,
                  cityMunicipality: user.cityMunicipality,
                },
                token: token,
              });
            }
          );
        }
      }
    }
  } catch (error) {
    console.log(error, "Error");
  }
};

exports.signOutUser = async (req, res) => {
  try {
    await Users.updateOne(
      { _id: req.params?.userId },
      {
        $set: { token: null },
      }
    );

    return res
      .status(200)
      .clearCookie("token ", { httpOnly: true })
      .json({ sucess: true, message: "User has been successfully signed out" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: err.message });
  }
};
