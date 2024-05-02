export const generateQueryFromPortfolio = (tokens: any[]) => {
    // Filter out tokens with 0 balance and convert the rest to their USD equivalents
    const tokensWithNonZeroBalance = tokens
        .filter(token => token.balance > 0) // Assuming 'balance' is directly usable; adjust if it's in a different format
        .map(token => {
            const balanceUSD = (token.balance / Math.pow(10, token.decimals)) * token.priceUSD;
            return `${token.symbol} in USD: $${balanceUSD.toFixed(2)} USD | ${token.symbol} raw balance: ${token.balance} | Address: ${token.address}`;
        });
    
    return tokensWithNonZeroBalance.join('\n');
};