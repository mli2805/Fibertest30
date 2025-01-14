using Iit.Fibertest.Dto;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;

public class SnapshotRepository(ILogger<SnapshotRepository> logger, FtDbContext ftDbContext)
{
    // max_allowed_packet is 16M ???
    public async Task<int> AddSnapshotAsync(Guid graphDbVersionId, int lastEventNumber, DateTime lastEventDate, byte[] data)
    {
        try
        {

            logger.LogInformation("Snapshot adding...");
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
                ftDbContext.Snapshots.Add(snapshot);
                var result = await ftDbContext.SaveChangesAsync();
                if (result == 1)
                    logger.LogInformation($"{i + 1} portion,   {payload.Length} size");
                else return -1;
            }
            return data.Length / portion;
        }
        catch (Exception e)
        {
            logger.LogError("AddSnapshotAsync: " + e.Message);
            return -1;
        }
    }

    public async Task<Tuple<int, byte[], DateTime>?> ReadSnapshotAsync(Guid graphDbVersionId)
    {
        try
        {

            logger.LogInformation("Snapshot reading...");
            var portions = await ftDbContext.Snapshots
                .Where(l => l.StreamIdOriginal == graphDbVersionId)
                .ToListAsync();
            if (!portions.Any())
            {
                logger.LogInformation("No snapshots");
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
            logger.LogInformation(
                $@"Snapshot size {result.Item2.Length:0,0} bytes.    Number of last event in snapshot {result.Item1:0,0}.");
            return result;
        }
        catch (Exception e)
        {
            logger.LogError("ReadSnapshotAsync: " + e.Message);
            return null;
        }
    }


    public async Task<int> RemoveOldSnapshots()
    {
        try
        {
            {
                logger.LogInformation("Snapshots removing...");
                var maxLastEventNumber = ftDbContext.Snapshots.Max(f => f.LastEventNumber);
                var oldSnapshotPortions = 
                    ftDbContext.Snapshots.Where(f => f.LastEventNumber != maxLastEventNumber).ToList();
                ftDbContext.Snapshots.RemoveRange(oldSnapshotPortions);
                return await ftDbContext.SaveChangesAsync();
            }
        }
        catch (Exception e)
        {
            logger.LogError("RemoveOldSnapshots: " + e.Message);
            return -1;
        }
    }

}