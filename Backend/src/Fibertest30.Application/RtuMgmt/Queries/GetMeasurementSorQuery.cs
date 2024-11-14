using MediatR;

namespace Fibertest30.Application;

public record GetMeasurementSorQuery(int SorFileId) : IRequest<MeasurementTrace>;

public class GetMeasurementSorQueryHandler : IRequestHandler<GetMeasurementSorQuery, MeasurementTrace>
{
    private readonly ISorFileRepository _sorFileRepository;

    public GetMeasurementSorQueryHandler(ISorFileRepository sorFileRepository)
    {
        _sorFileRepository = sorFileRepository;
    }

    public async Task<MeasurementTrace> Handle(GetMeasurementSorQuery request, CancellationToken cancellationToken)
    {
        var sorBytes = await _sorFileRepository.GetSorBytesAsync(request.SorFileId);
        if (sorBytes == null)
        {
            throw new ArgumentException("Sor file with such id not found");
        }

        return new MeasurementTrace(sorBytes);
    }
}

