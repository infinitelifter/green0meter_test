export const postData = async (data: any) => {
    try {
        const response = await fetch(
            "https://65e86fa34bb72f0a9c4f544a.mockapi.io/forms",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            throw new Error("Network error");
        }

        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
