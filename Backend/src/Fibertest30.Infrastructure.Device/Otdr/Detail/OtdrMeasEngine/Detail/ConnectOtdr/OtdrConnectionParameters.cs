namespace Fibertest30.Infrastructure.Device.OtdrMeasEngine;

public interface OtdrConnectionParameters { }

public record TcpOtdrConnectionParameters(string Host, int Port) : OtdrConnectionParameters;

public record UsbOtdrConnectionParameters : OtdrConnectionParameters;
