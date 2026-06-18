export const parseValue = (value) => {
    const numeric = String(value).replace(/[^0-9.,]/g, '').replace(',', '.');
    return parseFloat(numeric);
};