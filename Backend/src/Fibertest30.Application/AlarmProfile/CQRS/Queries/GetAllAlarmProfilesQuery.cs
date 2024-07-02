using MediatR;

namespace Fibertest30.Application;

public record GetAllAlarmProfilesQuery() : IRequest<List<AlarmProfile>>;

public class GetAllAlarmProfilesQueryHandler : IRequestHandler<GetAllAlarmProfilesQuery, List<AlarmProfile>>
{
    private readonly IAlarmProfileRepository _repository;

    public GetAllAlarmProfilesQueryHandler(IAlarmProfileRepository repository)
    {
        _repository = repository;
    }


    public async Task<List<AlarmProfile>> Handle(GetAllAlarmProfilesQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetAll(cancellationToken);
    }
}
