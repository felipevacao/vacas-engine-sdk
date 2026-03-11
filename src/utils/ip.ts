// utils/ip.util.ts
import { Request } from 'express';

export function getClientIP(req: Request): string {
  // Lista de headers possíveis (em ordem de prioridade)
	const possibleHeaders = [
		'x-forwarded-for',
		'x-real-ip',
		'cf-connecting-ip',      // Cloudflare
		'true-client-ip',         // Akamai
		'x-cluster-client-ip',    // Load balancers
		'forwarded',
		'x-original-forwarded-for'
	];

	// Procura nos headers
	for (const header of possibleHeaders) {
		const value = req.headers[header];
		if (value) {
			// X-Forwarded-For pode ser string ou string[]
			if (Array.isArray(value)) {
				return value[0].split(',')[0].trim();
			}
			return value.split(',')[0].trim();
		}
	}

	// Fallback: IP direto da conexão
	return req.ip || 
		req.socket?.remoteAddress || 
		req.connection?.remoteAddress || 
		'127.0.0.1';
}