import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { ReportExpressAdapter } from '../adapters/report.express.adapter';
import { reportRegistry } from '@services';
import { ResponseHandler } from '@utils';

vi.mock('@services', () => ({
  reportRegistry: {
    getProvider: vi.fn(),
  },
}));

vi.mock('@utils', async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    ResponseHandler: { success: vi.fn() },
    asyncHandler: (fn: any) => fn
  };
});

describe('ReportExpressAdapter', () => {
  let adapter: ReportExpressAdapter<any>;
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    adapter = new ReportExpressAdapter();
    mockReq = { params: { reportId: 'test' }, method: 'POST', body: { filters: {} } };
    mockRes = {};
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  it('should call controller execute and send success response', async () => {
    const mockProvider = { generate: vi.fn().mockResolvedValue({ data: [] }) };
    (reportRegistry.getProvider as Mock).mockReturnValue(mockProvider);

    await adapter.handle(mockReq, mockRes, mockNext);

    expect(mockProvider.generate).toHaveBeenCalled();
    expect(ResponseHandler.success).toHaveBeenCalled();
  });
});
