using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fibertest30.Infrastructure;

public class ThresholdConfiguration : IEntityTypeConfiguration<ThresholdEf>
{
    public void Configure(EntityTypeBuilder<ThresholdEf> builder)
    {
        builder.ToTable("Threshold");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Parameter)
            .HasConversion(
                v =>  v.ToString(), 
                v => (ThresholdParameter)Enum.Parse(typeof(ThresholdParameter), v))
            .IsUnicode(false)
            .IsRequired();

        builder.Property(x => x.Minor).IsRequired(false);
        builder.Property(x => x.IsMinorOn).IsRequired();
        builder.Property(x => x.Major).IsRequired(false);
        builder.Property(x => x.IsMajorOn).IsRequired();
        builder.Property(x => x.Critical).IsRequired(false);
        builder.Property(x => x.IsCriticalOn).IsRequired();

        builder.HasOne<AlarmProfileEf>()
            .WithMany(x=>x.Thresholds)
            .HasForeignKey(x=>x.AlarmProfileId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
    }
}