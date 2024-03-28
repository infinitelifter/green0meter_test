import React, { useCallback, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Stepper, Step, StepButton, Button, Box } from "@mui/material";
import { MemoizedTextField } from "../atoms/MemoizedTextField";
import {
    generateDefaultValues,
    generateFieldsForAllSteps,
} from "../../utils/generateFields";
import { postData } from "../../services/postData";
import _ from "lodash";

export const MultiStepForm: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const allFields = React.useMemo(() => generateFieldsForAllSteps(), []);
    const methods = useForm({
        defaultValues: React.useMemo(
            () => generateDefaultValues(allFields),
            [allFields]
        ),
    });

    const onSubmit = useCallback(async () => {
        const allValues = methods.getValues();
        const errorStep = _.findIndex(allFields, (fields) =>
            _.some(fields, (field) => !allValues[field.name])
        );

        if (errorStep === -1) {
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
    }, [methods, allFields]);

    const doesStepHaveErrors = useCallback(
        (stepIndex: number) => {
            const stepFields = allFields[stepIndex];
            return _.some(stepFields, (field) =>
                _.has(methods.formState.errors, field.name)
            );
        },
        [methods.formState.errors, allFields]
    );

    const handleStepChange = useCallback(
        (step: number) => () => setActiveStep(step),
        []
    );

    const fillFormWithTestString = useCallback(() => {
        const fields = _.flatten(allFields);
        const testStringValues = _.reduce(
            fields,
            (acc: { [key: string]: string }, field) => {
                acc[field.name] = "Test string";
                return acc;
            },
            {}
        );
        methods.reset(testStringValues);
    }, [allFields, methods]);

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
                <Stepper nonLinear activeStep={activeStep} alternativeLabel>
                    {_.times(25, (index) => (
                        <Step
                            key={index}
                            sx={{
                                "& .MuiStepIcon-root": {
                                    color: doesStepHaveErrors(index)
                                        ? "red"
                                        : "",
                                },
                            }}
                        >
                            <StepButton onClick={handleStepChange(index)}>
                                Step {index + 1}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
                <Box style={{ maxHeight: "440px", overflowY: "auto" }}>
                    {_.map(allFields[activeStep], (field) => (
                        <MemoizedTextField key={field.name} {...field} />
                    ))}
                </Box>
                <Box
                    style={{
                        marginTop: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        variant='contained'
                        onClick={fillFormWithTestString}
                        color='secondary'
                    >
                        Fill the Form
                    </Button>
                    <Box>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleStepChange(activeStep - 1)}
                        >
                            Back
                        </Button>
                        <Button
                            variant='contained'
                            onClick={handleStepChange(activeStep + 1)}
                            disabled={activeStep === allFields.length - 1}
                        >
                            Next
                        </Button>
                        <Button
                            variant='contained'
                            type='submit'
                            style={{ marginLeft: "8px" }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </form>
        </FormProvider>
    );
};
