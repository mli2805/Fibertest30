using MediatR;

namespace Fibertest30.Application;

public record UpdateNtpSettingsCommand(NtpSettings NtpSettings) : IRequest<Unit>;

public class UpdateNtpSettingsCommandHandler : IRequestHandler<UpdateNtpSettingsCommand, Unit>
{
    private readonly INtpSettingsProvider _ntpSettingsProvider;
    private readonly ISystemEventSender _systemEventSender;
    private readonly ICurrentUserService _currentUserService;

    public UpdateNtpSettingsCommandHandler(INtpSettingsProvider ntpSettingsProvider, 
        ISystemEventSender systemEventSender, ICurrentUserService currentUserService)
    {
        _ntpSettingsProvider = ntpSettingsProvider;
        _systemEventSender = systemEventSender;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(UpdateNtpSettingsCommand request, CancellationToken cancellationToken)
    {
        await _ntpSettingsProvider.UpdateNtpSettings(request.NtpSettings, cancellationToken);

        await _systemEventSender.Send(SystemEventFactory.NtpSettingsUpdated(_currentUserService.UserId!, request.NtpSettings));

        return Unit.Value;
    }
}