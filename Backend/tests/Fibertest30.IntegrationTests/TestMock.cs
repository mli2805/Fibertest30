
namespace Fibertest30.IntegrationTests;

public static class TestMock
{
    public static DateTime DateTime = new DateTime(2020, 10, 20, 14, 00, 00, DateTimeKind.Utc);
    public static Mock<IDateTime> IDateTime = new();

    static TestMock()
    {
        IDateTime.SetupGet(x => x.UtcNow).Returns(DateTime);
    }
}
