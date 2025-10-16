using MediatR;
using System.Globalization;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.ChangeNotificationSettings)]
public record TestTrapReceiverSettingsCommand(TrapReceiver TrapReceiver) : IRequest<Unit>;

public class TestTrapReceiverSettingsCommandHandler : IRequestHandler<TestTrapReceiverSettingsCommand, Unit>
{
    private readonly ISnmpService _snmpService;
    private readonly INotificationSettingsRepository _notificationSettingsRepository;

    public TestTrapReceiverSettingsCommandHandler(ISnmpService snmpService,
        INotificationSettingsRepository notificationSettingsRepository)
    {
        _snmpService = snmpService;
        _notificationSettingsRepository = notificationSettingsRepository;
    }

    public async Task<Unit> Handle(TestTrapReceiverSettingsCommand request, CancellationToken cancellationToken)
    {
        var newTrapReceiver = request.TrapReceiver;
        if (newTrapReceiver.SnmpVersion == "v3")
        {
            if (string.IsNullOrEmpty(newTrapReceiver.AuthenticationPassword)
                || string.IsNullOrEmpty(newTrapReceiver.PrivacyPassword))
            {
                var passwords = await _notificationSettingsRepository
                    .GetTrapReceiverPasswords(cancellationToken);

                if (string.IsNullOrEmpty(newTrapReceiver.AuthenticationPassword))
                    newTrapReceiver.AuthenticationPassword = passwords.Item1;
                if (string.IsNullOrEmpty(newTrapReceiver.PrivacyPassword))
                    newTrapReceiver.PrivacyPassword = passwords.Item2;
            }
        }

        var message = request.TrapReceiver.SnmpLanguage == "en-US"
            ? "This is a test SNMP trap to ensure trap settings are correctly configured."
            : "Это тестовый SNMP трап чтобы убедиться что настройки заданы правильно.";
        _snmpService.SendSnmpTrap(
            newTrapReceiver,
            FtTrapType.TestTrap,
            new Dictionary<FtTrapProperty, string>()
            {
                { FtTrapProperty.TestString, message },
                { FtTrapProperty.TestDateTime, DateTime.Now.ToString(CultureInfo.InvariantCulture)},
                { FtTrapProperty.TestDouble, 3.1415926.ToString(CultureInfo.InvariantCulture) },
                { FtTrapProperty.TestInt, 5000.ToString()}
            }
            );

        return Unit.Value;
    }
}