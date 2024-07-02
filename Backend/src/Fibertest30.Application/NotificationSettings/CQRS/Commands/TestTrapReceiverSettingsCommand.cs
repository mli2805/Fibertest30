using MediatR;

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

        var message = "This is a test SNMP trap to ensure trap settings are correctly configured";
        _snmpService.SendSnmpTrap(
            newTrapReceiver, 
            (int)SnmpSpecificTrapType.TestTrap,
            new Dictionary<int, string>(){{90, message}}
            );

        return Unit.Value;
    }
}