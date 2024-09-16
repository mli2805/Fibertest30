using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record ApplyMonitoringSettingsCommand(ApplyMonitoringSettingsDto Dto) : IRequest<RequestAnswer>;

public class ApplyMonitoringSettingsCommandHandler : IRequestHandler<ApplyMonitoringSettingsCommand, RequestAnswer>
{
    private readonly IRtuManager _rtuManager;

    public ApplyMonitoringSettingsCommandHandler(IRtuManager rtuManager)
    {
        _rtuManager = rtuManager;
    }

    public async Task<RequestAnswer> Handle(ApplyMonitoringSettingsCommand request, CancellationToken cancellationToken)
    {
        var result = await _rtuManager.ApplyMonitoringSettings(request.Dto);
        // стартуем процесс применения
        // когда полстер обнаружит, что применилось пришлет SystemEvent
        return result;
    }
}

