using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fibertest30.Infrastructure;

public class UserAlarmNotificationConfiguration : IEntityTypeConfiguration<UserAlarmNotificationEf>
{
    public void Configure(EntityTypeBuilder<UserAlarmNotificationEf> builder)
    {
        builder.ToTable("UserAlarmNotification");
        
        builder.HasKey(un => new { un.UserId, un.AlarmEventId });
    }
}