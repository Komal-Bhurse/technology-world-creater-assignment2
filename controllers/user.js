import Farmer from "../models/farmer.js";

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
      farmerPhoto,
    } = data;

    if (
      !firstName ||
      !middleName ||
      !lastName ||
      !mobile ||
      !dob ||
      !gender ||
      !farmerPhoto
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

    const response = await Farmer.create({ ...data });

    res.status(201).json({
      status: "success",
      message: "farmer added successfull",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ status: "failed", error: "Unabled to add farmer" });
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

    const response = await Farmer.findByIdAndUpdate(_id, { ...filteredData });

    res.status(200).json({
      status: "success",
      message: "farmer updated successfully",
      data: response,
    });

  } catch (error) {
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
