using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fibertest30.Infrastructure;

public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.Property(b => b.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(b => b.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(b => b.JobTitle)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(b => b.ZoneId)
            .IsRequired()
            .HasMaxLength(36);
    }
}