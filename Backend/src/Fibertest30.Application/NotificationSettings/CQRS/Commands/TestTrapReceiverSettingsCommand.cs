using Iit.Fibertest.StringResources;
using MediatR;
using System.Globalization;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ChangeNotificationSettings)]
public record TestTrapReceiverSettingsCommand(TrapReceiver TrapReceiver) : IRequest<Unit>;

public class TestTrapReceiverSettingsCommandHandler(
    ISnmpService snmpService,
    INotificationSettingsRepository notificationSettingsRepository)
    : IRequestHandler<TestTrapReceiverSettingsCommand, Unit>
{
    public async Task<Unit> Handle(TestTrapReceiverSettingsCommand request, CancellationToken cancellationToken)
    {
        var newTrapReceiver = request.TrapReceiver;
        if (newTrapReceiver.SnmpVersion == "v3")
        {
            if (string.IsNullOrEmpty(newTrapReceiver.AuthenticationPassword)
                || string.IsNullOrEmpty(newTrapReceiver.PrivacyPassword))
            {
                var passwords = await notificationSettingsRepository
                    .GetTrapReceiverPasswords(cancellationToken);

                if (string.IsNullOrEmpty(newTrapReceiver.AuthenticationPassword))
                    newTrapReceiver.AuthenticationPassword = passwords.Item1;
                if (string.IsNullOrEmpty(newTrapReceiver.PrivacyPassword))
                    newTrapReceiver.PrivacyPassword = passwords.Item2;
            }
        }

        var previous = CultureInfo.CurrentUICulture;
        var culture = CultureInfo.GetCultureInfo($"{request.TrapReceiver.SnmpLanguage}");
        CultureInfo.CurrentUICulture = culture;
        CultureInfo.CurrentCulture = culture;

        var message = Resources.SID_This_is_a_test_SNMP_trap_to_ensure_trap_settings_are_correctly_configured_;
        snmpService.SendSnmpTrap(
            newTrapReceiver,
            FtTrapType.TestTrap,
            new Dictionary<FtTrapProperty, string>()
            {
                { FtTrapProperty.TestString, message },
                { FtTrapProperty.TestDateTime, DateTime.Now.ToString(culture)},
                { FtTrapProperty.TestDouble, 3.1415926.ToString(culture) },
                { FtTrapProperty.TestInt, 5000.ToString()}
            }
            );

        CultureInfo.CurrentUICulture = previous;
        CultureInfo.CurrentCulture = previous;

        return Unit.Value;
    }
}