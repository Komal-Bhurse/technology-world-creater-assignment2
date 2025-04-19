import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Link, useNavigate,useParams } from 'react-router-dom'
import { APICALL } from '@/hooks/useApiCall.js'
import Select from 'react-select';
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";


const initialRegisterValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    dob: "",
    gender: "",
    newBusiness: "",
    farmerPhoto: "",

    state: "",
    district: "",
    taluka: "",
    village: "",
    pincode: "",
    streetAddress: "",
    residencialType: "",

    farmerType: "",
    cropsGrown: "",
    whereYouSell: "",

    landState: "",
    landDistrict: "",
    landTaluka: "",
    landVillage: "",
    landServeyNo: "",
    landSubServeyNo: "",
    landownerName: "",

    addedBy: "",
};

const ScpRegisterSchema = [
    Yup.object().shape({
        firstName: Yup.string().required("Please enter First Name"),
        middleName: Yup.string().required("Please enter Middle Name"),
        lastName: Yup.string().required("Please enter Last Name"),
        mobile: Yup.string().min(10).max(10).required("Please enter Mobile number"),
        dob: Yup.string().required("Please enter DOB"),
        gender: Yup.string().required("Please enter Gender"),
        farmerPhoto: Yup.string().required("Please select farmer photo"),
    })
    ,
    Yup.object().shape({
        state: Yup.string().required("Please enter state"),
        district: Yup.string().required("Please enter district"),
        taluka: Yup.string().required("Please enter taluka"),
        village: Yup.string().required("Please enter village"),
        pincode: Yup.string().min(6).max(6).required("Please enter pincode"),
        streetAddress: Yup.string().required("Please enter street address"),
    }),
    Yup.object().shape({
        farmerType: Yup.string().required("Please enter farmer type"),
    }),
    Yup.object().shape({
        landState: Yup.string().required("Please enter state"),
        landDistrict: Yup.string().required("Please enter district"),
        landTaluka: Yup.string().required("Please enter taluka"),
        landServeyNo: Yup.string().required("Please enter servey no"),
        landSubServeyNo: Yup.string().required("Please enter sub servey no"),
        landownerName: Yup.string().required("Please enter owner name"),
    })
];


