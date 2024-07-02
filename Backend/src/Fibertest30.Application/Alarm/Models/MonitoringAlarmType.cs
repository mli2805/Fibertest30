namespace Fibertest30.Application;


// DO NOT change the name of enum values. They are stored in the database as strings.
public enum MonitoringAlarmType
{
    EventLoss, 
    TotalLoss, 
    EventReflectance, 
    SectionAttenuation, 
    SectionLoss, 
    SectionLengthChange, 
    PortHealth,
    FiberBreak,
    NewEvent,
    NewEventAfterEof
}