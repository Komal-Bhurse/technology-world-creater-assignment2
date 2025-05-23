import React, { useEffect, useState } from "react";
import "./dashboard.css"; // Include any necessary custom styles
import SCPSidebar from "./SCPSidebar";
import WebSidebar from "./WebSidebar";
import Header from "./Header";
import Footer from "./Footer";

import { Outlet,useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function index() {
	const { user } = useSelector((state) => state.user);

	const {pathname} = useLocation();

	const [isOpen, setIsOpen] = useState(true);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		if (user?.userType === "SCP" && pathname === "/") {
			window.location.href = "/scp/dashboard";
		}

		if (user?.userType !== "SCP" && pathname === "/scp/dashboard") {
			window.location.href = "/";
		}

	}, [user?.userType]);

	return (
		<>
			<div className="app-container">
				<Header toggleSidebar={toggleSidebar} />
				<div className="main-layout d-flex">
				{/* <SCPSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} /> */}

					{
						user && user?.userType === "SCP" ? (
							<SCPSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
						)
						:(
							<WebSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
						)
					}
					<div className="content flex-grow-1 p-3" style={{ overflowX: "hidden" }}>
						<Outlet />
						<footer className="footer-filler invisible px-4"></footer>
					</div>
				</div>
				<Footer />
			</div>
		</>
	);
}
