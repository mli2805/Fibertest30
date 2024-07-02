namespace Fibertest30.Application;

public interface IAlarmProfileRepository
{
    Task<List<AlarmProfile>> GetAll(CancellationToken ct);

    Task UpdateAlarmProfile(AlarmProfile alarmProfile, CancellationToken ct);
    Task<int> CreateAlarmProfile(AlarmProfile alarmProfile, CancellationToken ct);
    Task DeleteAlarmProfile(int alarmProfileId, CancellationToken ct);

    Task<AlarmProfile> GetById(int id, CancellationToken ct);
    bool UniqueName(AlarmProfile alarmProfile);
    bool DefaultNameInviolable(AlarmProfile alarmProfile);
}