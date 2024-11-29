using MediatR;
using Optixsoft.SorExaminer;
using Optixsoft.SorExaminer.OtdrDataFormat;

namespace Fibertest30.Application;

public record GetMeasurementSorQuery(int SorFileId, bool EmbeddedBase) : IRequest<MeasurementTrace>;

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

        if (request.EmbeddedBase)
        {
            OtdrDataKnownBlocks sorData = sorBytes.ToSorData();
            var baseRef = sorData.EmbeddedData.EmbeddedDataBlocks.FirstOrDefault(block => block.Description == @"SOR");
            if (baseRef != null)
                return new MeasurementTrace(baseRef.Data);
            else
            {
                throw new ArgumentException("Base in this sorfile not found");
            }
        }
        else
        {
            OtdrDataKnownBlocks sorData = sorBytes.ToSorData();
            var blocks = sorData.EmbeddedData.EmbeddedDataBlocks.Where(block => block.Description != @"SOR").ToArray();
            sorData.EmbeddedData.EmbeddedDataBlocks = blocks;
            var bytesWithoutBase = sorData.ToBytes();
            return new MeasurementTrace(bytesWithoutBase);
        }

    }
}

