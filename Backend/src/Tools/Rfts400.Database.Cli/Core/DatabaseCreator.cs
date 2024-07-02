using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;

namespace Fibertest30.Database.Cli;

public class DatabaseCreator
{
    private readonly IServiceProvider _serviceProvider;
    private readonly DatabaseCreationOptions _options;
    private int _lastPortPeriodIndex = 0;

    public DatabaseCreator(IServiceProvider serviceProvider, DatabaseCreationOptions options)
    {
        _serviceProvider = serviceProvider;
        _options = options;
    }
    
    public async Task Run()
    {
        await InitAndSeedDatabase(_options.DatabaseOutputPath);
        if (_options.MonitoringPortPeriods.Count > 0)
        {
            var userManager = _serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var userId = userManager.Users.First().Id;

            var currentDay = DateTime.UtcNow;
            var currentDayHours = currentDay.Date.AddHours(currentDay.Hour);
            
            var maxPortPeriod = _options.MonitoringPortPeriods.Max(x => x.Period);
            var startTime = currentDayHours - maxPortPeriod;
           
            await SetupBaseline(startTime, userId);
            await FillMonitoringHistory(startTime, maxPortPeriod);
            if (_options.Analyze)
            {
                RunAnalyze();
            }
        }
    }

    private async Task InitAndSeedDatabase(string databaseOutputPath)
    {
        Console.WriteLine("Creating database..");
        var sw = Stopwatch.StartNew();
        using var scope = _serviceProvider.CreateScope();
        var rtuInitializer = scope.ServiceProvider.GetRequiredService<RtuContextInitializer>();
        await rtuInitializer.InitialiseAsync();
        await rtuInitializer.SeedAsync(seedDemoOtaus: "onlyOcm", seedDemoUsers: _options.SeedDemoUsers); 
    
        sw.Stop();
        Console.WriteLine($"Database {databaseOutputPath} created {sw.ElapsedMilliseconds.ToElapsedString()}.");
    }
    
    
    private async Task SetupBaseline(DateTime now, string userId)
    {
        var sw = Stopwatch.StartNew();
        
        var measurementSettings = FakeDataFactory.FakeMeasurementSettings;
        var sor = FakeDataFactory.FakeSor;

        // As we start from a fresh database, where only Omc is seeded
        // we know that both OtauPorts and MonitoringPorts have Ids from 1 to 8
        // let's add baselines for all MonitoringPorts, so they have the same Ids as MonitoringPorts
        foreach (var monitoringPortId in Enumerable.Range(1, 8))
        {
            using var scope = _serviceProvider.CreateScope();
            var baselineRepository = scope.ServiceProvider.GetRequiredService<IBaselineRepository>();
            var baselineId = await baselineRepository.Add(monitoringPortId, now, userId, measurementSettings, sor, CancellationToken.None);
        
            var monitoringPortRepository = scope.ServiceProvider.GetRequiredService<IMonitoringPortRepository>();
            await monitoringPortRepository.SetBaseline(monitoringPortId, baselineId, CancellationToken.None);            
        }
        
        sw.Stop();
        Console.WriteLine($"Baselines are filled {sw.ElapsedMilliseconds.ToElapsedString()}.");
    }

    private async Task FillMonitoringHistory(DateTime startTime, TimeSpan maxPortPeriod)
    {
        var total = (int)(maxPortPeriod / _options.MeasurementTime);
        Console.WriteLine($"Adding {maxPortPeriod} of measurements (total = {total}) to the monitoring history..");
       
        var now = startTime;
        var count = 0;
        var sw = Stopwatch.StartNew(); 
        
        while(true)
        {
            (DateTime batchResultNow, int batchResultCount, long batchElapsedMs) 
                = await MonitoringHistoryAddBatch(_options.BatchSize, startTime, now);
            now = batchResultNow;
            count += batchResultCount;
            Console.WriteLine($"{count} of {total} {((double)count/total):P2} in {TimeSpan.FromMilliseconds(batchElapsedMs).ToString(@"ss's 'fff'ms'")}..");

            if (batchResultCount != _options.BatchSize)
            {
                break;
            }
        }
        
        Console.WriteLine($"Monitoring History for {maxPortPeriod} is filled {sw.ElapsedMilliseconds.ToElapsedString()}.");
    }
    
    private async Task<(DateTime, int, long)> MonitoringHistoryAddBatch(int batchSize, 
        DateTime startTime, DateTime now)
    {
        var sw = Stopwatch.StartNew(); 
        var count = 0;
        
        using var scope = _serviceProvider.CreateScope();
        var ctx = scope.ServiceProvider.GetRequiredService<RtuContext>();

        while (count != batchSize && _options.MonitoringPortPeriods.Count > 0)
        {
            var nextPortPeriod = GetNextPortPeriod();
            if (now - startTime >= nextPortPeriod.Period)
            {
                // if port period is over, remove it from the list
                _options.MonitoringPortPeriods.Remove(nextPortPeriod);
                if (_lastPortPeriodIndex > 0) { _lastPortPeriodIndex--;  }
                continue;
            }
            
            now = now.Add(_options.MeasurementTime);
            AddMeasurement(ctx, now, nextPortPeriod);

            count++;
        }
        
        await ctx.SaveChangesAsync();
        
        return (now, count, sw.ElapsedMilliseconds);
    }

    private MonitoringPortPeriod GetNextPortPeriod()
    {
        var nextIndex = _lastPortPeriodIndex == (_options.MonitoringPortPeriods.Count - 1)
            ? 0
            : _lastPortPeriodIndex + 1;
        
        var nextPort = _options.MonitoringPortPeriods[nextIndex];
        _lastPortPeriodIndex = nextIndex;
        return nextPort;
    }
    private void AddMeasurement(RtuContext ctx, DateTime now, MonitoringPortPeriod portPeriod)
    {
        var measurementSettings = FakeDataFactory.FakeMeasurementSettings;
        var sor = _options.AddSor ? FakeDataFactory.FakeSor : Array.Empty<byte>();
        var changes = FakeDataFactory.FakeMonitoringChanges;
        
        var changesToAdd = changes.Take(portPeriod.Count % (changes.Count + 1)).ToList();
        portPeriod.Count++;

        var monitoringResult = new MonitoringResult
        {
            // In our base BaselineId is the same as MonitoringPortId
            // because we start from the fresh database where only Ocm is seeded
            // and add baselines consequently
            
            BaselineId = portPeriod.Port,
            CompletedAt = now.ToUnixTime(),
            MonitoringPortId = portPeriod.Port,
            MostSevereChangeLevel = changesToAdd.GetMostSevereChangeLevel(),
            ChangesCount = changesToAdd.Count,

            Sor = new MonitoringResultSor
            {
                Data = sor,
                MeasurementSettings = measurementSettings,
                Changes = changesToAdd
            },
        };

        ctx.Monitorings.Add(monitoringResult);
    }

    public void RunAnalyze()
    {
        var sw = Stopwatch.StartNew();
        using var scope = _serviceProvider.CreateScope();

        var ctx = _serviceProvider.GetRequiredService<RtuContext>();
        ctx.Database.ExecuteSqlRaw("ANALYZE;");

        sw.Stop();
        Console.WriteLine($"ANALYZE {sw.ElapsedMilliseconds.ToElapsedString()}.");
    }
}