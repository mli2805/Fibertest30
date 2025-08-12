using Iit.Fibertest.Dto;
using MediatR;

namespace Fibertest30.Application;

public record GetRtuAccidentQuery(int EventId): IRequest<RtuAccidentDto>;

public class GetRtuAccidentQueryHandler(TableProvider tableProvider)
    : IRequestHandler<GetRtuAccidentQuery, RtuAccidentDto>
{
    public Task<RtuAccidentDto> Handle(GetRtuAccidentQuery request, CancellationToken cancellationToken)
    {
        var result = tableProvider.GetRtuAccident(request.EventId);
        return Task.FromResult(result);
    }
}