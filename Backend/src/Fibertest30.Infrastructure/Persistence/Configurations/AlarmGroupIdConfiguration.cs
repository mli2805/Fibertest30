using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fibertest30.Infrastructure;

public class AlarmGroupIdConfiguration : IEntityTypeConfiguration<AlarmGroupIdEf>
{
    public void Configure(EntityTypeBuilder<AlarmGroupIdEf> builder)
    {
        builder.ToTable("AlarmGroupId");
        builder.HasKey(x => x.Id);
        builder.HasIndex(x => x.Stub).IsUnique();
    }
}