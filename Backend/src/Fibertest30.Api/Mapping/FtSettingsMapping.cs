namespace Fibertest30.Api;

public static class FtSettingsMapping
{
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
            UseVeexOid = proto.UseVeexOid,
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
            PrivacyProtocol = proto.PrivacyProtocol
        };
    }

    public static TrapReceiver ToProto(this Application.TrapReceiver trapReceiver)
    {
        return new TrapReceiver
        {
            Enabled = trapReceiver.Enabled,
            SnmpVersion = trapReceiver.SnmpVersion,
            UseVeexOid = trapReceiver.UseVeexOid,
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
            PrivacyProtocol = trapReceiver.PrivacyProtocol
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