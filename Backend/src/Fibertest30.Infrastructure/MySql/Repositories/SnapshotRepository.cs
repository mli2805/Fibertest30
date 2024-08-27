using Iit.Fibertest.Dto;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;

public class SnapshotRepository
{
    private readonly ILogger<SnapshotRepository> _logger;
    private readonly FtDbContext _ftDbContext;

    public SnapshotRepository(ILogger<SnapshotRepository> logger, FtDbContext ftDbContext)
    {
        _logger = logger;
        _ftDbContext = ftDbContext;
    }

    // max_allowed_packet is 16M ???
    public async Task<int> AddSnapshotAsync(Guid graphDbVersionId, int lastEventNumber, DateTime lastEventDate, byte[] data)
    {
        try
        {

            _logger.LogInformation("Snapshot adding...");
            var portion = 2 * 1024 * 1024;
            for (int i = 0; i <= data.Length / portion; i++)
            {
                var payload = data.Skip(i * portion).Take(portion).ToArray();
                var snapshot = new Snapshot
                {
                    StreamIdOriginal = graphDbVersionId,
                    LastEventNumber = lastEventNumber,
                    LastEventDate = lastEventDate,
                    Payload = payload
                };
                _ftDbContext.Snapshots.Add(snapshot);
                var result = await _ftDbContext.SaveChangesAsync();
                if (result == 1)
                    _logger.LogInformation($"{i+1} portion,   {payload.Length} size");
                else return -1;
            }
            return data.Length / portion;
        }
        catch (Exception e)
        {
            _logger.LogError("AddSnapshotAsync: " + e.Message);
            return -1;
        }
    }

    public async Task<Tuple<int, byte[], DateTime>?> ReadSnapshotAsync(Guid graphDbVersionId)
    {
        try
        {

            _logger.LogInformation("Snapshot reading...");
            var portions = await _ftDbContext.Snapshots
                .Where(l => l.StreamIdOriginal == graphDbVersionId)
                .ToListAsync();
            if (!portions.Any())
            {
                _logger.LogInformation("No snapshots");
                return null;
            }
            var size = portions.Sum(p => p.Payload.Length);
            var offset = 0;
            byte[] data = new byte[size];
            foreach (var t in portions)
            {
                t.Payload.CopyTo(data, offset);
                offset = offset + t.Payload.Length;
            }
            var result = new Tuple<int, byte[], DateTime>
                (portions.First().LastEventNumber, data, portions.First().LastEventDate);
            _logger.LogInformation(
                $@"Snapshot size {result.Item2.Length:0,0} bytes.    Number of last event in snapshot {result.Item1:0,0}.");
            return result;
        }
        catch (Exception e)
        {
            _logger.LogError("ReadSnapshotAsync: " + e.Message);
            return null;
        }
    }

     
    public async Task<int> RemoveOldSnapshots()
    {
        try
        {
            {
                _logger.LogInformation("Snapshots removing...");
                var maxLastEventNumber = _ftDbContext.Snapshots.Max(f => f.LastEventNumber); 
                var oldSnapshotPortions = _ftDbContext.Snapshots.Where(f=>f.LastEventNumber != maxLastEventNumber).ToList();
                _ftDbContext.Snapshots.RemoveRange(oldSnapshotPortions);
                return await _ftDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            _logger.LogError("RemoveOldSnapshots: " + e.Message);
            return -1;
        }
    }


}