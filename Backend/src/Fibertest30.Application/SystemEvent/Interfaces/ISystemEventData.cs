namespace Fibertest30.Application;


// System events data is stored as JSON in the database
// So, do not change Data classess property names
public interface ISystemEventData
{
    string ToJsonData();
}