using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class RegisterClientDto
    {
        [DataMember]
        public string ClientIp { get; set; } = null!;

        [DataMember]
        public DoubleAddress Addresses { get; set; } = null!;

        [DataMember]
        public string ConnectionId { get; set; } = null!;

        [DataMember]
        public string UserName { get; set; } = null!;
        [DataMember]
        public string Password { get; set; } = null!;

        [DataMember]
        public string MachineKey { get; set; } = null!;
        [DataMember]
        public string SecurityAdminPassword { get; set; } = null!; // Hashed

        [DataMember]
        public bool IsUnderSuperClient { get; set; }

        [DataMember]
        public bool IsWebClient { get; set; }

    }
}