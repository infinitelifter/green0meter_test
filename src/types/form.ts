export interface Field {
    name: string;
    label: string;
    defaultValue: string;
}

export interface FormData {
    fields: {
        [key: string]: {
            value: string;
            error?: string;
        };
    };
}
