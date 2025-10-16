namespace Iit.Fibertest.Graph
{
    [Serializable]
    public class BopNetworkEvent : INotificationEvent
    {
        public int Ordinal { get; set; }

        public DateTime EventTimestamp { get; set; }
        public string Serial { get; set; } = null!;
        public string OtauIp { get; set; } = null!;
        public int TcpPort { get; set; }
        public Guid RtuId { get; set; }
        public bool IsOk { get; set; }
    }
}