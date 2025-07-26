using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record DoPreciseMeasurementOutOfTurnCommand(DoOutOfTurnPreciseMeasurementDto Dto) : IRequest<Unit>;

public class DoPreciseMeasurementOutOfTurnCommandHandler(ICurrentUserService currentUserService, IRtuManager rtuManager) : IRequestHandler<DoPreciseMeasurementOutOfTurnCommand, Unit>
{
    public async Task<Unit> Handle(DoPreciseMeasurementOutOfTurnCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Dto;
        dto.ConnectionId = currentUserService.UserId!;

        var result = await rtuManager.StartPreciseMeasurementOutOfTurn(dto);
        return Unit.Value;
    }
}