using Microsoft.EntityFrameworkCore;

namespace Fibertest30.Infrastructure;

public class AlarmProfileRepository : IAlarmProfileRepository
{
    private readonly RtuContext _rtuContext;

    public AlarmProfileRepository(RtuContext rtuContext)
    {
        _rtuContext = rtuContext;
    }

    public async Task<List<AlarmProfile>> GetAll(CancellationToken ct)
    {
        var alarmProfilesEf = await _rtuContext.AlarmProfiles
            .Include(x => x.Thresholds)
            .ToListAsync(ct);

        var alarmProfiles = alarmProfilesEf.Select(a => a.FromEf()).ToList();
        return alarmProfiles;
    }

    public async Task UpdateAlarmProfile(AlarmProfile alarmProfile, CancellationToken ct)
    {
        var existingProfile = await _rtuContext.AlarmProfiles
            .Include(x => x.Thresholds)
            .FirstOrDefaultAsync(x => x.Id == alarmProfile.Id, ct);
        if (existingProfile == null)
        {
            throw new NullReferenceException($"Alarm profile {alarmProfile.Id} not found");
        }

        existingProfile.Name = alarmProfile.Name;
        foreach (ThresholdEf thresholdEf in existingProfile.Thresholds)
        {
            var threshold = alarmProfile.Thresholds.First(t => t.Parameter == thresholdEf.Parameter);
            thresholdEf.IsMinorOn = threshold.IsMinorOn;
            thresholdEf.IsMajorOn = threshold.IsMajorOn;
            thresholdEf.IsCriticalOn = threshold.IsCriticalOn;
            thresholdEf.Minor = threshold.Minor;
            thresholdEf.Major = threshold.Major;
            thresholdEf.Critical = threshold.Critical;
        }

        await _rtuContext.SaveChangesAsync(ct);
    }

    public async Task<int> CreateAlarmProfile(AlarmProfile alarmProfile, CancellationToken ct)
    {
        var alarmProfileEf = alarmProfile.ToEf();
        _rtuContext.AlarmProfiles.Add(alarmProfileEf);
        await _rtuContext.SaveChangesAsync(ct);

        return alarmProfileEf.Id;
    }

    public async Task DeleteAlarmProfile(int alarmProfileId, CancellationToken ct)
    {
        var existingProfile = await _rtuContext.AlarmProfiles.FirstOrDefaultAsync(x => x.Id == alarmProfileId, ct);
        if (existingProfile == null)
        {
            throw new NullReferenceException($"Alarm profile {alarmProfileId} not found");
        }

        try
        {
            _rtuContext.Remove(existingProfile);
            await _rtuContext.SaveChangesAsync(ct);
        }
        catch (Exception e)
        {
            if (e.InnerException != null && e.InnerException.Message.StartsWith("SQLite Error 19"))
            {
                throw new AlarmProfileIsUsedException("Alarm profile is used by monitoring ports");
            }
            throw;
        }
    }

    public async Task<AlarmProfile> GetById(int id, CancellationToken ct)
    {
        var alarmProfileEf = await _rtuContext.AlarmProfiles
            .Include(x => x.Thresholds)
            .SingleAsync(a => a.Id == id, ct);

        return alarmProfileEf.FromEf();
    }

    public bool UniqueName(AlarmProfile alarmProfile)
    {
        var profileInDb = _rtuContext.AlarmProfiles
            .SingleOrDefault(x => x.Name.ToLower() == alarmProfile.Name.ToLower() && x.Id != alarmProfile.Id);
        return profileInDb == null;
    }

    public bool DefaultNameInviolable(AlarmProfile alarmProfile)
    {
        if (alarmProfile.Id != 1) return true;
        return string.Equals(alarmProfile.Name.ToLower(), 
            _rtuContext.AlarmProfiles.Single(p => p.Id == 1).Name.ToLower());
    }
}