namespace Fibertest30.Application;

public interface INetworkSettingsProvider
{
    public Task<NetworkSettings> GetNetworkSettings(CancellationToken ct);
    public Task UpdateNetworkSettings(NetworkSettings settings, CancellationToken ct);

}