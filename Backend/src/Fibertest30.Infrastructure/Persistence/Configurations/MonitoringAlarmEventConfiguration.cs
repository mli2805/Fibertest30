using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json;

namespace Fibertest30.Infrastructure;

public class MonitoringAlarmEventConfiguration : IEntityTypeConfiguration<MonitoringAlarmEventEf>
{
    public void Configure(EntityTypeBuilder<MonitoringAlarmEventEf> builder)
    {
        builder.ToTable("AlarmEvent");
        
        builder.HasKey(x => x.Id);
        
        builder.Property(x => x.MonitoringAlarmGroupId)
            .IsRequired();
        
        builder.Property(x => x.Type)
            .HasConversion(
                v =>  v.ToString(), 
                v => (MonitoringAlarmType)Enum.Parse(typeof(MonitoringAlarmType), v))
            .IsUnicode(false)
            .IsRequired();  
        
        builder.Property(x => x.DistanceMeters)
            .IsRequired(false);
        
        builder.Property(x => x.At)
            .IsRequired();
        
        builder.Property(x => x.OldStatus)
            .HasConversion(
                v =>  v != null ? v.ToString() : null, 
                v => v != null ? (MonitoringAlarmStatus)Enum.Parse(typeof(MonitoringAlarmStatus), v) : null
            )
            .IsUnicode(false)
            .IsRequired(false);  
        
        builder.Property(x => x.Status)
            .HasConversion(
                v =>  v.ToString(), 
                v => (MonitoringAlarmStatus)Enum.Parse(typeof(MonitoringAlarmStatus), v))
            .IsUnicode(false)
            .IsRequired();  
        
        
        builder.Property(x => x.OldLevel)
            .HasConversion(
                v =>  v != null ? v.ToString() : null, 
                v => v != null ? (MonitoringAlarmLevel)Enum.Parse(typeof(MonitoringAlarmLevel), v) : null
            )
            .IsUnicode(false)
            .IsRequired(false);  
        
        builder.Property(x => x.Level)
            .HasConversion(
                v =>  v.ToString(), 
                v => (MonitoringAlarmLevel)Enum.Parse(typeof(MonitoringAlarmLevel), v))
            .IsUnicode(false)
            .IsRequired();  
        
        builder.Property(x => x.Change)
            .HasConversion(
                v => v == null ? null : JsonSerializer.Serialize(v, JsonSerializerEx.SerializerOptions),
                v => v == null ? null : JsonSerializer.Deserialize<MonitoringChange>(v, JsonSerializerEx.SerializerOptions)!)
            .HasColumnType("TEXT")
            .IsRequired(false);
        
        builder.HasOne(x => x.Alarm)
            .WithMany(x => x.Events)
            .HasForeignKey(x => x.MonitoringAlarmId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(x => x.MonitoringResult)
            .WithMany()
            .HasForeignKey(x => x.MonitoringResultId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(x => x.MonitoringPort)
            .WithMany()
            .HasForeignKey(x => x.MonitoringPortId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
    }
}