import { ReportProvider } from '@interfaces';

class ReportRegistry {
	private providers: Map<string, ReportProvider> = new Map();

	register(reportId: string, provider: ReportProvider) {
		this.providers.set(reportId, provider);
	}

	getProvider(reportId: string): ReportProvider | undefined {
		return this.providers.get(reportId);
	}

	getAllRegistered(): string[] {
		return Array.from(this.providers.keys());
	}

	getCatalog() {
		return Array.from(this.providers.entries()).map(([id, provider]) => ({
			reportId: id,
			moduleId: provider.moduleId
		}));
	}
}

export const reportRegistry = new ReportRegistry();
