using Iit.Fibertest.Dto;
using Iit.Fibertest.UtilsLib;
using MediatR;

namespace Fibertest30.Application;

public record GetRftsEventsQuery(int SorFileId) : IRequest<RftsEventsDto>;

public class GetRftsEventsQueryHandler(ISorFileRepository sorFileRepository) : IRequestHandler<GetRftsEventsQuery, RftsEventsDto>
{
    public async Task<RftsEventsDto> Handle(GetRftsEventsQuery request, CancellationToken cancellationToken)
    {
            var sorBytes = await sorFileRepository.GetSorBytesAsync(request.SorFileId);
            return RftsEventsFactory.Create(sorBytes!);
    }
}