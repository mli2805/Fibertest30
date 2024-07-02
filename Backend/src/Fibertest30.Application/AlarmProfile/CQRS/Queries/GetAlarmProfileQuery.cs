using MediatR;

namespace Fibertest30.Application;

public record GetAlarmProfileQuery(int AlarmProfileId) : IRequest<AlarmProfile>;

public class GetAlarmProfileQueryHandler : IRequestHandler<GetAlarmProfileQuery, AlarmProfile>
{
    private readonly IAlarmProfileRepository _repository;

    public GetAlarmProfileQueryHandler(IAlarmProfileRepository repository)
    {
        _repository = repository;
    }

    public async Task<AlarmProfile> Handle(GetAlarmProfileQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetById(request.AlarmProfileId, cancellationToken);
    }
}