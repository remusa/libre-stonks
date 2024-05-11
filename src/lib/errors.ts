export function handleEndpointError(error: unknown) {
	if (error instanceof SyntaxError) {
		// Unexpected token < in JSON
		console.log('There was a SyntaxError', error)
	} else {
		console.log('There was an error', error)
	}
}
