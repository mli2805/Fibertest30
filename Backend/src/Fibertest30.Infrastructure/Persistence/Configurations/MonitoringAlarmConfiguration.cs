using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json;

namespace Fibertest30.Infrastructure;

public class MonitoringAlarmConfiguration : IEntityTypeConfiguration<MonitoringAlarmEf>
{
    public void Configure(EntityTypeBuilder<MonitoringAlarmEf> builder)
    {
        builder.ToTable("Alarm");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.AlarmGroupId)
            .IsRequired();
        
        builder.Property(x => x.ResolvedAt)
            .IsRequired(false);
        
        builder.Property(x => x.Type)
            .HasConversion(
                v =>  v.ToString(), 
                v => (MonitoringAlarmType)Enum.Parse(typeof(MonitoringAlarmType), v))
            .IsUnicode(false)
            .IsRequired();  
        
        builder.Property(x => x.Level)
            .HasConversion(
                v =>  v.ToString(), 
                v => (MonitoringAlarmLevel)Enum.Parse(typeof(MonitoringAlarmLevel), v))
            .IsUnicode(false)
            .IsRequired();  
        
        builder.Property(x => x.Status)
            .HasConversion(
                v =>  v.ToString(), 
                v => (MonitoringAlarmStatus)Enum.Parse(typeof(MonitoringAlarmStatus), v))
            .IsUnicode(false)
            .IsRequired();  

        builder.Property(x => x.DistanceMeters)
            .IsRequired(false);
        
        builder.Property(x => x.Change)
            .HasConversion(
                v => v == null ? null : JsonSerializer.Serialize(v, JsonSerializerEx.SerializerOptions),
                v => v == null ? null : JsonSerializer.Deserialize<MonitoringChange>(v, JsonSerializerEx.SerializerOptions)!)
            .HasColumnType("TEXT")
            .IsRequired(false);
        
        builder.HasOne(x => x.MonitoringPort)
            .WithMany()
            .HasForeignKey(x => x.MonitoringPortId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasOne(x => x.MonitoringResult)
            .WithMany()
            .HasForeignKey(x => x.MonitoringResultId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
    }
}