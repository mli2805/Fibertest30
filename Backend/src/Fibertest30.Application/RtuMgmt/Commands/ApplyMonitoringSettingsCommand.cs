using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record ApplyMonitoringSettingsCommand(ApplyMonitoringSettingsDto Dto) : IRequest<RequestAnswer>;

public class ApplyMonitoringSettingsCommandHandler : IRequestHandler<ApplyMonitoringSettingsCommand, RequestAnswer>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IRtuManager _rtuManager;
    private readonly ISystemEventSender _systemEventSender;
    private readonly Model _writeModel;

    public ApplyMonitoringSettingsCommandHandler(ICurrentUserService currentUserService, 
        IRtuManager rtuManager, ISystemEventSender systemEventSender, Model writeModel)
    {
        _currentUserService = currentUserService;
        _rtuManager = rtuManager;
        _systemEventSender = systemEventSender;
        _writeModel = writeModel;
    }

    public async Task<RequestAnswer> Handle(ApplyMonitoringSettingsCommand request, CancellationToken cancellationToken)
    {
        var result = await _rtuManager.ApplyMonitoringSettings(request.Dto);
        var rtu = _writeModel.Rtus.First(r => r.Id == request.Dto.RtuId);

        var systemEvent = SystemEventFactory.MonitoringSettingsApplied(_currentUserService.UserId!, rtu.Id, rtu.Title);
        await _systemEventSender.Send(systemEvent);
        return result;
    }
}

