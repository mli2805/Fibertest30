using System.Reflection;

namespace Fibertest30.IntegrationTests.SystemEvents;

[TestClass]
public class SystemEventsCompatibilityTests
{
    [TestMethod]
    public void AllSystemEventTypesAreInSystemEventFactory()
    {
        var systemEventTypes = Enum.GetValues<SystemEventType>().Where( x=> x!= SystemEventType.Unknown).ToList();
        var systemEventFactoryMethods = typeof(SystemEventFactory)
            .GetMethods(BindingFlags.Public | BindingFlags.Static | BindingFlags.DeclaredOnly)
            .ToList();
        
        systemEventTypes.ForEach(eventType => 
            systemEventFactoryMethods.Should().Contain(method => method.Name == eventType.ToString(),
                    $"SystemEventFactory should have a method for {eventType}"));
    }
    
    [TestMethod]
    public void AllSystemEventTypesAreInSystemEventDataFactory()
    {
        var systemEventTypes = Enum.GetValues<SystemEventType>().Where( x=> x!= SystemEventType.Unknown).ToList();

        foreach (var systemEventType in systemEventTypes)
        {
            Action act = () => SystemEventDataFactory.Create(systemEventType, string.Empty);
            act.Should().NotThrow<ArgumentException>($"SystemEventDataFactory should have a method for {systemEventType}");
        }
    }
}