using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fibertest30.Infrastructure;

public class PortLabelConfiguration : IEntityTypeConfiguration<PortLabelEf>
{
    public void Configure(EntityTypeBuilder<PortLabelEf> builder)
    {
        builder.ToTable("PortLabel");
        
        builder.HasKey(e => e.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(x => x.Name)
            .IsUnique();

        builder.Property(x => x.HexColor)
            .IsRequired()
            .HasMaxLength(7);

         builder
             .HasMany(p => p.PortLabelMonitoringPorts)
             .WithOne(x => x.PortLabel) 
             .HasForeignKey(pt => pt.PortLabelId) 
             .IsRequired();

         builder.HasMany(p => p.MonitoringPorts)
             .WithMany(t => t.PortLabels)
             .UsingEntity<PortLabelMonitoringPortEf>();
    }
}

public class PortLabelMonitoringPortConfiguration : IEntityTypeConfiguration<PortLabelMonitoringPortEf>
{
    public void Configure(EntityTypeBuilder<PortLabelMonitoringPortEf> builder)
    {
        builder.ToTable("PortLabelMonitoringPort");

        builder.HasKey(x => new { x.PortLabelId, x.MonitoringPortId });
    }
}