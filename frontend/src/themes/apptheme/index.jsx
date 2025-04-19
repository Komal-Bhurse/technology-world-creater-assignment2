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
		if (pathname === "/" && user && user?.userType === "SCP") {
			window.location.href = "/scp/dashboard";
		}

		if (pathname === "/scp/dashboard" && !user && user?.userType !== "SCP") {
			window.location.href = "/";
		}

	}, [pathname,user?.userType]);

	return (
		<>
			<div className="app-container">
				<Header toggleSidebar={toggleSidebar} />
				<div className="main-layout d-flex">
					{
						user && user?.UserType === "SCP" ? (
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
