export const stringUtils = {

	maskEmail(email: string): string {
		const [localPart, domain] = email.split('@');
		const maskedLocal = localPart.charAt(0) + localPart.charAt(1) + '*'.repeat(localPart.length - 2);
		const [domainName, tld] = domain.split('.');
		const maskedDomain = domainName.charAt(0) + domainName.charAt(1) + '*'.repeat(domainName.length - 2);
		return `${maskedLocal}@${maskedDomain}.${tld}`;
	},

	truncate(text: string, length: number): string {
		return text.length > length ? text.substring(0, length) + '...' : text;
	},

	logSeparator(): string {
		return '\n___________________\n'
	}
}