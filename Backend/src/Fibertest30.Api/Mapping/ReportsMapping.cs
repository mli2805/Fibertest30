using Iit.Fibertest.Graph;

namespace Fibertest30.Api;

public static class ReportsMapping
{
    public static UserActionLine ToProto(this Application.UserActionLine line)
    {
        return new UserActionLine()
        {
            Ordinal = line.Ordinal,
            Username = line.Username,
            ClientIp = line.ClientIp ?? "",
            RegisteredAt = line.Timestamp.ToUniversalTime().ToTimestamp(),
            LogOperationCode = (int)line.OperationCode,
            RtuTitle = line.RtuTitle ?? "",
            TraceTitle = line.TraceTitle ?? "",
            OperationParams = line.OperationParams ?? "",
            UserFullName = line.UserFullName
        };
    }
}
