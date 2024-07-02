namespace Fibertest30.Infrastructure.Device;

public interface IOcmSerialPort
{
    public Task WriteExactly(byte[] buffer);

    public Task ReadExactly(byte[] buffer, int offset, int count); 
}