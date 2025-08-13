using Iit.Fibertest.Graph;

namespace Fibertest30.Api;

public static class ReportsMapping
{
    public static UserActionLine ToProto(this LogLine logLine)
    {
        return new UserActionLine()
        {
            Ordinal = logLine.Ordinal,
            Username = logLine.Username,
            ClientIp = logLine.ClientIp ?? "",
            RegisteredAt = logLine.Timestamp.ToUniversalTime().ToTimestamp(),
            LogOperationCode = (int)logLine.OperationCode,
            RtuTitle = logLine.RtuTitle ?? "",
            TraceTitle = logLine.TraceTitle ?? "",
            OperationParams = logLine.OperationParams ?? ""
        };
    }
}
