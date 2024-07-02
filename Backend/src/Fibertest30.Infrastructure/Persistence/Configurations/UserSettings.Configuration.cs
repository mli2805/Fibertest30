using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fibertest30.Infrastructure;

public class UserSettingsConfiguration : IEntityTypeConfiguration<UserSettings>
{
    public void Configure(EntityTypeBuilder<UserSettings> builder)
    {
        builder.ToTable("UserSettings");

        builder.HasKey(x => x.UserId);

        builder.Property(b => b.Theme)
            .HasMaxLength(100);

        builder.Property(b => b.Language)
            .HasMaxLength(100);
        
        builder.Property(b => b.DateTimeFormat)
            .HasMaxLength(100);
        
        builder
            .HasOne(us => us.User)
            .WithOne(u => u.UserSettings)
            .HasForeignKey<UserSettings>(us => us.UserId);
    }
}