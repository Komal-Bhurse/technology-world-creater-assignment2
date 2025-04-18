import React, { useEffect, useState } from "react";
import "./dashboard.css"; // Include any necessary custom styles
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function index() {
	const { user } = useSelector((state) => state.user);

	const [isOpen, setIsOpen] = useState(true);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	// useEffect(() => {
	// 	if (!user) {
	// 		window.location.href = "/";
	// 	}

	// 	if (user && user?.UserType !== "Admin") {
	// 		window.location.href = "/";
	// 	}
	// }, []);

	return (
		<>
			<div className="app-container">
				<Header toggleSidebar={toggleSidebar} />
				<div className="main-layout d-flex">
					<Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
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
