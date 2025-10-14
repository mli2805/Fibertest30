using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record ApplyLicenseCommand(License License) : IRequest<Unit>;

public class ApplyLicenseCommandHandler() : IRequestHandler<ApplyLicenseCommand, Unit>
{
    public Task<Unit> Handle(ApplyLicenseCommand request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}