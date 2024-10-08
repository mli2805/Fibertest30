﻿namespace Iit.Fibertest.Graph
{
    [Serializable]
    public class LogLine
    {
        public int Ordinal { get; set; }
        public string Username { get; set; } = null!;
        public string ClientIp { get; set; } = null!;
        public DateTime Timestamp { get; set; }
        public LogOperationCode OperationCode { get; set; }
        public string OperationName => OperationCode.GetLocalizedString();
        public string RtuTitle { get; set; }
        public string TraceTitle { get; set; }
        public string OperationParams { get; set; }
    }
}