namespace Fibertest30.Api;

public static class FtSettingsMapping
{
    private static LicenseParameter ToProto(this Iit.Fibertest.Graph.LicenseParameter parameter)
    {
        return new LicenseParameter() { Value = parameter.Value, ValidUntil = parameter.ValidUntil.ToUniversalTime().ToTimestamp() };
    }

    public static License ToProto(this Iit.Fibertest.Graph.License license)
    {
        return new License()
        {
            LicenseId = license.LicenseId.ToString(),
            IsIncremental = license.IsIncremental,
            Owner = license.Owner,
            RtuCount = license.RtuCount.ToProto(),
            WebClientCount = license.WebClientCount.ToProto(),
            IsMachineKeyRequired = license.IsMachineKeyRequired,
            SecurityAdminPassword = license.SecurityAdminPassword,
            CreationDate = license.CreationDate.ToUniversalTime().ToTimestamp(),
            LoadingDate = license.LoadingDate.ToUniversalTime().ToTimestamp(),
            Version = license.Version
        };
    }

    private static Iit.Fibertest.Graph.LicenseParameter FromProto(this LicenseParameter proto)
    {
        return new Iit.Fibertest.Graph.LicenseParameter() { Value = proto.Value, ValidUntil = proto.ValidUntil.ToDateTime() };
    }

    public static Iit.Fibertest.Graph.License FromProto(this License proto)
    {
        return new Iit.Fibertest.Graph.License()
        {
            LicenseId = Guid.Parse(proto.LicenseId),
            IsIncremental = proto.IsIncremental,
            Owner = proto.Owner,
            RtuCount = proto.RtuCount.FromProto(),
            WebClientCount = proto.WebClientCount.FromProto(),
            IsMachineKeyRequired = proto.IsMachineKeyRequired,
            SecurityAdminPassword = proto.SecurityAdminPassword,
            CreationDate = proto.CreationDate.ToDateTime(),
            LoadingDate = proto.LoadingDate.ToDateTime(),
            Version = proto.Version
        };
    }


    public static Application.EmailServer FromProto(this EmailServer proto)
    {
        return new Application.EmailServer()
        {
            Enabled = proto.Enabled,
            ServerAddress = proto.ServerAddress,
            ServerPort = proto.ServerPort,
            OutgoingAddress = proto.OutgoingAddress,
            IsAuthenticationOn = proto.IsAuthenticationOn,
            ServerUserName = proto.ServerUserName,
            IsPasswordSet = proto.IsPasswordSet,
            ServerPassword = proto.ServerPassword,
            VerifyCertificate = proto.VerifyCertificate,
            FloodingPolicy = proto.FloodingPolicy,
            SmsOverSmtp = proto.SmsOverSmtp,
        };
    }

    public static EmailServer ToProto(this Application.EmailServer emailServer)
    {
        return new EmailServer()
        {
            Enabled = emailServer.Enabled,
            ServerAddress = emailServer.ServerAddress,
            ServerPort = emailServer.ServerPort,
            OutgoingAddress = emailServer.OutgoingAddress,
            IsAuthenticationOn = emailServer.IsAuthenticationOn,
            ServerUserName = emailServer.ServerUserName,
            IsPasswordSet = emailServer.IsPasswordSet,
            ServerPassword = emailServer.ServerPassword,
            VerifyCertificate = emailServer.VerifyCertificate,
            FloodingPolicy = emailServer.FloodingPolicy,
            SmsOverSmtp = emailServer.SmsOverSmtp,
        };
    }

    public static Application.TrapReceiver FromProto(this TrapReceiver proto)
    {
        return new Application.TrapReceiver
        {
            Enabled = proto.Enabled,
            SnmpVersion = proto.SnmpVersion,
            UseIitOid = proto.UseIitOid,
            TrapReceiverAddress = proto.TrapReceiverAddress,
            TrapReceiverPort = proto.TrapReceiverPort,
            CustomOid = proto.CustomOid,
            Community = proto.Community,
            AuthoritativeEngineId = proto.AuthoritativeEngineId,
            UserName = proto.UserName,
            IsAuthPswSet = proto.IsAuthPwdSet,
            AuthenticationPassword = proto.AuthenticationPassword,
            AuthenticationProtocol = proto.AuthenticationProtocol,
            IsPrivPswSet = proto.IsPrivPwdSet,
            PrivacyPassword = proto.PrivacyPassword,
            PrivacyProtocol = proto.PrivacyProtocol,
            SnmpLanguage = proto.SnmpLanguage
        };
    }

    public static TrapReceiver ToProto(this Application.TrapReceiver trapReceiver)
    {
        return new TrapReceiver
        {
            Enabled = trapReceiver.Enabled,
            SnmpVersion = trapReceiver.SnmpVersion,
            UseIitOid = trapReceiver.UseIitOid,
            TrapReceiverAddress = trapReceiver.TrapReceiverAddress,
            TrapReceiverPort = trapReceiver.TrapReceiverPort,
            CustomOid = trapReceiver.CustomOid,
            Community = trapReceiver.Community,
            AuthoritativeEngineId = trapReceiver.AuthoritativeEngineId,
            UserName = trapReceiver.UserName,
            IsAuthPwdSet = trapReceiver.IsAuthPswSet,
            AuthenticationPassword = trapReceiver.AuthenticationPassword,
            AuthenticationProtocol = trapReceiver.AuthenticationProtocol,
            IsPrivPwdSet = trapReceiver.IsPrivPswSet,
            PrivacyPassword = trapReceiver.PrivacyPassword,
            PrivacyProtocol = trapReceiver.PrivacyProtocol,
            SnmpLanguage = trapReceiver.SnmpLanguage
        };
    }

    public static Application.NotificationSettings FromProto(this NotificationSettings proto)
    {
        var settings = new Application.NotificationSettings()
        {
            Id = proto.Id
        };
        if (proto.EmailServer != null) settings.EmailServer = proto.EmailServer.FromProto();
        if (proto.TrapReceiver != null) settings.TrapReceiver = proto.TrapReceiver.FromProto();
        return settings;
    }

    public static NotificationSettings ToProto(this Application.NotificationSettings settings)
    {
        // when reading from db both EmailServer and TrapReceiver are set
        return new NotificationSettings
        {
            Id = settings.Id,
            EmailServer = settings.EmailServer!.ToProto(),
            TrapReceiver = settings.TrapReceiver!.ToProto()
        };
    }


}