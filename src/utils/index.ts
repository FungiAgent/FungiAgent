export const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  export const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // alert('Copied to clipboard');
  };
  