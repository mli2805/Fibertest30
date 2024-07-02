using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json;

namespace Fibertest30.Infrastructure;

public class MonitoringBaselineConfiguration : IEntityTypeConfiguration<MonitoringBaselineEf>
{
    public void Configure(EntityTypeBuilder<MonitoringBaselineEf> builder)
    {
        builder.ToTable("Baseline");
        
        builder.HasKey(x => x.Id);
        builder.Property(x => x.CreatedAt).IsRequired();
        
        builder.HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired();
        
        builder.Property(x => x.MeasurementSettings)
            .HasConversion(
                v => JsonSerializer.Serialize(v, JsonSerializerEx.SerializerOptions),
                v => JsonSerializer.Deserialize<MeasurementSettings>(v, JsonSerializerEx.SerializerOptions)!)
            .HasColumnType("TEXT")
            .IsRequired();
        
        builder.HasOne<MonitoringPortEf>()
            .WithMany(x => x.BaselineHistory)
            .HasForeignKey(x => x.MonitoringPortId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
    }
}