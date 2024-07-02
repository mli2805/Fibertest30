using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fibertest30.Infrastructure;

public class OtauConfiguration : IEntityTypeConfiguration<OtauEf>
{
    public void Configure(EntityTypeBuilder<OtauEf> builder)
    {
        builder.ToTable("Otau");
        
        builder.HasKey(e => e.Id);
        
        builder.Property(e => e.Type)
            .HasConversion(
                v =>  v.ToString(), 
                v => (OtauType)Enum.Parse(typeof(OtauType), v))
            .IsUnicode(false)
            .IsRequired();

        builder.Property(e => e.OcmPortIndex).IsRequired();
        builder.Property(e => e.PortCount).IsRequired();
        builder.Property(e => e.SerialNumber).IsRequired();
        builder.Property(e => e.JsonData).IsRequired();

        builder.Property(e => e.Name).IsRequired();
        builder.Property(e => e.Location).IsRequired();
        builder.Property(e => e.Rack).IsRequired();
        builder.Property(e => e.Shelf).IsRequired();
        builder.Property(e => e.Note).IsRequired();

        builder.Property(e => e.OnlineAt).IsRequired(false);
        builder.Property(e => e.OfflineAt).IsRequired(false);

        builder.HasMany(x => x.Ports)
            .WithOne(x => x.Otau)
            .HasForeignKey(x => x.OtauId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}