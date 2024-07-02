namespace Fibertest30.Application;

public interface ILinkmapGenerator
{
    Task<byte[]> GenerateLinkmap(List<byte[]> sors, double? macrobendThreshold);
}