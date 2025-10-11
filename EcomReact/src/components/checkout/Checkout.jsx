import { Step, StepLabel, Stepper } from "@mui/material";
import React, { useState } from "react";
import AddressInfor from "./AddressInfor";

const Checkout = () => {

    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        "Addtress",
        "Payment Method",
        "Order Summary",
        "Payment"
    ];

    return (
        <div className="py-14 min-h-[calc(100vh-100px)]">
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>

            <div className="mt-5">
                {activeStep === 0 && <AddressInfor/>}
            </div>
        </div>
    )
}

export default Checkout;