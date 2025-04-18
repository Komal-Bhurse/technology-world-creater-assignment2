import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function index() {
	const [toogle, setToogle] = useState(true);

	return (
		<>
			<div className="container row m-auto vh-100">
				<div className="card border-0 col-lg-6 col-md-10 m-auto">
					<div className="card-body p-4 shadow">
						<div className="text-center">
							<img src="/assets/logo.png" alt="logo" className="logo w-25 h-25" />
						</div>
						<div>
							<h2 className="fs-5 text-center mt-2 fw-bold text-success">SCP {toogle?"Login":"Registration"} </h2>
						</div>
						{
							toogle ?
								<SignIn toogle={toogle} setToogle={setToogle} />
								:
								<SignUp toogle={toogle} setToogle={setToogle} />
						}
					</div>
				</div>
			</div>
		</>
	);
}
