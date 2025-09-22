namespace Iit.Fibertest.Graph
{
    [Serializable]
    public class TraceRemoved
    {
        public Guid TraceId { get; set; }
        public List<Guid> NodeIds { get; set; } = null!;
        public List<Guid> FiberIds { get; set; } = null!;
    }
}