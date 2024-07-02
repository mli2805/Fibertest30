using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fibertest30.Infrastructure;

public class MonitoringPortConfiguration : IEntityTypeConfiguration<MonitoringPortEf>
{
    public void Configure(EntityTypeBuilder<MonitoringPortEf> builder)
    {
        builder.ToTable("MonitoringPort");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name)
            .IsRequired();
        
        builder.Property(x => x.Note)
            .IsRequired()
            .HasMaxLength(1000)
            .HasDefaultValue(string.Empty);

        builder.Property(x => x.LastRun)
            .IsRequired(false);
        
        builder.Property(x => x.Status)
            .HasConversion(
                v =>  v.ToString(), 
                v => (MonitoringPortStatus)Enum.Parse(typeof(MonitoringPortStatus), v))
            .IsUnicode(false)
            .IsRequired();  

        builder.Property(x => x.SchedulerMode)
            .HasConversion(
                v =>  v.ToString(), 
                v => (MonitoringSchedulerMode)Enum.Parse(typeof(MonitoringSchedulerMode), v))
            .IsUnicode(false)
            .IsRequired();

        builder.HasOne(m => m.Baseline)
            .WithOne()
            .HasForeignKey<MonitoringPortEf>(m => m.BaselineId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
        
        builder.Property(x => x.Interval)
            .IsRequired(false);

        builder.HasOne<AlarmProfileEf>()
            .WithMany(x => x.MonitoringPorts)
            .HasForeignKey(x => x.AlarmProfileId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false); 
        
        builder
            .HasMany(t => t.PortLabelMonitoringPorts)
            .WithOne(t => t.MonitoringPort) 
            .HasForeignKey(pt => pt.MonitoringPortId)
            .IsRequired(); 
    }
}