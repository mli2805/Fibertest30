using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fibertest30.Infrastructure;

public class SystemEventConfiguration : IEntityTypeConfiguration<SystemEventEf>
{
    public void Configure(EntityTypeBuilder<SystemEventEf> builder)
    {
        builder.ToTable("SystemEvent");
        
        builder.HasKey(e => e.Id);
        
        builder.Property(e => e.Type)
            .HasConversion(
                v =>  v.ToString(), 
                v => (SystemEventType)Enum.Parse(typeof(SystemEventType), v))
            .IsUnicode(false)
            .IsRequired();
        
        builder.Property(e => e.Level)
            .HasConversion(
                v =>  v.ToString(), 
                v => (SystemEventLevel)Enum.Parse(typeof(SystemEventLevel), v))
            .IsUnicode(false)
            .IsRequired();
        
        builder.Property(e => e.JsonData).IsRequired();
        builder.Property(e => e.At).IsRequired();

        builder.HasOne<ApplicationUser>()
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired(false);
        
        builder.Property(e => e.Source).IsRequired(false);
    }
}