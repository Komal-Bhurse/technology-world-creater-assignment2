import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Link, useNavigate } from 'react-router-dom'
import { APICALL } from '@/hooks/useApiCall.js'

import { useDispatch } from "react-redux";
import { login } from '@/redux/userSlice'
import axios from "axios";

const initialRegisterValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    email: "",
    scpID: "",
    password: "",
    cPassword: "",
    state: "",
    district: "",
    pincode: "",
    pAddress: "",
    landMark: "",
    officeAddress: "",
    sapa: false,
    scpCertificate: "",
    officePhoto: "",
    otp: "",
};

const ScpRegisterSchema = [
    Yup.object().shape({
    firstName: Yup.string().required("Please enter First Name"),
    middleName: Yup.string().required("Please enter Middle Name"),
    lastName: Yup.string().required("Please enter Last Name"),
    mobile: Yup.string().min(10).max(10).required("Please enter Mobile number"),
    scpID: Yup.string().required("Please enter SCP ID"),
    password: Yup.string().min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
        .required("Please enter password"),
    cPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required("Please re-enter password"),

})
,
Yup.object().shape({
    state: Yup.string().required("Please enter state"),
    district: Yup.string().required("Please enter district"),
    pincode: Yup.string().min(6).max(6).required("Please enter pincode"),
    pAddress: Yup.string().required("Please enter permanent address"),
    scpCertificate: Yup.string().required("Please select scp certificate"),
    officePhoto: Yup.string().required("Please select office photo"),
}),
Yup.object().shape({
    otp: Yup.string().min(6, 'Invalid OTP').max(6, 'Invalid OTP').required("Please enter otp"),
})
];


