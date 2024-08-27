namespace Iit.Fibertest.Dto
{
    public class ClientStation
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; } = null!;
        public Role UserRole { get;set; }

        // for desktop clients only
        public string ClientIp { get; set; } = null!;
        public int ClientAddressPort { get; set; }

        // desktop (desktop under superclient) clients put here a GUID produced in WpfClient
        // web clients put here a signalR connectionId
        public string ConnectionId { get; set; } = null!;

        public bool IsUnderSuperClient { get; set; }
        public bool IsWebClient { get; set; }
        public bool IsDesktopClient { get; set; }

        public DateTime LastConnectionTimestamp { get; set; }

        public override string ToString()
        {
            return $"{UserName} / {ClientIp}";
        }
    }
}