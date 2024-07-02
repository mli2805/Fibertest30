using Moq;
using Moq.EntityFrameworkCore;

namespace Fibertest30.Application.UnitTests.Monitoring.Persistance;

[TestClass]
public class MonitoringRepositoryTests
{
    private readonly TestDateTime _dateTime;
    private readonly MonitoringRepository _monitoringRepository;

    public MonitoringRepositoryTests()
    {
        _dateTime = new TestDateTime(autoAddSecondOnUtcNow: false);
        
        var myDbContextMock = new Mock<RtuContext>();
        
        var monitorings = Enumerable.Range(0, 10)
            .Select(x => new MonitoringResult
            {
                CompletedAt = _dateTime.UtcNow.AddMinutes(x).ToUnixTime(),
                BaselineId = x // just to see the original index, for easier debugging
            })
            .ToList();

       
        myDbContextMock.Setup(x => x.Monitorings).ReturnsDbSet(monitorings);
       _monitoringRepository = new MonitoringRepository(myDbContextMock.Object, _dateTime);
    }
    
    [TestMethod]
    public async Task DateTimeFilter_StartInclusiveEndExclusive()
    {
        var dateTimeFilter = new DateTimeFilter
        {
            SearchWindow = new DateTimeRange
            {
                Start = _dateTime.UtcNow.AddMinutes(2),
                End = _dateTime.UtcNow.AddMinutes(8),
            }
        };
        
        var result = await _monitoringRepository.GetFilteredPortion(new List<int>(), dateTimeFilter, CancellationToken.None);
        result.Count.Should().Be(6);
        result[0].CompletedAt.Should().Be(_dateTime.UtcNow.AddMinutes(2).ToUnixTime());
        result[^1].CompletedAt.Should().Be(_dateTime.UtcNow.AddMinutes(7).ToUnixTime());
    }
    
    [TestMethod]
    public async Task DateTimeFilter_LoadSinceExclusive()
    {
        var dateTimeFilter = new DateTimeFilter
        {
            SearchWindow = new DateTimeRange
            {
                Start = _dateTime.UtcNow.AddMinutes(2),
                End = _dateTime.UtcNow.AddMinutes(8),
            },
            LoadSince = _dateTime.UtcNow.AddMinutes(4)
        };
        
        var result = await _monitoringRepository.GetFilteredPortion(new List<int>(), dateTimeFilter, CancellationToken.None);
        result.Count.Should().Be(3);
        result[0].CompletedAt.Should().Be(_dateTime.UtcNow.AddMinutes(5).ToUnixTime());
        result[^1].CompletedAt.Should().Be(_dateTime.UtcNow.AddMinutes(7).ToUnixTime());
    }
    
    [TestMethod]
    public async Task DateTimeFilter_LoadSince_ChangeDirectionDependingOnOrder()
    {
        var dateTimeFilter = new DateTimeFilter
        {
            SearchWindow = new DateTimeRange
            {
                Start = _dateTime.UtcNow.AddMinutes(2),
                End = _dateTime.UtcNow.AddMinutes(8),
            },
            LoadSince = _dateTime.UtcNow.AddMinutes(4),
            OrderDescending = true,
        };
        
        var result = await _monitoringRepository.GetFilteredPortion(new List<int>(), dateTimeFilter, CancellationToken.None);
        result.Count.Should().Be(2);
        result[0].CompletedAt.Should().Be(_dateTime.UtcNow.AddMinutes(3).ToUnixTime());
        result[^1].CompletedAt.Should().Be(_dateTime.UtcNow.AddMinutes(2).ToUnixTime());
    }
    
    [TestMethod]
    public async Task DateTimeFilter_RelativeFromNow()
    {
        var dateTimeFilter = new DateTimeFilter
        {
            RelativeFromNow = TimeSpan.FromMinutes(4)
        };

        var configUtcNow = _dateTime.UtcNow;
        _dateTime.UtcNow = _dateTime.UtcNow.AddMinutes(8);
        
        var result = await _monitoringRepository.GetFilteredPortion(new List<int>(), dateTimeFilter, CancellationToken.None);
        
        result.Count.Should().Be(4);
        result[0].CompletedAt.Should().Be(configUtcNow.AddMinutes(5).ToUnixTime());
        result[^1].CompletedAt.Should().Be(configUtcNow.AddMinutes(8).ToUnixTime());
    }
}