function index() {

    const [totalSteps, setTotalSteps] = useState(3);

    const [step, setStep] = useState(1);

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const UpoadImage = async(file)=>{
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_upload_preset)
        formData.append('cloud_name', import.meta.env.VITE_cloud_name)
        const resp = await axios.post(import.meta.env.VITE_upload_base_url_api, formData)
        return resp?.data?.url.split("/")?.slice(4)?.join("/")
    }

    const Formik = useFormik({
        initialValues: initialRegisterValues,
        validationSchema: ScpRegisterSchema[step - 1],
        onSubmit: async (values, { resetForm }) => {

            if (step === 1) {
                return setStep(step + 1)
            }

            if (step === 2) {
                 SendOTP()
                 return;
            }

            if (step === 3) {
                try {

                    if (!values.scpCertificate || !values.officePhoto) {
                        return toast.error("Please select scp certificate and office photo")
                    }
                    
                    const res0 =  await UpoadImage(values.scpCertificate)
    
                    const res1 =  await UpoadImage(values.officePhoto)
    
                    if(!res0 || !res1){
                        return toast.error("Unable to upload images, please try again")
                        
                    }
                    values.scpCertificate = res0
                    values.officePhoto = res1    

                    delete values.cPassword
                    delete values.sapa
                    setLoading(true);
                    const response = await APICALL("post", "/api/auth/verify-otp", values)
                    const res = response?.data;

                    if (res?.status === "success") {
                        toast.success(res?.message)
                        setLoading(false)
                        resetForm()
                        dispatch(login(res?.data))
                        navigate("/scp/dashboard")
                        
                    }

                    if (res?.status === "failed") {
                        toast.error(res?.message)
                        setLoading(false)
                    }
                    return

                } catch (error) {
                    toast.error("Registration Failed Please Try Again");
                    setLoading(false);
                }
            }


        },
    });

    const SendOTP = async() => {
        try {
            setLoading(true);
            const response = await APICALL("post", "/api/auth/send-otp", { mobile: Formik.values.mobile })
            const res = response?.data;
            if (res?.status === "success") {
                toast.success(res?.message)
                setLoading(false)
                setStep(step + 1)
            }
            if (res?.status === "failed") {
                toast.error(res?.message)
                setLoading(false)
            }
            setLoading(false)

        } catch (error) {
            setLoading(false)
            toast.error("Unable to send OTP, Please Try Again");
        }
    }

    useEffect(() => {
        if (Formik.values.sapa) {
            Formik.setFieldValue("officeAddress", Formik.values.pAddress)
        } else {
            Formik.setFieldValue("officeAddress", "")
        }
    }, [Formik.values.sapa])

    return (
        <>
            <div className="container row m-auto my-2">
                <div className="m-auto">
                    <div className="card-body p-2 shadow">
                        <div className="text-end">
                            Step : {step} of {totalSteps} <i className='fa fa-arrow-left mx-2 text-secondary' /><i className='fa fa-arrow-right' />
                        </div>
                    </div>
                </div>
            </div>
            <form onSubmit={Formik.handleSubmit}>
                <div className="container row m-auto ">
                    <div className="m-auto">
                        <div className="card-body p-4 shadow">
                            <div>
                                <h2 className="fs-5 bg-warning p-2 rounded mt-2 fw-bold">Profile details</h2>

                                {
                                    step === 1 &&
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
                                            <label htmlFor="email" className="form-label">
                                                Email Id (Optional)
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="email"
                                                name="email"
                                                value={Formik.values.email}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}

                                            />
                                            {
                                                Formik.touched.email && Formik.errors.email &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.email}
                                                </div>
                                            }

                                        </div>
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="scpID" className="form-label">
                                                SCP ID Number
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="scpID"
                                                name="scpID"
                                                value={Formik.values.scpID}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}

                                            />
                                            {
                                                Formik.touched.scpID && Formik.errors.scpID &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.scpID}
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="choosePassword" className="form-label">
                                                Choose Password
                                            </label>

                                            <input
                                                type="password"
                                                className="form-control"
                                                id="choosePassword"
                                                name="password"
                                                value={Formik.values.password}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                            />
                                            {
                                                Formik.touched.password && Formik.errors.password &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.password}
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="confirmPassword" className="form-label">
                                                Confirm Password
                                            </label>

                                            <input
                                                type="password"
                                                className="form-control"
                                                id="confirmPassword"
                                                name="cPassword"
                                                value={Formik.values.cPassword}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}

                                            />
                                            {
                                                Formik.touched.cPassword && Formik.errors.cPassword &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.cPassword}
                                                </div>
                                            }
                                        </div>


                                    </div>
                                }

                                {
                                    step === 2 &&

                                    <div className="row">
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="state" className="form-label">
                                                Select State
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
                                                Select District
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
                                            <label htmlFor="pAddress" className="form-label">
                                                Enter Permanant address
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="pAddress"
                                                name="pAddress"
                                                value={Formik.values.pAddress}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                            />
                                            {
                                                Formik.touched.pAddress && Formik.errors.pAddress &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.pAddress}
                                                </div>
                                            }


                                        </div>
                                        <div className="mb-3 col-lg-6">
                                            <label htmlFor="landMark" className="form-label">
                                                Land Mark (Optional)
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="landMark"
                                                name="landMark"
                                                value={Formik.values.landMark}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}

                                            />
                                            {
                                                Formik.touched.landMark && Formik.errors.landMark &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.landMark}
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-3 col-lg-12">
                                            <label htmlFor="officeAddress" className="form-label">
                                                Enter Office Address
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                id="officeAddress"
                                                name="officeAddress"
                                                value={Formik.values.officeAddress}
                                                onChange={Formik.handleChange}
                                                onBlur={Formik.handleBlur}
                                            />
                                            {
                                                Formik.touched.officeAddress && Formik.errors.officeAddress &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.officeAddress}
                                                </div>
                                            }
                                            <div className="mb-3 form-check">
                                                <input type="checkbox" name="sapa" onChange={Formik.handleChange} className="form-check-input" id="exampleCheck1" />
                                                <label className="form-check-label small" htmlFor="exampleCheck1">
                                                    Same as Permanant Address
                                                </label>
                                            </div>
                                        </div>
                                        <div className="mb-3 col-lg-12">
                                            <label htmlFor="scpCertificate" className="form-label">
                                                Upload SCP Certificate
                                            </label>

                                            <input
                                                type="file"
                                                className="form-control"
                                                id="scpCertificate"
                                                name="scpCertificate"
                                                accept="image/*"
                                                onChange={(e) => Formik.setFieldValue("scpCertificate", e.target.files[0])}
                                            />
                                            {
                                                Formik.touched.scpCertificate && Formik.errors.scpCertificate &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.scpCertificate}
                                                </div>
                                            }
                                        </div>
                                        <div className="mb-3 col-lg-12">
                                            <label htmlFor="officePhoto" className="form-label">
                                                Upload a photo of your Office
                                            </label>

                                            <input
                                                type="file"
                                                className="form-control"
                                                id="officePhoto"
                                                name="officePhoto"
                                                accept="image/*"
                                                onChange={(e) => Formik.setFieldValue("officePhoto", e.target.files[0])}

                                            />
                                            {
                                                Formik.touched.officePhoto && Formik.errors.officePhoto &&
                                                <div className="form-text text-danger">
                                                    {Formik.errors.officePhoto}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                }
                                {
                                    step === 3 && (

                                        <div className="row justify-content-center">
                                            <div className="col-lg-12">
                                                <div className="text-center">
                                                    <h5 className="text-dark">We will send OTP on your registered mobile number</h5>
                                                    <h5 className="text-success fs-6">Your registered mobile Number is {Formik.values.mobile.slice(0, 4) + "XXXXXX"}</h5>

                                                </div>
                                            </div>
                                            <div className="mb-3 col-lg-4 text-center">
                                                <label htmlFor="otp" className="form-label">
                                                    Enter OTP
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="otp"
                                                    name="otp"
                                                    value={Formik.values.otp}
                                                    onChange={Formik.handleChange}
                                                    onBlur={Formik.handleBlur}
                                                />
                                                {
                                                    Formik.touched.otp && Formik.errors.otp &&
                                                    <div className="form-text text-danger">
                                                        {Formik.errors.otp}
                                                    </div>
                                                }
                                            </div>
                                        </div>

                                    )
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