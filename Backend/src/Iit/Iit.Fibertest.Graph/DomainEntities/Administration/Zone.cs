namespace Iit.Fibertest.Graph
{
    [Serializable]
    public class Zone
    {
        public Guid ZoneId { get; set; }
        public bool IsDefaultZone { get; set; }

        public string Title { get; set; } = null!;
        public string Comment { get; set; } = null!;

        public override string ToString()
        {
            return Title;
        }
    }
}