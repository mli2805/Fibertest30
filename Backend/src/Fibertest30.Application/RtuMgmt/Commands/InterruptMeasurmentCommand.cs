using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record InterruptMeasurmentCommand(Guid RtuId) : IRequest<Unit>;

public class InterruptMeasurmentCommandHandler(ICurrentUserService currentUserService, IRtuManager rtuManager) : IRequestHandler<InterruptMeasurmentCommand, Unit>
{
    public async Task<Unit> Handle(InterruptMeasurmentCommand request, CancellationToken cancellationToken)
    {
        var dto = new InterruptMeasurementDto() { ConnectionId = currentUserService.UserId!, RtuId = request.RtuId };
        await rtuManager.InterruptMesasurement(dto);
        return Unit.Value;
    }
}