using Lextm.SharpSnmpLib;
using Lextm.SharpSnmpLib.Messaging;
using Lextm.SharpSnmpLib.Security;
using System.Net;
using System.Text;

#pragma warning disable CS0618

namespace Fibertest30.Infrastructure;

public class SnmpService : ISnmpService
{
    public void SendSnmpTrap(TrapReceiver trapReceiver, FtTrapType specificTrapValue, Dictionary<FtTrapProperty, string> payload)
    {
        var ipAddress = IPAddress.Parse(trapReceiver.TrapReceiverAddress);
        // OID для ИИТ Fibertest 3.0
        var enterpriseOid = trapReceiver.UseVeexOid ? "1.3.6.1.4.1.36220.30" : trapReceiver.CustomOid;
        var variables = GetVariables(payload, enterpriseOid).ToList();

        if (trapReceiver.SnmpVersion == "v1")
        {
            SendSnmpV1TrapV1(ipAddress, trapReceiver.TrapReceiverPort, 
                trapReceiver.Community, enterpriseOid, specificTrapValue, variables);
        }
        else // v3
        {
            // variables.Add(
            //     new Variable(
            //         new ObjectIdentifier(enterpriseOid + ".10"),
            //         new Integer32(specificTrapValue)));

            var privacyProvider = GetPrivacyProvider(
                trapReceiver.AuthenticationProtocol,
                trapReceiver.AuthenticationPassword,
                trapReceiver.PrivacyProtocol,
                trapReceiver.PrivacyPassword);
            SendSnmpV3TrapV2(ipAddress, trapReceiver.TrapReceiverPort, enterpriseOid, trapReceiver.AuthoritativeEngineId,
                trapReceiver.UserName, privacyProvider, variables);
        }
    }

    private IEnumerable<Variable> GetVariables(Dictionary<FtTrapProperty, string> payload, string enterpriseOid)
    {
        foreach (KeyValuePair<FtTrapProperty, string> pair in payload)
        {
            // если отправить данные в этой кодировке, то PowerSNMP Free Manager правильно отображает русские и английские строки
            //var encoding1251 = Encoding.GetEncoding(1251);
            //ISnmpData data = new OctetString(pair.Value, encoding1251);

            // iReasoning MIB Browser можно настроить кодировку, в которой он понимает трапы,
            // но там получилось принять трапы v1 с русскими буквами в UTF8
            // но не получилось настроить прием v3 трапов

            ISnmpData data = new OctetString(pair.Value, Encoding.UTF8);
            var oid = enterpriseOid + $".{pair.Key}";
            yield return new Variable(new ObjectIdentifier(oid), data);
        }
    }

    /// <summary>
    /// Builds privacy provider for SnmpV3 TrapV2
    /// if the authProtocol is "none" then the privProtocol is not considered
    /// </summary>
    /// <param name="authProtocol">none | md5 | sha | sha256 | sha384 | sha512</param>
    /// <param name="authPassword"></param>
    /// <param name="privProtocol"></param>
    /// <param name="privPassword">none | des | tripledes | aes128 | aes192 | aes256</param>
    /// <returns></returns>
    /// <exception cref="ArgumentException">if one of protocols is unknown</exception>
    private IPrivacyProvider GetPrivacyProvider(
        string authProtocol, string authPassword, string privProtocol, string privPassword)
    {
        // if the authProtocol is "none" then the privProtocol is not considered
        if (authProtocol == "none") return DefaultPrivacyProvider.DefaultPair;

        var authenticationProvider = GetAuthenticationProvider(authProtocol, authPassword);
        var privacy = new OctetString(privPassword);

        return privProtocol.ToLowerInvariant() switch
        {
            "none" => new DefaultPrivacyProvider(authenticationProvider),
            "des" => new DESPrivacyProvider(privacy, authenticationProvider),
            "tripledes" => new TripleDESPrivacyProvider(privacy, authenticationProvider),
            "aes128" => new AESPrivacyProvider(privacy, authenticationProvider),
            "aes192" => new AES192PrivacyProvider(privacy, authenticationProvider),
            "aes256" => new AES256PrivacyProvider(privacy, authenticationProvider),
            _ => throw new ArgumentException("Unknown privacy protocol")
        };
    }

    private IAuthenticationProvider GetAuthenticationProvider(string authProtocol, string authPassword)
    {
        return authProtocol.ToLowerInvariant() switch
        {
            "md5" => new MD5AuthenticationProvider(new OctetString(authPassword)),
            "sha" => new SHA1AuthenticationProvider(new OctetString(authPassword)),
            "sha256" => new SHA256AuthenticationProvider(new OctetString(authPassword)),
            "sha384" => new SHA384AuthenticationProvider(new OctetString(authPassword)),
            "sha512" => new SHA512AuthenticationProvider(new OctetString(authPassword)),
            _ => throw new ArgumentException("Unknown authentication protocol")
        };
    }

    private void SendSnmpV3TrapV2(IPAddress address, int port, string enterpriseOid,
        string engineId, string authUserName, IPrivacyProvider privacyProvider,
        List<Variable> payload)
    {
        var trap = new TrapV2Message(
            VersionCode.V3,
            0,
            0,
            new OctetString(authUserName),
            new ObjectIdentifier(enterpriseOid),
            0,
            payload,
            privacyProvider,
            0x10000,
            new OctetString(ByteTool.Convert(engineId)),
            0,
            0);
        trap.Send(new IPEndPoint(address, port));
    }

    private void SendSnmpV1TrapV1(IPAddress address, int port, string community, string enterpriseOid, 
        FtTrapType specificTrapValue, List<Variable> payload)
    {
        Messenger.SendTrapV1(
            new IPEndPoint(address, port),
            IPAddress.Loopback,
            new OctetString(community),
            new ObjectIdentifier(enterpriseOid),
            GenericCode.EnterpriseSpecific,
            (int)specificTrapValue,
            0,
            payload
            );
    }
}
