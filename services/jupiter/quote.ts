export const getQuote = async (inputMint: string, outputMint: string, amount: number) => {
	try {
		// Use Jupiter lite API for quotes
		const response = await fetch(
			`https://lite-api.jup.ag/swap/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50&restrictIntermediateTokens=true`
		);

		if (!response.ok) {
			throw new Error(`Jupiter API error: ${response.statusText}`);
		}

		const quote = await response.json();
		console.log('Jupiter quote response:', JSON.stringify(quote, null, 2));
		
		return quote;
	} catch (error) {
		console.error('Error getting Jupiter quote:', error);
		throw error;
	}
}