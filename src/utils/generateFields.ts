import { Field } from "../types/form";

export function generateDefaultValues(fields: Field[][]): {
    [key: string]: string;
} {
    const allFields = fields.flat();
    return allFields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }, {} as { [key: string]: string });
}

export const generateFieldsForAllSteps = (): Field[][] => {
    return Array.from({ length: 25 }, (_, step) =>
        Array.from({ length: 100 }, (_, index) => ({
            name: `fieldStep${step}Field${index}`,
            label: `Field ${step * 100 + index + 1}`,
            defaultValue: "",
        }))
    );
};
