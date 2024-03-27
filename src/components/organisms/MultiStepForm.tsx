import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Stepper, Step, StepButton, Button, Box } from "@mui/material";
import { MemoizedTextField } from "../atoms/MemoizedTextField";
import {
    generateDefaultValues,
    generateFieldsForAllSteps,
} from "../../utils/generateFields";
import { postData } from "../../services/postData";

interface FormData {
    [key: string]: string;
}

export const MultiStepForm: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const allFields = generateFieldsForAllSteps();
    const methods = useForm<FormData>({
        defaultValues: generateDefaultValues(allFields),
    });

    const onSubmit = async () => {
        const allValues = methods.getValues();

        let hasError = false;
        let errorStep = 0;

        for (let step = 0; step < allFields.length; step++) {
            for (let field of allFields[step]) {
                if (!allValues[field.name]) {
                    hasError = true;
                    errorStep = step;
                    break;
                }
            }
            if (hasError) {
                break;
            }
        }

        if (!hasError) {
            console.log("Form data:", allValues);

            try {
                const response = await postData(allValues);
                console.log("Form submitted successfully:", response);
            } catch (error) {
                console.error("Form submission error:", error);
            }
        } else {
            setActiveStep(errorStep);
            methods.trigger();
        }
    };

    const fillFormWithTestString = () => {
        const fields = allFields.flat();
        const testStringValues = fields.reduce((acc, field) => {
            // @ts-ignore
            acc[field.name] = "Test string";
            return acc;
        }, {});

        methods.reset(testStringValues);
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
                noValidate
            >
                <Stepper nonLinear activeStep={activeStep} alternativeLabel>
                    {Array.from({ length: 25 }, (_, index) => (
                        <Step key={index}>
                            <StepButton onClick={() => setActiveStep(index)}>
                                Step {index + 1}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
                <Box style={{ maxHeight: "440px", overflowY: "auto" }}>
                    {allFields[activeStep].map((field, index) => (
                        <MemoizedTextField
                            key={`${field.name}`}
                            name={field.name}
                            label={field.label}
                        />
                    ))}
                </Box>
                <Box style={{ marginTop: "20px" }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep(activeStep - 1)}
                    >
                        Back
                    </Button>
                    <Button
                        variant='contained'
                        onClick={() => setActiveStep(activeStep + 1)}
                    >
                        {activeStep === 24 ? "Submit" : "Next"}
                    </Button>
                    <Button variant='contained' type='submit'>
                        Submit
                    </Button>
                    {/* TODO: remove  */}
                    <Button
                        variant='contained'
                        onClick={fillFormWithTestString}
                    >
                        Fill the Form
                    </Button>
                </Box>
            </form>
        </FormProvider>
    );
};
