using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record AssignBaseRefsCommand(AssignBaseRefDtoWithFiles dto) : IRequest<RequestAnswer>;

public class AssignBaseRefsCommandHandler : IRequestHandler<AssignBaseRefsCommand, RequestAnswer>
{

    public async Task<RequestAnswer> Handle(AssignBaseRefsCommand request, CancellationToken cancellationToken)
    {
        File.WriteAllBytes(@"c:\temp\test.sor", request.dto.BaseRefs[0].File);

        return new RequestAnswer();
    }
}

