import { create } from "apisauce";
import authStorage from "./storage";

const apiClient = create({
    baseURL: "http://localhost:4000/",
});

apiClient.addAsyncRequestTransform(async (request) => {
    const { account } = await authStorage.getTokens();
    if (!account) return;
    // @ts-expect-error
    request.headers["account"] = account;
});

export default apiClient;
