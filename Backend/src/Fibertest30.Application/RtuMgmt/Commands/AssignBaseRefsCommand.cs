using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record AssignBaseRefsCommand(AssignBaseRefsDto Dto) : IRequest<BaseRefAssignedDto>;

public class AssignBaseRefsCommandHandler : IRequestHandler<AssignBaseRefsCommand, BaseRefAssignedDto>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IRtuManager _rtuManager;
    private readonly ISystemEventSender _systemEventSender;
    private readonly Model _writeModel;

    public AssignBaseRefsCommandHandler(ICurrentUserService currentUserService,
        IRtuManager rtuManager, ISystemEventSender systemEventSender, Model writeModel)
    {
        _currentUserService = currentUserService;
        _rtuManager = rtuManager;
        _systemEventSender = systemEventSender;
        _writeModel = writeModel;
    }

    public async Task<BaseRefAssignedDto> Handle(AssignBaseRefsCommand request, CancellationToken cancellationToken)
    {
        request.Dto.Username = _currentUserService.UserName!;
        foreach (BaseRefDto baseRefDto in request.Dto.BaseRefs)
        {
            baseRefDto.UserName = _currentUserService.UserName!;
        }
        var result = await _rtuManager.AssignBaseRefs(request.Dto);

        // SystemEvent идет всем пользователям и в историю
        // нет смысла сохранять и рассылать всем неудачные попытки
        if (result.ReturnCode == ReturnCode.BaseRefAssignedSuccessfully)
        {
            var trace = _writeModel.Traces.First(t => t.TraceId == request.Dto.TraceId);
            var systemEvent = SystemEventFactory
                .BaseRefsAssigned(_currentUserService.UserId!, request.Dto.RtuId, trace.TraceId, trace.Title, trace.HasAnyBaseRef);
            await _systemEventSender.Send(systemEvent);
        }

        return result;
    }
}

