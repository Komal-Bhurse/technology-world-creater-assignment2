import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Link, useNavigate } from 'react-router-dom'
import { APICALL } from '@/hooks/useApiCall.js'
import { useDispatch } from "react-redux";
import { login } from '@/redux/userSlice'

const initialSignUpValues = {
	mobile: "",
	password: "",
};

const UserSignUpSchema = Yup.object().shape({
	mobile:Yup.string().min(10).max(10).required("Please enter Mobile number"),
	password: Yup.string()
		.required("Please enter password"),
});

export default function SignIn({ setToogle }) {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [loading, setLoading] = useState(false);

	const Formik = useFormik({
		initialValues: initialSignUpValues,
		validationSchema: UserSignUpSchema,
		onSubmit: async (values, { resetForm }) => {
			try {
				setLoading(true);
				const resp = await APICALL("post", "/api/auth/login", values)
				

				if(resp?.status === 404){
					setLoading(false)
					return toast.error(resp?.response?.data?.message)
				}
		        const res = resp?.data
			
				if (res?.status === "success") {
					toast.success(res?.message)
					resetForm()
					setLoading(false)
					dispatch(login(res?.data))
					navigate("/scp/dashboard")
				} 
				if (res?.message === "faild") {
					toast.error(res?.message)
					setLoading(false)
				} 
		
			} catch (error) {
				toast.error(res?.message);
				setLoading(false);
			}
		},
	});

	return (
		<>
		
			<form className=" row m-auto" onSubmit={Formik.handleSubmit} autoComplete={"off"}>
				<>
					{/* Email Field */}
					<div className="form-floating bg-transparent  mb-0">
						<input type="text" className="form-control bg-transparent shadow-none border-0 border-bottom" id="mobile" placeholder="Email" name="mobile" onChange={Formik.handleChange} onBlur={Formik.handleBlur} value={Formik.values.mobile} />
						<label htmlFor="mobile" className="bg-transparent">Mobile</label>
						{Formik.touched.mobile && Formik.errors.mobile ? <p className="text-danger">{Formik.errors.mobile}</p> : null}
					</div>
					{/* Password Field */}
					<div className="form-floating bg-transparent mb-3">
						<input type="password" className="form-control bg-transparent shadow-none border-0 border-bottom" id="password" placeholder="Password" name="password" onChange={Formik.handleChange} onBlur={Formik.handleBlur} value={Formik.values.password} />
						<label htmlFor="password" className="bg-transparent">Password</label>
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
							Login
						</button>
					)}

				</div>
			</form>
		</>
	);
}