function index() {

    const { user } = useSelector((state) => state.user);
    const [farmerID, setFarmerID] = useState("")

    const {id} = useParams()

    const [initialData, setInitialData] = useState(initialRegisterValues);

    const [tab, setTab] = useState("step3");

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cropgrown = [
        { value: 'vegetables', label: 'Vegetable' },
        { value: 'fruits', label: 'Fruits' },
        { value: 'grains', label: 'Grains' },
        { value: 'nuts', label: 'Nuts' },
        { value: 'crops', label: 'Crops' },
        { value: 'herbs', label: 'Herbs' },
        { value: 'flowers', label: 'Flowers' },
        { value: 'medicinal', label: 'Medicinal' },
        { value: 'others', label: 'Others' }
    ];

    const [selectedCropGrown, setSelectedCropGrown] = useState([]);

    const whereyousell = [
        { value: 'market', label: 'Vegetable' },
        { value: 'manufacture', label: 'Fruits' },
        { value: 'mandi', label: 'Grains' },
        { value: 'busari', label: 'Nuts' },
        { value: 'wholesale', label: 'Wholesale' },
        { value: 'retailer', label: 'Retailer' },
        { value: 'online', label: 'Online' },
        { value: 'local', label: 'Local' },
        { value: 'farmers', label: 'Farmers' },
        { value: 'shop', label: 'Shop' },
        { value: 'others', label: 'Others' }
    ];

    const [selectedWhereYouSell, setSelectedWhereYouSell] = useState([]);

    const cropgrownochecks = ['Rice', 'Wheat', 'Soybean', 'Orange', 'Mangoes', 'Cotton'];
    const [selectedcropgrownochecks, setSelectedcropgrownochecks] = useState([]);

    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setSelectedcropgrownochecks([...selectedcropgrownochecks, value]);
        } else {
            setSelectedcropgrownochecks(selectedcropgrownochecks.filter(item => item !== value));
        }
    };

    function getUpdatedFields(oldObj, newObj) {
        const updated = {};

        for (const key in newObj) {
            if (
                oldObj[key] !== newObj[key] &&
                !(oldObj[key] == null && newObj[key] === '')
            ) {
                updated[key] = newObj[key];
            }
        }

        return updated;
    }



    const Formik = useFormik({
        initialValues: initialData,
        validationSchema: ScpRegisterSchema[tab - 1],
        onSubmit: async (values, { resetForm }) => {

            if (tab === 1) {
                setLoading(true);

                if (!values.farmerPhoto) {
                    return toast.error("Please select farmer photo")
                }

                const updatedFields = getUpdatedFields(initialRegisterValues, values)

                const formData = new FormData()
                for (const key in updatedFields) {
                    formData.append(key, updatedFields[key])
                }




                if (farmerID) {

                    formData.append("step", tab)
                    const response = await APICALL("put", `/api/user/${farmerID}`, formData, "formdata")
                    const res = response?.data;

                    if (res?.status === "success") {
                        toast.success(res?.message)
                        setLoading(false)
                        setTab(tab + 1)
                    }

                    if (res?.status === "failed") {
                        toast.error(res?.message)
                        setLoading(false)
                    }

                } else {

                    formData.append("addedBy", user?._id)

                    const response = await APICALL("post", "/api/user", formData, "formdata")
                    const res = response?.data;

                    if (res?.status === "success") {
                        toast.success(res?.message)
                        setLoading(false)
                        // dispatch(login(res?.data))
                        setFarmerID(res?.data?._id)
                        setInitialData(res?.data)
                        setTab(tab + 1)
                    }

                    if (res?.status === "failed") {
                        toast.error(res?.message)
                        setLoading(false)
                    }
                }
                setLoading(false)

                return
            }

            if (tab === 2) {


                if (!farmerID) {
                    setLoading(false)
                    return toast.error("Please fill the profile deatils first and save it")
                }

                setLoading(true);

                const formData = new FormData()
                for (const key in values) {
                    formData.append(key, values[key])
                }
                formData.append("step", tab)
                const response = await APICALL("put", `/api/user/${farmerID}`, formData, "formdata")
                const res = response?.data;

                if (res?.status === "success") {
                    toast.success(res?.message)
                    setLoading(false)
                    setInitialData(res?.data)
                    setTab(tab + 1)
                }

                if (res?.status === "failed") {
                    toast.error(res?.message)
                    setLoading(false)
                }
                setLoading(false)
                return
            }

            if (tab === 3) {
                setLoading(true);

                if (!farmerID) {
                    setLoading(false)
                    return toast.error("Please fill the profile deatils first and save it")
                }

                const CropsGrown1 = selectedCropGrown?.length > 0 ? selectedCropGrown?.join(",") : "";
                const CropsGrown2 = selectedcropgrownochecks?.length > 0 ? selectedcropgrownochecks?.join(",") : "";
                values.cropsGrown = CropsGrown1 + ":" + CropsGrown2

                values.whereYouSell = selectedWhereYouSell?.length > 0 ? selectedWhereYouSell?.join(",") : "";

                const formData = new FormData()
                for (const key in values) {
                    formData.append(key, values[key])
                }
                formData.append("step", tab)
                const response = await APICALL("put", `/api/user/${farmerID}`, formData, "formdata")
                const res = response?.data;

                if (res?.status === "success") {
                    toast.success(res?.message)
                    setLoading(false)
                    setInitialData(res?.data)
                    setTab(tab + 1)
                }

                if (res?.status === "failed") {
                    toast.error(res?.message)
                    setLoading(false)
                }
                setLoading(false)
                return
            }

            if (tab === 4) {
                setLoading(true);

                if (!farmerID) {
                    setLoading(false)
                    return toast.error("Please fill the profile deatils first and save it")
                }

                const formData = new FormData()
                for (const key in values) {
                    formData.append(key, values[key])
                }
                formData.append("step", tab)
                const response = await APICALL("put", `/api/user/${farmerID}`, formData, "formdata")
                const res = response?.data;

                if (res?.status === "success") {
                    toast.success(res?.message)
                    setLoading(false)
                    setInitialData(res?.data)
                    setTab(tab + 1)
                }

                if (res?.status === "failed") {
                    toast.error(res?.message)
                    setLoading(false)
                }
                setLoading(false)
                return
            }


        },
    });

    const getSingalData = async() =>{
         const response = axios.get(`/api/user/${id}`,{},{withCredentials:true})
         const res = response?.data
         if(res?.status === success){
            setInitialData(res?.data)
         }
         
    }
    useEffect(()=>{
        if(id){
            getSingalData()
            setFarmerID(id)
        }
    },[])

    return (
        <>
            <div className="container row m-auto my-2">
                <div className="m-auto">
                    <div className="card-body p-2 shadow">
                        <nav className="nav nav-pills nav-fill">
                            <span onClick={() => setTab("step1")} className={`nav-link ${tab === "step1" ? "active bg-success text-white" : "text-dark"}`} >Profile Details</span>
                            <span onClick={() => setTab("step2")} className={`nav-link ${tab === "step2" ? "active bg-success text-white" : "text-dark"}`} >Address Details</span>
                            <span onClick={() => setTab("step3")} className={`nav-link ${tab === "step3" ? "active bg-success text-white" : "text-dark"}`} >Farmer Details</span>
                            <span onClick={() => setTab("step4")} className={`nav-link ${tab === "step4" ? "active bg-success text-white" : "text-dark"}`} >Land Verification</span>
                        </nav>
                    </div>
                </div>
            </div>
            <form onSubmit={Formik.handleSubmit}>
                <div className="container row m-auto ">
                    <div className="m-auto">
                        <div className="card-body p-4 shadow">
                            <div>

                                {
                                    tab === "step1" &&
                                    <div className="row">
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="firstName" className="form-label">
                                                First Name
                                            </label>

                                            <input

                                                type="text"
                                                className="form-control"
                                                id="firstName"
                                                name="firstName"
                                                value={Formik.values.firstName}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                            />
                                            {
                                                Formik.touched.firstName && Formik.errors.firstName &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.firstName}
                                                </div>
                                            }

                                        </div>
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="middleName" className="form-label">
                                                Middle Name
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="middleName"
                                                name="middleName"
                                                value={Formik.values.middleName}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                            />
                                            {
                                                Formik.touched.middleName && Formik.errors.middleName &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.middleName}
                                                </div>
                                            }

                                        </div>
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="lastName" className="form-label">
                                                Last Name
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="lastName"
                                                name="lastName"
                                                value={Formik.values.lastName}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}

                                            />
                                            {
                                                Formik.touched.lastName && Formik.errors.lastName &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.lastName}
                                                </div>
                                            }

                                        </div>
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="mobile" className="form-label">
                                                Mobile Number
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="mobile"
                                                name="mobile"
                                                value={Formik.values.mobile}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                            />
                                            {
                                                Formik.touched.mobile && Formik.errors.mobile &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.mobile}
                                                </div>
                                            }

                                        </div>
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="dob" className="form-label">
                                                Date of Birth
                                            </label>

                                            <input
                                                type="date"
                                                className="form-control"
                                                id="dob"
                                                name="dob"
                                                value={Formik.values.dob}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}

                                            />
                                            {
                                                Formik.touched.dob && Formik.errors.dob &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.dob}
                                                </div>
                                            }

                                        </div>
                                        <div className="mb-3 col-lg-6 row">
                                            <label htmlFor="gender" className="form-label">
                                                Gender
                                            </label>
                                            <div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="gender"
                                                        id="inlineRadio1"
                                                        defaultValue="Male"
                                                        onChange={Formik.handleChange}
                                                        onBlur={Formik.handleBlur}
                                                    />
                                                    <label className="form-check-label" htmlFor="inlineRadio1">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="gender"
                                                        id="inlineRadio2"
                                                        defaultValue="Female"
                                                        onChange={Formik.handleChange}
                                                        onBlur={Formik.handleBlur}
                                                    />
                                                    <label className="form-check-label" htmlFor="inlineRadio2">
                                                        Female
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="gender"
                                                        id="inlineRadio3"
                                                        defaultValue="Other"
                                                        onChange={Formik.handleChange}
                                                        onBlur={Formik.handleBlur}
                                                    />
                                                    <label className="form-check-label" htmlFor="inlineRadio3">
                                                        Other
                                                    </label>
                                                </div>
                                            </div>
                                            {
                                                Formik.touched.gender && Formik.errors.gender &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.gender}
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-3 col-lg-12 row">
                                            <label htmlFor="newBussiness" className="form-label">
                                                New Bussiness
                                            </label>
                                            <div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="newBussiness"
                                                        id="inlineRadio4"
                                                        defaultValue="Yes"
                                                        onChange={Formik.handleChange}
                                                        onBlur={Formik.handleBlur}
                                                    />
                                                    <label className="form-check-label" htmlFor="inlineRadio4">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="newBussiness"
                                                        id="inlineRadio5"
                                                        defaultValue="No"
                                                        onChange={Formik.handleChange}
                                                        onBlur={Formik.handleBlur}
                                                    />
                                                    <label className="form-check-label" htmlFor="inlineRadio5">
                                                        No
                                                    </label>
                                                </div>

                                            </div>
                                            {
                                                Formik.touched.newBusiness && Formik.errors.newBusiness &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.newBusiness}
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-3 col-lg-12">
                                            <label htmlFor="farmerPhoto" className="form-label">
                                                Upload Farmer Photograph
                                            </label>

                                            <input
                                                type="file"
                                                className="form-control"
                                                id="farmerPhoto"
                                                name="farmerPhoto"
                                                accept="image/*"
                                                onChange={(e) => Formik.setFieldValue("farmerPhoto", e.target.files[0])}
                                            />
                                            {
                                                Formik.touched.farmerPhoto && Formik.errors.farmerPhoto &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.farmerPhoto}
                                                </div>
                                            }
                                        </div>



                                    </div>
                                }

                                {
                                    tab === "step2" &&

                                    <div className="row">
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="state" className="form-label">
                                                State
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="state"
                                                name="state"
                                                value={Formik.values.state}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                            />
                                            {
                                                Formik.touched.state && Formik.errors.state &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.state}
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="district" className="form-label">
                                                District
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="district"
                                                name="district"
                                                value={Formik.values.district}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}

                                            />
                                            {
                                                Formik.touched.district && Formik.errors.district &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.district}
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="taluka" className="form-label">
                                                Sub District/ Taluka
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="taluka"
                                                name="taluka"
                                                value={Formik.values.taluka}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}

                                            />
                                            {
                                                Formik.touched.taluka && Formik.errors.taluka &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.taluka}
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="village" className="form-label">
                                                Enter Village
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="village"
                                                name="village"
                                                value={Formik.values.village}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}

                                            />
                                            {
                                                Formik.touched.village && Formik.errors.village &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.village}
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="pincode" className="form-label">
                                                Enter PinCode
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="pincode"
                                                name="pincode"
                                                value={Formik.values.pincode}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                            />
                                            {
                                                Formik.touched.pincode && Formik.errors.pincode &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.pincode}
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-3 col-lg-12">
                                            <label htmlFor="streetAddress" className="form-label">
                                                Enter Street address
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="streetAddress"
                                                name="streetAddress"
                                                value={Formik.values.streetAddress}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                            />
                                            {
                                                Formik.touched.streetAddress && Formik.errors.streetAddress &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.streetAddress}
                                                </div>
                                            }


                                        </div>

                                        <div className="mb-3 col-lg-12 row">
                                            <label htmlFor="residentialType" className="form-label">
                                                Residencial Type
                                            </label>
                                            <div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="residentialType"
                                                        id="inlineRadio5"
                                                        defaultValue="Rural"
                                                        onChange={Formik.handleChange}
                                                        onBlur={Formik.handleBlur}
                                                    />
                                                    <label className="form-check-label" htmlFor="inlineRadio5">
                                                        Rural
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="residentialType"
                                                        id="inlineRadio6"
                                                        defaultValue="Urban"
                                                        onChange={Formik.handleChange}
                                                        onBlur={Formik.handleBlur}
                                                    />
                                                    <label className="form-check-label" htmlFor="inlineRadio6">
                                                        Urban
                                                    </label>
                                                </div>

                                            </div>
                                            {
                                                Formik.touched.newBusiness && Formik.errors.newBusiness &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.newBusiness}
                                                </div>
                                            }
                                        </div>

                                    </div>
                                }
                                {
                                    tab === "step3" && (

                                        <div className="row justify-content-center">
                                            <div className="mb-3 col-lg-12 row">
                                                <label htmlFor="farmerType" className="form-label">
                                                    Farmer Type (Farms in Acre)
                                                </label>
                                                <>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="farmerType"
                                                            id="inlineRadio7"
                                                            defaultValue="Traditional-(Very small farmer, typically does farming on rented land.)"
                                                            onChange={Formik.handleChange}
                                                            onBlur={Formik.handleBlur}
                                                        />
                                                        <label className="form-check-label" htmlFor="inlineRadio7">
                                                            Traditional (Very small farmer, typically does farming on rented land)
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="farmerType"
                                                            id="inlineRadio8"
                                                            defaultValue="Small-(0.5 Acre - 5 Acre)"
                                                            onChange={Formik.handleChange}
                                                            onBlur={Formik.handleBlur}
                                                        />
                                                        <label className="form-check-label" htmlFor="inlineRadio8">
                                                            Small (0.5 Acre - 5 Acre)
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="farmerType"
                                                            id="inlineRadio9"
                                                            defaultValue="Medium-(6 Acre - 15 Acre)"
                                                            onChange={Formik.handleChange}
                                                            onBlur={Formik.handleBlur}
                                                        />
                                                        <label className="form-check-label" htmlFor="inlineRadio9">
                                                            Medium (6 Acre - 15 Acre)
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="farmerType"
                                                            id="inlineRadio10"
                                                            defaultValue="Large-(16 Acre - 30 Acre)"
                                                            onChange={Formik.handleChange}
                                                            onBlur={Formik.handleBlur}
                                                        />
                                                        <label className="form-check-label" htmlFor="inlineRadio10">
                                                            Large (16 Acre - 30 Acre)
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="farmerType"
                                                            id="inlineRadio11"
                                                            defaultValue="Commercial-(Above 30 Acre)"
                                                            onChange={Formik.handleChange}
                                                            onBlur={Formik.handleBlur}
                                                        />
                                                        <label className="form-check-label" htmlFor="inlineRadio11">
                                                            Commercial (Above 30 Acre)
                                                        </label>
                                                    </div>


                                                </>
                                                {
                                                    Formik.touched.farmerType && Formik.errors.farmerType &&
                                                    <div className="form-text text-danger">
                                                        {Formik.errors.farmerType}
                                                    </div>
                                                }
                                            </div>
                                            <div className="mb-3 col-lg-12 row">
                                                <label htmlFor="farmerType" className="form-label">
                                                    Crops Grown
                                                </label>
                                                <div className="mb-3">
                                                    <Select
                                                        isMulti
                                                        options={cropgrown}
                                                        value={selectedCropGrown}
                                                        onChange={setSelectedCropGrown}
                                                        placeholder=" Eg. vegetables, fruits, nuts, etc."
                                                    />
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    {
                                                        cropgrownochecks?.map((item, index) => {
                                                            return (
                                                                <div className="form-check form-check-inline">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        value={item}
                                                                        checked={selectedcropgrownochecks.includes(item)}
                                                                        onChange={handleCheckboxChange}
                                                                        id={`inlineRadio12${index}`}
                                                                    />
                                                                    <label className="form-check-label" htmlFor={`inlineRadio12${index}`}>
                                                                        {item}
                                                                    </label>
                                                                </div>
                                                            )
                                                        })
                                                    }


                                                </div>
                                                {
                                                    Formik.touched.cropsGrown && Formik.errors.cropsGrown &&
                                                    <div className="form-text text-danger">
                                                        {Formik.errors.cropsGrown}
                                                    </div>
                                                }
                                            </div>

                                            <div className="mb-3 col-lg-12 row">
                                                <label htmlFor="whereyousell" className="form-label">
                                                    Where do you sell?
                                                </label>
                                                <div>
                                                    <Select
                                                        isMulti
                                                        options={whereyousell}
                                                        value={selectedWhereYouSell}
                                                        onChange={setSelectedWhereYouSell}
                                                        placeholder={"Eg. market, mandi, busari"}
                                                    />
                                                </div>
                                                {
                                                    Formik.touched.whereYouSell && Formik.errors.whereYouSell &&
                                                    <div className="form-text text-danger">
                                                        {Formik.errors.whereYouSell}
                                                    </div>
                                                }
                                            </div>
                                        </div>

                                    )
                                }
                                {
                                    tab === "step4" &&

                                    <div className="row">
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="landState" className="form-label">
                                                State
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="landState"
                                                name="landState"
                                                value={Formik.values.landState}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                            />
                                            {
                                                Formik.touched.landState && Formik.errors.landState &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.landState}
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="landDistrict" className="form-label">
                                                District
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="landDistrict"
                                                name="landDistrict"
                                                value={Formik.values.landDistrict}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}

                                            />
                                            {
                                                Formik.touched.landDistrict && Formik.errors.landDistrict &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.landDistrict}
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="landTaluka" className="form-label">
                                                Sub District/ Taluka
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="landTaluka"
                                                name="landTaluka"
                                                value={Formik.values.landTaluka}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}

                                            />
                                            {
                                                Formik.touched.landTaluka && Formik.errors.landTaluka &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.landTaluka}
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="landVillage" className="form-label">
                                                Enter Village
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="landVillage"
                                                name="landVillage"
                                                value={Formik.values.landVillage}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}

                                            />
                                            {
                                                Formik.touched.landVillage && Formik.errors.landVillage &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.landVillage}
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="landServeyNo" className="form-label">
                                                Servey No
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="landServeyNo"
                                                name="landServeyNo"
                                                value={Formik.values.landServeyNo}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                            />
                                            {
                                                Formik.touched.landServeyNo && Formik.errors.landServeyNo &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.landServeyNo}
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-3 col-lg-12">
                                            <label htmlFor="landSubServeyNo" className="form-label">
                                                Sub - Servey No
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="landSubServeyNo"
                                                name="landSubServeyNo"
                                                value={Formik.values.landSubServeyNo}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                            />
                                            {
                                                Formik.touched.landSubServeyNo && Formik.errors.landSubServeyNo &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.landSubServeyNo}
                                                </div>
                                            }


                                        </div>

                                        <div className="mb-3 col-lg-12">
                                            <label htmlFor="landownerName" className="form-label">
                                                Select Owner Name
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="landownerName"
                                                name="landownerName"
                                                value={Formik.values.landownerName}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                            />
                                            {
                                                Formik.touched.landownerName && Formik.errors.landownerName &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.landownerName}
                                                </div>
                                            }
                                        </div>

                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container row m-auto my-2">
                    <div className="m-auto">
                        <div className="card-body p-2 shadow bg-warning">
                            <div className="text-center">
                                {loading ? (
                                    <button type="button" className='fw-bold fs-5'>
                                        <div className="spinner-border spinner-border-sm" role="status"></div>
                                    </button>
                                ) : (

                                    <button type="submit" className='fw-bold fs-5'>
                                        Save & Continue
                                    </button>

                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default index