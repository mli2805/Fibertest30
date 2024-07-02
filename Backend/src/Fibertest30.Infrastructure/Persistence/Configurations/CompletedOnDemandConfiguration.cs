using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json;

namespace Fibertest30.Infrastructure;

public class CompletedOnDemandConfiguration : IEntityTypeConfiguration<CompletedOnDemand>
{
    public void Configure(EntityTypeBuilder<CompletedOnDemand> builder)
    {
        builder.ToTable("OnDemand");
        
        builder.HasKey(x => x.Id);
        builder.Property(x => x.CreatedAt).IsRequired();
        builder.Property(x => x.StartedAt).IsRequired();
        builder.Property(x => x.CompletedAt).IsRequired();
        
        builder.HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
        
        builder.Property(x => x.MeasurementSettings)
            .HasConversion(
                v => JsonSerializer.Serialize(v, JsonSerializerEx.SerializerOptions),
                v => JsonSerializer.Deserialize<MeasurementSettings>(v, JsonSerializerEx.SerializerOptions)!)
            .HasColumnType("TEXT");

        builder.HasOne<MonitoringPortEf>()
            .WithMany()
            .HasForeignKey(x => x.MonitoringPortId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
    }
}