using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fibertest30.Infrastructure;

public class UserSystemNotificationConfiguration : IEntityTypeConfiguration<UserSystemNotificationEf>
{
    public void Configure(EntityTypeBuilder<UserSystemNotificationEf> builder)
    {
        builder.ToTable("UserSystemNotification");
        
        builder.HasKey(un => new { un.UserId, un.SystemEventId });
    }
}