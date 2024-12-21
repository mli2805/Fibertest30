namespace Fibertest30.Application;

public interface ILogProvider
{
    public Task<List<(byte[], string)>> GetDataCenterLogs(CancellationToken ct);
    public Task<List<(byte[], string)>> GetNginxLogs(CancellationToken ct);
}