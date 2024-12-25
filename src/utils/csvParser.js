export const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result;
            const emails = [];
            const rows = text.split('\n');
            rows.forEach(row => {
                const columns = row.split(',');
                columns.forEach(col => {
                    const email = col.trim();
                    if (email) {
                        emails.push(email);
                    }
                });
            });
            resolve(emails);
        };

        reader.onerror = () => {
            reject('Error reading the file');
        };

        reader.readAsText(file);
    });
};
