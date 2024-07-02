using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fibertest30.Infrastructure;

public class AlarmProfileConfiguration : IEntityTypeConfiguration<AlarmProfileEf>
{
    public void Configure(EntityTypeBuilder<AlarmProfileEf> builder)
    {
        builder.ToTable("AlarmProfile");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).IsRequired();
    }
}