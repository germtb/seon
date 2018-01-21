const safeguard = value => {
	if (value === null || value === undefined || isNaN(value)) {
		return {
			type: 'Nothing'
		}
	} else if (typeof value === 'function') {
		return args => {
			try {
				return safeguard(value(args))
			} catch (e) {
				return {
					type: 'Nothing'
				}
			}
		}
	} else {
		return {
			type: 'Just',
			value
		}
	}
}
