// Validate deals array
const isDealValid = (deal) => {
    return deal.storeID !== null && deal.storeID !== "" && deal.price !== null && deal.price !== "";
};

const isNumerical = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

const hasUniqueStoreIDs = (deals) => {
    const storeIDSet = new Set();
    for (const deal of deals) {
        if (storeIDSet.has(deal.storeID)) {
            return false;
        }
        storeIDSet.add(deal.storeID);
    }
    return true;
};

const validateDealAttributes = (deals) => {
    deals.forEach(deal => {
        if (!isDealValid(deal)) {
            throw new Error("Each deal must have a non-null storeID and price.");
        }
        if (!isNumerical(deal.price)) {
            throw new Error(`Price must be a numerical value. Invalid value: ${deal.price}`);
        }
    });
};

const validateCheapestPrice = (cheapestPrice) => {
    if (!isNumerical(cheapestPrice)) {
        throw new Error(`CheapestPrice must be a numerical value. Invalid value: ${cheapestPrice}`);
    }
};

const validateDeals = (deals) => {
    if (!Array.isArray(deals) || deals.length === 0) {
        throw new Error("Deals array cannot be empty.");
    }

    validateDealAttributes(deals);

    if (!hasUniqueStoreIDs(deals)) {
        throw new Error("Duplicate storeID found.");
    }

    return deals.map(deal => ({
        storeID: deal.storeID,
        price: deal.price
    }));
};

// Validate game attributes
const validateGameAttributes = (game) => {
    const requiredAttributes = ['title', 'cheapestPrice', 'deals'];
    const invalidAttributes = requiredAttributes.filter(attr => isAttributeInvalid(game, attr));
    
    validateCheapestPrice(game.cheapestPrice);

    if (invalidAttributes.length > 0) {
        throw new Error(`Missing or empty required attributes: ${invalidAttributes.join(', ')}`);
    }
};

const isAttributeInvalid = (game, attr) => {
    // Custom validation logic for each attribute
    switch (attr) {
        case 'title':
        case 'cheapestPrice':
        case 'deals':
            return !game[attr] || game[attr] === null || game[attr] === '';
        default:
            return false;
    }
};

module.exports = {
    validateDeals,
    validateGameAttributes
};