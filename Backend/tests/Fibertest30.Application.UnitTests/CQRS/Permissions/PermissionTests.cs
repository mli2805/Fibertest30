namespace Fibertest30.Application.UnitTests;

[TestClass]
public class PermissionTests
{
    [TestMethod]
    public void PortLabelCommands_MustHavePermission_EditPortLabels()
    {
        var commands = new[]
        {
            typeof(AddAndAttachPortLabelCommand),
            typeof(UpdatePortLabelCommand),
            typeof(AttachPortLabelCommand),
            typeof(DetachPortLabelCommand) 
        };
        
        commands.MustHavePermissionAttribute(ApplicationPermission.EditPortLabels);
    }
    
    [TestMethod]
    public void MonitoringPortCommands_MustHavePermission_ChangeMonitoringPortSettings()
    {
        var commands = new[]
        {
            typeof(SetMonitoringPortStatusCommand),
            typeof(SetMonitoringPortScheduleCommand),
        };
        
        commands.MustHavePermissionAttribute(ApplicationPermission.ChangeMonitoringPortSettings);
    }
    
    [TestMethod]
    public void MonitoringPortNoteCommand_MustHavePermission_EditPortLabels()
    {
        typeof(SetMonitoringPortNoteCommand).MustHavePermissionAttribute(ApplicationPermission.EditPortLabels);
    }
}