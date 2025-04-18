import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Link, useNavigate } from 'react-router-dom'
import { APICALL } from '@/hooks/useApiCall.js'

import { useDispatch } from "react-redux";
import { login } from '@/redux/userSlice'

const initialSignUpValues = {
	name: "",
	phone: "",
	email: "",
	password: "",
};

const UserSignUpSchema = Yup.object().shape({
	name: Yup.string().required("Please enter name"),
	phone: Yup.string().required("Please enter phone"),
	email: Yup.string().matches(
		/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
		'Invalid email'
	)
		.required("Please enter email"),
	password: Yup.string().min(8, 'Password must be at least 8 characters')
		.matches(/[a-z]/, 'Password must contain at least one lowercase letter')
		.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.matches(/[0-9]/, 'Password must contain at least one number')
		.matches(/[@$!%*?&]/, 'Password must contain at least one special character')
		.required("Please enter password"),
});

export default function SignUp({ setToogle }) {

	const [loading, setLoading] = useState(false);
	
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const Formik = useFormik({
		initialValues: initialSignUpValues,
		validationSchema: UserSignUpSchema,
		onSubmit: async (values, { resetForm }) => {
			try {
				setLoading(true);
				const response = await APICALL("post", "/api/auth/register", values)
				const res = response?.data;
				console.log(res)
				if (res?.message === "success") {
					toast.success("Register successfull")
					resetForm()
					setLoading(false)
					dispatch(login(res?.data))
					navigate("/scp/dashboard")
				}else{
					toast.error(res?.error)
					setLoading(false)
				}
			} catch (error) {
				toast.error("Signup Failed Please Try Again");
				setLoading(false);
			}
		},
	});

	return (
		<>
		
			<form className=" row m-auto" onSubmit={Formik.handleSubmit} autoComplete={"off"}>
				<>
					{/* First Name Field */}
					<div className="form-floating mb-0 col-md-6">
						<input type="text" className="form-control shadow-none border-0 border-bottom" id="name" placeholder="First Name" name="name" onChange={Formik.handleChange} onBlur={Formik.handleBlur} value={Formik.values.name} />
						<label htmlFor="name">Name</label>
						{Formik.touched.name && Formik.errors.name ? <p className="text-danger">{Formik.errors.name}</p> : null}
					</div>
					{/* Last Name Field */}
					<div className="form-floating mb-0 col-md-6">
						<input type="text" className="form-control shadow-none border-0 border-bottom" id="phone" placeholder="Last Name" name="phone" onChange={Formik.handleChange} onBlur={Formik.handleBlur} value={Formik.values.phone} />
						<label htmlFor="phone">Phone</label>
						{Formik.touched.phone && Formik.errors.phone ? <p className="text-danger">{Formik.errors.phone}</p> : null}
					</div>
					{/* Email Field */}
					<div className="form-floating  mb-0">
						<input type="email" className="form-control shadow-none border-0 border-bottom" id="email" placeholder="Email" name="email" onChange={Formik.handleChange} onBlur={Formik.handleBlur} value={Formik.values.email} />
						<label htmlFor="email">Email</label>
						{Formik.touched.email && Formik.errors.email ? <p className="text-danger">{Formik.errors.email}</p> : null}
					</div>
					{/* Password Field */}
					<div className="form-floating mb-3">
						<input type="password" className="form-control shadow-none border-0 border-bottom" id="password" placeholder="Password" name="password" onChange={Formik.handleChange} onBlur={Formik.handleBlur} value={Formik.values.password} />
						<label htmlFor="password">Password</label>
						{Formik.touched.password && Formik.errors.password ? <p className="text-danger">{Formik.errors.password}</p> : null}
					</div>
				</>

				{/* Submit Button */}
				<div className="text-center">
					{loading ? (
						<button type="button" id="btn_submit_add_courses" className="btn mb-2 px-4 fs-6 btn-sm rounded-pill btn-primary mx-2">
							<div className="spinner-border spinner-border-sm" role="status"></div>
						</button>
					) : (
						<button type="submit" id="btn_submit_add_courses" className="btn mb-2 px-4 fs-6 btn-sm rounded-pill btn-outline-primary mx-2">
							Register
						</button>
					)}
					<p className=" d-flex align-items-center justify-content-center gap-2"><span>Already have an account?</span> <Link onClick={()=>setToogle(true)} to={"/"} className="">Login</Link></p>
				</div>
			</form>
		</>
	);
}
