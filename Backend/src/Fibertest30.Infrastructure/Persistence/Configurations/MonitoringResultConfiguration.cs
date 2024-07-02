using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fibertest30.Infrastructure;

public class MonitoringResultConfiguration : IEntityTypeConfiguration<MonitoringResult>
{
    public void Configure(EntityTypeBuilder<MonitoringResult> builder)
    {
        builder.ToTable("Monitoring");
        
        builder.HasKey(x => x.Id);
        builder.Property(x => x.CompletedAt).IsRequired();
        builder.HasIndex(x => new {x.CompletedAt, x.MonitoringPortId });
        
        builder.Property(e => e.MostSevereChangeLevel).IsRequired(false);
        builder.Property(e => e.ChangesCount).IsRequired();

        builder.Ignore(x => x.MeasurementSettings);
        builder.Ignore(x => x.Changes);

        builder.HasOne<MonitoringPortEf>()
            .WithMany()
            .HasForeignKey(x => x.MonitoringPortId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        builder.HasOne<MonitoringBaselineEf>()
            .WithMany()
            .HasForeignKey(x => x.BaselineId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
    }
}