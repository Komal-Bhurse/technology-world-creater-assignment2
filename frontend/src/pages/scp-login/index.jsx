import React, { useState } from "react";
import SignIn from "./SignIn";

export default function index() {
    const [toogle, setToogle] = useState(true);

    return (
        <>
            <div className="container row m-auto max-h-100 py-5">
                <div className="border-0 col-lg-6 col-md-10 m-auto">
                    <div className="card-body p-4">
                        <div>
                            <h2 className="fs-5 text-center mt-2 fw-bold text-success">SCP {toogle?"Login":"Registration"} </h2>
                        </div>
                                <SignIn toogle={toogle} setToogle={setToogle} />                                
                    </div>
                </div>
            </div>
        </>
    );
}
