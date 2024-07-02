using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fibertest30.Infrastructure;

public class OtauPortConfiguration : IEntityTypeConfiguration<OtauPortEf>
{
    public void Configure(EntityTypeBuilder<OtauPortEf> builder)
    {
        builder.ToTable("OtauPort");
       
        builder.HasKey(e => e.Id);

        builder.Property(x => x.Unavailable)
            .HasDefaultValue(false);
        
        builder.HasOne(x => x.MonitoringPort)
            .WithOne(x => x.OtauPort)
            .HasForeignKey<OtauPortEf>(x => x.MonitoringPortId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasIndex(op => new { op.OtauId, op.PortIndex }).IsUnique();
    }
}