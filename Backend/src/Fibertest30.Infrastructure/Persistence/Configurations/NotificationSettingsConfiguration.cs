using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Fibertest30.Infrastructure.Persistence.Entities;

namespace Fibertest30.Infrastructure;

public class NotificationSettingsConfiguration : IEntityTypeConfiguration<NotificationSettingsEf>
{
    public void Configure(EntityTypeBuilder<NotificationSettingsEf> builder)
    {
        builder.ToTable("NotificationSettings");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.EmailServer).IsRequired();
        builder.Property(x => x.TrapReceiver).IsRequired();
    }
}