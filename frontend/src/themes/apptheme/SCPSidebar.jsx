import { Link , useLocation, useNavigate} from "react-router-dom";

const SCPSidebar = ({ isOpen, toggleSidebar }) => {
	const {pathname} = useLocation()
	const navigate = useNavigate();
	const width = window.innerWidth;

	const closeSidebar = () => {
		if (width < 769) {
			toggleSidebar();
		}
	};
	return (
		<div className="sidebar-container">
			{/* SCPSidebar Toggle Button */}

			{/* SCPSidebar Content */}
			<aside className={`sidebar bg-success text-white shadow-sm ${isOpen ? "open" : "closed p-0"}`}>
				<ul className="nav flex-column">
				<li className="nav-item ">
						<Link to={() => navigate(-1)} onClick={closeSidebar} className={`nav-link  ${isOpen ? "row" : ""}`}>
							<i className="fa fa-arrow-left me-2 col-1"></i> <span className="col-11 ">Back</span>
						</Link>
					</li>
					<hr className="m-0"/>
					<li className="nav-item">
						<Link to="/scp/dashboard" onClick={closeSidebar} className={`nav-link active  ${isOpen ? "row" : ""}`}>
							<i className="fa fa-info me-2 col-1"></i> <span className="col-11 ">Dashboard</span>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/scp/farmer-registration" onClick={closeSidebar} className={`nav-link ${pathname === "/" ? "bg-light text-success" : "text-white"} ${isOpen ? "row" : ""}`}>
							<i className="fa fa-user me-2 col-1"></i> <span className="col-11 ">Farmer Registration</span>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/scp/check-enrollment-status" onClick={closeSidebar} className={`nav-link  ${isOpen ? "row" : ""}`}>
							<i className="fa fa-users me-2 col-1 "></i> <span className="col-11 ">Check Enrollment Status</span>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/scp/faqs" onClick={closeSidebar} className={`nav-link  ${isOpen ? "row" : ""}`}>
							<i className="fa fa-question me-2 col-1 "></i> <span className="col-11  ">FAQs</span>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/scp/privacy-policy" onClick={closeSidebar} className={`nav-link  ${isOpen ? "row" : ""}`}>
							<i className="fa fa-lock me-2 col-1"></i> <span className="col-11 ">Privacy Policy</span>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/scp/raise-ticket" onClick={closeSidebar} className={`nav-link  ${isOpen ? "row" : ""}`}>
							<i className="fa fa-bug me-2 col-1"></i> <span className="col-11 ">Raise a Ticket</span>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/scp/conact-info" onClick={closeSidebar} className={`nav-link  ${isOpen ? "row" : ""}`}>
							<i className="fa fa-phone me-2 col-1"></i> <span className="col-11 ">Contact Info</span>
						</Link>
					</li>
				</ul>
			</aside>
		</div>
	);
};

export default SCPSidebar;
