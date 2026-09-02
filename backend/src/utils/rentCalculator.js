export const calculateLineTotal = (dailyRent, rentalDays) => {
    return Number(dailyRent) * Number(rentalDays);
};

export const calculateCartTotal = (items) => {
    return items.reduce((total, item) => {
        return total + item.lineTotal;
    }, 0);
};

export const calculateDueDate = (rentalDays, startDate = new Date()) => {
    const dueDate = new Date(startDate);

    dueDate.setDate(dueDate.getDate() + Number(rentalDays));

    return dueDate.toISOString();
};
