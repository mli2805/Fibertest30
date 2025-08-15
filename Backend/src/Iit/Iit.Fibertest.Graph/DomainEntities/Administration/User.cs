using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph
{
    [Serializable]
    public class User
    {
        public Guid UserId { get; set; }
        public string Title { get; set; } = null!;
        public string EncodedPassword { get; set; }
        public string? MachineKey { get; set; }
        public EmailReceiver Email { get; set; }
        public SmsReceiver Sms { get; set; }
        public Role Role { get; set; }
        public Guid ZoneId { get; set; }

        public bool IsDefaultZoneUser => ZoneId == Guid.Empty;
    }
}
