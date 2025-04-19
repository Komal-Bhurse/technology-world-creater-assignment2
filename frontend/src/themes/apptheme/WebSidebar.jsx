import { Link , useLocation} from "react-router-dom";

const WebSidebar = ({ isOpen, toggleSidebar }) => {
	const {pathname} = useLocation()
	const width = window.innerWidth;

	const closeSidebar = () => {
		if (width < 769) {
			toggleSidebar();
		}
	};
	return (
		<div className="sidebar-container">
			{/* WebSidebar Toggle Button */}

			{/* WebSidebar Content */}
			<aside className={`sidebar bg-success text-white shadow-sm ${isOpen ? "open" : "closed p-0"}`}>
				<ul className="nav flex-column">
				<li className="nav-item ">
						<Link to="/admin-panel" onClick={closeSidebar} className={`nav-link  ${isOpen ? "row" : ""}`}>
							<i className="fa fa-arrow-left me-2 col-1"></i> <span className="col-11 ">Back</span>
						</Link>
					</li>
					<hr className="m-0"/>
					<li className="nav-item">
						<Link to="/admin-panel" onClick={closeSidebar} className={`nav-link active  ${isOpen ? "row" : ""}`}>
							<i className="fa fa-info me-2 col-1"></i> <span className="col-11 ">CSC Guide</span>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/" onClick={closeSidebar} className={`nav-link ${pathname === "/" ? "bg-light text-success" : "text-white"} ${isOpen ? "row" : ""}`}>
							<i className="fa fa-user me-2 col-1"></i> <span className="col-11 ">Register as SC Partner</span>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/admin-panel/users" onClick={closeSidebar} className={`nav-link  ${isOpen ? "row" : ""}`}>
							<i className="fa fa-question me-2 col-1 "></i> <span className="col-11 ">FAQs</span>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/admin-panel/user-logs" onClick={closeSidebar} className={`nav-link  ${isOpen ? "row" : ""}`}>
							<i className="fa fa-lock me-2 col-1 "></i> <span className="col-11  ">Privacy Policy</span>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/admin-panel/user-activity" onClick={closeSidebar} className={`nav-link  ${isOpen ? "row" : ""}`}>
							<i className="fa fa-users me-2 col-1"></i> <span className="col-11 ">Help & Support</span>
						</Link>
					</li>
					<li className="nav-item">
						<Link to="/admin-panel/web-blogs" onClick={closeSidebar} className={`nav-link  ${isOpen ? "row" : ""}`}>
							<i className="fa fa-phone me-2 col-1"></i> <span className="col-11 ">Contact Info</span>
						</Link>
					</li>
					
				</ul>
			</aside>
		</div>
	);
};

export default WebSidebar;
