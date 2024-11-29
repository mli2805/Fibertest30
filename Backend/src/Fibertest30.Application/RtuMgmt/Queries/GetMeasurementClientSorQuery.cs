using MediatR;

namespace Fibertest30.Application;

public record GetMeasurementClientSorQuery(Guid MeasurementClientId) : IRequest<byte[]>;

public class GetMeasurementClientSorQueryHandler : IRequestHandler<GetMeasurementClientSorQuery, byte[]>
{
    private readonly IRtuLinuxPollster _rtuLinuxPollster;

    public GetMeasurementClientSorQueryHandler(IRtuLinuxPollster rtuLinuxPollster)
    {
        _rtuLinuxPollster = rtuLinuxPollster;
    }

    public Task<byte[]> Handle(GetMeasurementClientSorQuery request, CancellationToken cancellationToken)
    {
        var sorBytes = _rtuLinuxPollster.GetMeasurementClientSor(request.MeasurementClientId);
        if (sorBytes == null)
        {
            throw new ArgumentException("Measurement(Client) with such id not found");
        }

        return Task.FromResult(sorBytes);
    }
}
