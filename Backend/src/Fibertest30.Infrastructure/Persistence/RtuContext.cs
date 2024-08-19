using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Fibertest30.Infrastructure.Persistence.Entities;
using System.Reflection;

namespace Fibertest30.Infrastructure;

public class RtuContext : IdentityDbContext<ApplicationUser>
{
    public RtuContext() { /* Empty ctor for EF Moq */ }
    public RtuContext(DbContextOptions<RtuContext> options) : base(options) { }
    public DbSet<UserSettings> UserSettings { get; set; }
    public virtual DbSet<MonitoringResult> Monitorings { get; set; }
    
    public DbSet<MonitoringResultSor> MonitoringSors{ get; set; }
    public DbSet<SystemEventEf> SystemEvents { get; set; }
    public DbSet<UserSystemNotificationEf> UserSystemNotifications { get; set; }
    
    public DbSet<UserAlarmNotificationEf> UserAlarmNotifications { get; set; }
    
    public DbSet<OtauEf> Otaus { get; set; }
    public DbSet<OtauPortEf> OtauPorts { get; set; }
    public DbSet<MonitoringPortEf> MonitoringPorts { get; set; }

    public DbSet<MonitoringTimeSlotEf> MonitoringTimeSlots { get; set; }
    
    public DbSet<MonitoringBaselineEf> Baselines { get; set; }
    public DbSet<MonitoringBaselineSorEf> BaselineSors { get; set; }
    
    public DbSet<MonitoringAlarmEf> Alarms { get; set; }
    public DbSet<MonitoringAlarmEventEf> AlarmEvents { get; set; }
    public DbSet<NotificationSettingsEf> NotificationSettings { get; set; }
    
    public DbSet<AlarmGroupIdEf> AlarmGroupId { get; set; }
    public DbSet<PortLabelEf> PortLabels { get; set; }
    public DbSet<PortLabelMonitoringPortEf> PortLabelMonitoringPorts { get; set; }

    protected override void OnModelCreating(ModelBuilder bulider)
    {
        bulider.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(bulider);
    }
}
