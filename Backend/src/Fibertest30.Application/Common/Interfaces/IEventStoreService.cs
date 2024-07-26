namespace Fibertest30.Application;
public interface IEventStoreService
{
    Task InitializeBothDbAndService();
    Task<int> SendCommands(List<object> cmds, string? username, string clientIp);
    Task<string?> SendCommand(object cmd, string? username, string clientIp);
}
