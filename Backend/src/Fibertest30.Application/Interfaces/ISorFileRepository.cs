namespace Fibertest30.Application;
public interface ISorFileRepository
{
    Task<byte[]?> GetSorBytesAsync(int sorFileId);
}
