import Farmer from "../models/farmer.js";
import fs from "fs";
import path from "path";
import { FilterRequiredData } from "../services/datafilterartion.js";

const getAllUsers = async (req, res) => {
  try {
    const addedBy = req.user._id;

    const response = await Farmer.find({ addedBy });

    return res
      .status(200)
      .json({ status: "success", data: response, message: "success" });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Unabled to get farmers , please try again",
      data: "",
    });
  }
};

const getOneUser = async (req, res) => {
  try {
    const _id = req.params.id;

    const response1 = await Farmer.findById(_id);

    if (!response1)
      return res.status(404).json({
        status: "failed",
        message: "Farmer Not Found!",
        data: response1,
      });

    return res
      .status(200)
      .json({ status: "success", message: "success", data: response1 });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Unabled to get Farmer, please try again",
      data: "",
    });
  }
};

const addOneUser = async (req, res) => {
  try {
    const data = req.body;

    const {
      firstName,
      middleName,
      lastName,
      mobile,
      dob,
      gender,
    } = data;

    if (
      !firstName ||
      !middleName ||
      !lastName ||
      !mobile ||
      !dob ||
      !gender 
    ) {
      return res.status(404).json({
        status: "failed",
        message: "Please fill the requred data",
        data: "",
        error: "",
      });
    }

    if (mobile.length !== 10) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid Mobile",
        data: "",
        error: "",
      });
    }

   const user = await Farmer.findOne({ mobile });
    
   if (user) {
    return res
      .status(400)
      .json({ status: "failed", message: "The farmer with given Mobile number is already exists, please use another mobile number ", data: "" });
  }

    const response = await Farmer.create({ ...data });


    const farmerUserID = response?._id?.toString();
    
        const userDir = path.resolve(`./uploads/${farmerUserID}`);
        fs.mkdirSync(userDir, { recursive: true });
    
        const updatedPaths = {};
    
        for (const field of ["farmerPhoto"]) {
          const file = req.files?.[field]?.[0];
          if (file) {
            const oldPath = file.path;
            const newPath = path.join(userDir, file.filename);
            fs.renameSync(oldPath, newPath);
            updatedPaths[`${field}`] = `uploads/${farmerUserID}/${file.filename}`;
          }
        }

        const response2 = await Farmer.findByIdAndUpdate(
              farmerUserID,
              updatedPaths,
              {new:true}
            );

    res.status(201).json({
      status: "success",
      message: "farmer added successfull",
      data: response2,
    });

  } catch (error) {
    const fields = ["farmerPhoto"];
        fields.forEach((field) => {
          const file = req.files?.[field]?.[0];
          if (file && file.path) {
            fs.unlink(file.path, (unlinkErr) => {
              if (unlinkErr) {
                // console.error(
                //   `Failed to delete temp file: ${file.path}`,
                //   unlinkErr
                // );
              } else {
                // console.log(`Deleted temp file: ${file.path}`);
              }
            });
          }
        });

    res.status(500).json({ status: "failed", message: error?.message, data: "" });
  }
};

const updateOneUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const data = req.body;

    if (!_id) {
      return res
        .status(404)
        .json({ status: "failed", message: "Farmer Not Found!", data: "" });
    }

    const response1 = await Farmer.findById(_id);

    if (!response1)
      return res
        .status(404)
        .json({ status: "failed", message: "Farmer Not Found!", data: "" });

        const steps = ["step1", "step2", "step3", "step4"];

    if (!steps.includes(data?.step)) {
      return res
        .status(404)
        .json({ status: "failed", message: "Invalid step", data: "" });
    }

    const { filteredData, hasEmptyField } = FilterRequiredData(
      data?.step,
      data
    );

    if (hasEmptyField) {
      return res.status(404).json({
        status: "failed",
        message: "Please fill the requred data",
        data: "",
      });
    }

    const userDir = path.resolve(`./uploads/${_id}`);
    fs.mkdirSync(userDir, { recursive: true }); // Safe if already exists

    const updatedPaths = {};

    // 2. Check and update file fields
    const fileFields = ['farmerPhoto'];

    for (const field of fileFields) {
      const file = req.files?.[field]?.[0];

      if (file) {
        // 3. Delete old file if exists
        const oldFilePath = path.resolve(response1[field] || '');
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }

        // 4. Move new file from temp to user folder
        const newPath = path.join(userDir, file.filename);
        fs.renameSync(file.path, newPath);

        updatedPaths[field] = `uploads/${_id}/${file.filename}`;
      }
    }

    // 5. Merge form fields with updatedPaths
    const updatedFarmer = await Farmer.findByIdAndUpdate(
      _id,
      { ...filteredData, ...updatedPaths },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "farmer updated successfully",
      data: updatedFarmer,
    });

  } catch (error) {
    const fields = ["farmerPhoto"];
        fields.forEach((field) => {
          const file = req.files?.[field]?.[0];
          if (file && file.path) {
            fs.unlink(file.path, (unlinkErr) => {
              if (unlinkErr) {
                // console.error(
                //   `Failed to delete temp file: ${file.path}`,
                //   unlinkErr
                // );
              } else {
                // console.log(`Deleted temp file: ${file.path}`);
              }
            });
          }
        });
        
    res
      .status(500)
      .json({ status: "failed", error: "Unabled to update farmer", data: "" });
  }
};

const deleteOneUser = async (req, res) => {
  try {
    const _id = req.params.id;

    const response1 = await Farmer.findById(_id);

    if (!response1)
      return res.status(404).json({
        status: "failed",
        message: "Farmer Not Found!",
        data: response1,
      });

    const response2 = await Farmer.deleteOne({ _id });

    return res.status(200).json({
      status: "success",
      message: "farmer deleted successfully",
      data: response2,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Unabled to delete farmer , please try again ",
      data: "",
    });
  }
};

export { getAllUsers, getOneUser, addOneUser, updateOneUser, deleteOneUser };
