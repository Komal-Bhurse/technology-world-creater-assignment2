import React, { useState, useRef } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const UserSignUpSchema = Yup.object().shape({
	name: Yup.string().required("Please enter  name"),
	phone: Yup.string().required("Please enter phone"),
	village: Yup.string().required("Please enter village"),
	cropType: Yup.string().required("Please enter crop type"),
});

export default function index() {
  const {user} = useSelector(state=>state.user)
	const [toogle, setToogle] = useState(false);
	const [action, setAction] = useState("");
    const [isEdit,setIsEdit] = useState(false)
	const [users, setUsers] = useState([]);
	const [editUser, setEditUser] = useState({});
	const [loading, setLoading] = useState(false);
	const [addLoading, setAddLoading] = useState(false);
	const [editloading, setEditloading] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [error, setError] = useState(null);
	const closeRef = useRef(null);

	console.log("user",user);

	const getAllUsers = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`/api/user/getall`, { withCredentials: true });
			const res = response?.data;
			console.log(res);
			if (res?.message === "success") {
				setUsers([...res.data]);
				setLoading(false);
			} else {
				setUsers([]);
				setLoading(false);
				setError(res.error);
			}
		} catch (error) {
			setLoading(false);
			setError(error.toString());
		}
	};

	const handleEdit = (user) => {
    setIsEdit(true)
		setAction("edit");
		setEditUser(user);
	};

	const handleDelete = async (id) => {
		setDeleteLoading(true);
		try {
			const response = await axios.delete(`/api/user/${id}`, { withCredentials: true });
			const res = response?.data;
			if (res?.message === "success") {
				setToogle((prev) => !prev);
				toast.success("User Deleted");
				setDeleteLoading(false);
			} else {
				toast.error(res?.error);
				setDeleteLoading(false);
			}
		} catch (error) {
			toast.error(res?.error.toString());
			setDeleteLoading(false);
		}
	};

	const handleFormSubmit = async (values, resetForm) => {
		try {
			if (action === "edit") {
        delete values.cropType
        delete values.isEdit
       
				setEditloading(true);
				const response = await axios.put(`/api/user/${editUser._id}`, values, { withCredentials: true });

				const res = response?.data;
        
				if (res?.message === "success") {
					toast.success("User Updated");
					setToogle((prev) => !prev);
					handleClose();
					setEditloading(false);
				} else {
					toast.error(res?.error);
					setEditloading(false);
				}
			} else {
       
        values.addedBy = user ? user?._id : ""
				setAddLoading(true);
				const response = await axios.post("/api/user", values, { withCredentials: true });
        
				const res = response?.data;

				if (res?.message === "success") {
					toast.success("User Added");
					resetForm();
					setToogle((prev) => !prev);
					handleClose();
					setAddLoading(false);
				} else {
					toast.error(res?.error);
					setAddLoading(false);
				}
			}
		} catch (error) {
      console.log("error",error)
			if (action === "edit") {
        const err = error?.response?.data?.error
        if(err){
          toast.error(err);
        }else{
          toast.error(error);
        }
				setEditloading(false);
				
			} else {
        const err = error?.response?.data?.error
        if(err){
          toast.error(err);
        }else{
          toast.error(error);
        }
				setAddLoading(false);
			}
		}
	};

	const handleClose = () => {
		setAction("");
		setEditUser({});
		closeRef && closeRef.current.click();
	};

	const Form = useFormik({
		enableReinitialize: true,
		initialValues: {
			name: editUser.name || "",
			phone: editUser.phone || "",
			village: editUser.village || "",
            cropType: editUser.cropType || "",
     
		},
		validationSchema: UserSignUpSchema,
		onSubmit: (values, { resetForm }) => {
			handleFormSubmit(values, resetForm);
		},
	});

	useEffect(() => {
		getAllUsers();
	}, [toogle]);

	return (
		<>
			<div className="d-flex align-items-center justify-content-between">
				<p></p>
				<h2 className="text-center fs-5">Farmer Management</h2>
				<button
					onClick={() => {
                        setIsEdit(false)
						setAction("");
						setEditUser({});
					}}
					className="btn btn-primary btn-sm text-end"
					data-bs-toggle="modal"
					data-bs-target="#editModal">
					<i className="fa fa-plus" /> Add
				</button>
			</div>
			{/* Table */}
			<table className="table table-bordere">
				<thead>
					<tr>
						<th>Name</th>
						<th>Phone</th>
						<th>Village</th>
						<th>Crop Type</th>
						<th className="text-center">Action</th>
					</tr>
				</thead>
				<tbody>
					{loading ? <tr className="text-center">
							<td colSpan={5} className="border-0 py-4">
              <button type="button" id="btn_submit_add_courses" className="btn mb-2  btn-sm bg-transparent rounded-pill">
											<div className="spinner-border spinner-border" role="status"></div>
										</button>
							</td>
						</tr>:users && users?.length > 0 ? (
						users?.map((item) => {
							return (
								<tr key={item?._id}>
									<td>{item?.name}</td>
									<td>{item?.phone}</td>
									<td>{item?.village}</td>
									<td>{item?.cropType ? item?.cropType : "*******"}</td>
									<td className="d-flex align-items-center justify-content-center gap-2">
										<button onClick={() => handleEdit(item)} className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editModal">
											<i className="fa fa-edit" />
										</button>

										{deleteLoading ? (
											<button className="btn btn-danger btn-sm">
												<div className="spinner-border spinner-border-sm" role="status"></div>
											</button>
										) : (
											<button
												onClick={() => {
													handleDelete(item?._id);
												}}
												className="btn btn-danger btn-sm">
												<i className="fa fa-trash" />
											</button>
										)}
									</td>
								</tr>
							);
						})
					) : (
						<tr className="text-center">
							<td colSpan={5} className="border-0 py-4">
								No Farmers Found!
							</td>
						</tr>
					)}
				</tbody>
			</table>
			{/* Modal for Edit Form */}
			<div className="modal fade" id="editModal" tabIndex={-1} aria-labelledby="editModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="editModalLabel">
								{isEdit ? "Edit Farmer" : "Add Farmer"}
							</h5>
							<button ref={closeRef} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
						</div>
						<div className="modal-body row justify-content-center">
							{/* Edit Form */}
							<form onSubmit={Form.handleSubmit} className="row" autoComplete={"off"}>
								{/* First Name Field */}
								<div className="form-floating mb-0 col-md-6">
									<input type="text" className="form-control shadow-none border-0 border-bottom" id="name" placeholder="First Name" name="name" onChange={Form.handleChange} onBlur={Form.handleBlur} value={Form.values.name} />
									<label htmlFor="name">Name</label>
									{Form.touched.name && Form.errors.name ? <p className="text-danger">{Form.errors.name}</p> : null}
								</div>
								{/* Last Name Field */}
								<div className="form-floating mb-0 col-md-6">
									<input type="text" className="form-control shadow-none border-0 border-bottom" id="phone" placeholder="Last Name" name="phone" onChange={Form.handleChange} onBlur={Form.handleBlur} value={Form.values.phone} />
									<label htmlFor="phone">Phone</label>
									{Form.touched.phone && Form.errors.phone ? <p className="text-danger">{Form.errors.phone}</p> : null}
								</div>
								{/* Email Field */}
								<div className="form-floating  mb-0">
									<input type="text" className="form-control shadow-none border-0 border-bottom" id="village" placeholder="Email" name="village" onChange={Form.handleChange} onBlur={Form.handleBlur} value={Form.values.village} />
									<label htmlFor="village">Village</label>
									{Form.touched.village && Form.errors.village ? <p className="text-danger">{Form.errors.village}</p> : null}
								</div>

								{/* Password Field */}
								{action !== "edit" ? (
									<div className="form-floating mb-3">
										<input type="text" className="form-control shadow-none border-0 border-bottom" id="cropType" placeholder="Password" name="cropType" onChange={Form.handleChange} onBlur={Form.handleBlur} value={Form.values.cropType} />
										<label htmlFor="cropType">Crop Type</label>
										{Form.touched.cropType && Form.errors.cropType ? <p className="text-danger">{Form.errors.cropType}</p> : null}
									</div>
								) : null}

								{/* Submit Button */}
								<div className="text-center mt-2">
									{action === "edit" ? (
										editloading ? (
											<button type="button" id="btn_submit_add_courses" className="btn mb-2 px-4 fs-6 btn-sm rounded-pill btn-primary mx-2">
												<div className="spinner-border spinner-border-sm" role="status"></div>
											</button>
										) : (
											<button type="submit" id="btn_submit_add_courses" className="btn mb-2 px-4 fs-6 btn-sm rounded-pill btn-primary mx-2">
												Update
											</button>
										)
									) : addLoading ? (
										<button type="button" id="btn_submit_add_courses" className="btn mb-2 px-4 fs-6 btn-sm rounded-pill btn-primary mx-2">
											<div className="spinner-border spinner-border-sm" role="status"></div>
										</button>
									) : (
										<button type="submit" id="btn_submit_add_courses" className="btn mb-2 px-4 fs-6 btn-sm rounded-pill btn-primary mx-2">
											add
										</button>
									)}
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
