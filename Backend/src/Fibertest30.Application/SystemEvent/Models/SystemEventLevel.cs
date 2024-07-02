namespace Fibertest30.Application;

// DO NOT change the name of enum values. They are stored in the database as strings.
public enum SystemEventLevel
{
    Unknown,
    Internal, // internal system events are not saved to the database
    Info,
    Major,
    Critical,
}