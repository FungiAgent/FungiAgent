const getTokens = () => {
    let account = localStorage.getItem("account");

    return { account };
};

const exports = {
    getTokens,
};
export default exports;
