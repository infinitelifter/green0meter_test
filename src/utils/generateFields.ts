import { Field } from "../types/form";
import _ from "lodash";

export function generateDefaultValues(fields: Field[][]): {
    [key: string]: string;
} {
    return _.flatMap(fields).reduce((acc: { [key: string]: string }, field) => {
        acc[field.name] = field.defaultValue;
        return acc;
    }, {});
}

export const generateFieldsForAllSteps = (): Field[][] => {
    return _.range(25).map((step) =>
        _.range(100).map((index) => ({
            name: `fieldStep${step}Field${index}`,
            label: `Field ${step * 100 + index + 1}`,
            defaultValue: "",
        }))
    );
};
