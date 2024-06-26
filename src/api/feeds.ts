import client from "./client";
const endpoint = "/api/feeds";

const getPortfolio = ({ account }: { account: string }) =>
    client.get(`${endpoint}/portfolio/${account}`);

const getCashBalance = ({ account }: { account: string }) =>
    client.get(`${endpoint}/cash-balance/${account}`);

const portfolioApi = {
    getPortfolio,
    getCashBalance,
};
export default portfolioApi;
