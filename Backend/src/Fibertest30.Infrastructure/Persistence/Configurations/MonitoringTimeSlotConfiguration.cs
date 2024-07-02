using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fibertest30.Infrastructure;

public class MonitoringTimeSlotConfiguration : IEntityTypeConfiguration<MonitoringTimeSlotEf>
{
    public void Configure(EntityTypeBuilder<MonitoringTimeSlotEf> builder)
    {
        builder.ToTable("MonitoringTimeSlot"); 
        
        builder.HasKey(t => t.Id);
        
        builder.Property(x => x.StartTime)
            .HasConversion(
                x => x.ToString("HH:mm"),
                x => TimeOnly.ParseExact(x, "HH:mm")
            );

        builder.Property(x => x.EndTime)
            .HasConversion(
                x => x.ToString("HH:mm"),
                x => TimeOnly.ParseExact(x, "HH:mm")
            );

        builder.HasOne(x => x.MonitoringPort)
            .WithMany(x => x.TimeSlots)
            .HasForeignKey(x => x.MonitoringPortId)
            .IsRequired(false);
    }
}