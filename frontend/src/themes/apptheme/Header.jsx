import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/userSlice";
import { persistor } from "@/redux/store";

const Header = ({ toggleSidebar }) => {
	const { user } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const Logout = async () => {
		const loading = toast.loading("Logging Out!");
		try {
			const res = await axios.post("/apis/users", { Cmd: "LOGOUT" }, { withCredentials: true });

			if (res.data.status === "success") {
				persistor.purge();
				dispatch(logout(null));
				toast.dismiss(loading);
				toast.success("Logout Successfull!");
				navigate("/");
			}
			if (res.data.status === "failed") {
				toast.dismiss(loading);
				toast.error("Please try again!");
			}
		} catch (error) {
			toast.dismiss(loading);
			toast.error("Please try again!");
		}
	};

	return (
		<header className="header d-flex justify-content-between align-items-center px-4 shadow-sm">
			{/* Left Side Logo and Sidebar Toggle */}
			<div className="d-flex align-items-center">
				<button className="btn btn-light me-3" onClick={toggleSidebar} aria-label="Toggle Sidebar">
					☰
				</button>
				<nav className="navbar navbar-expand-lg navbar-light">
					<a href="/" className="navbar-brand p-0">
						<img src="/assets/logo.png" alt="logo" className="logo w-50 h-50" />
					</a>
				</nav>
			</div>

			{/* Right Side User Info and Dropdown */}
			<div className="user-dropdown dropdown">
				<div className="d-flex align-items-center gap-4" style={{ cursor: "pointer" }}>
					<div className="d-flex flex-column align-items-center justify-content-center">
						<span class=" position-relative">
							<i className="fa fa-envelope text-secondary fs-5" />
							<span class=" p-1 bg-danger rounded-circle" style={{ position: "absolute", top: "2px", right: "-1px" }}>
							</span>
						</span>
						<span className="fw-bold text-secondary">messages</span>
					</div>
					<div className="d-flex flex-column align-items-center justify-content-center">
						<i class=" position-relative">
							<i className="fa fa-bell fs-5 text-secondary" />
							<span class=" p-1 bg-danger rounded-circle" style={{ position: "absolute", top: "2px", right: "-1px" }}>
							</span>
						</i>

						<span className="fw-bold text-secondary">Announcements</span>
					</div>
					<div className="border border-2  row " style={{borderRadius:"10px"}}>
						<div className="col-3">
							<img style={{ width: "60px", height: "60px" }} src="/images/profile-avtar.png" alt="Avatar" className="rounded-circle dropdown-toggle" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" />
						</div>
						<div className=" col-9 py-2 d-flex align-items-center justify-content-between">
							<div>
                               <p className=" m-0 p-0 fw-bold">Login</p>
							   <p className=" m-0 p-0 small text-muted">Login as SC Partner</p>
							</div>
							<div className="bg-success d-flex align-items-center justify-content-center" style={{ color: "white", width:"40px", height:"100%" }}>
                              <i className="fa fa-angle-down fs-2" style={{ color: "white"}}/>
							</div>
						</div>
					</div>
					{/* <img style={{ width: "40px", height: "40px" }} src="/assets/img/profile-avtar.png" alt="Avatar" className="rounded-circle dropdown-toggle" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" /> */}

					<ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
						<li>
							<Link to="/admin-panel/user-profile" className="dropdown-item">
								Profile
							</Link>
						</li>
						<li>
							<span onClick={Logout} className="dropdown-item">
								Logout
							</span>
						</li>
					</ul>
				</div>
			</div>
		</header>
	);
};

export default Header;
