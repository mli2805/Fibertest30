using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fibertest30.Infrastructure;

public class MonitoringBaselineSorConfiguration : IEntityTypeConfiguration<MonitoringBaselineSorEf>
{
    public void Configure(EntityTypeBuilder<MonitoringBaselineSorEf> builder)
    {
        builder.ToTable("BaselineSor");
        
        builder.HasKey(x => x.Id);

        builder.HasOne<MonitoringBaselineEf>() 
            .WithOne(c => c.Sor) 
            .HasForeignKey<MonitoringBaselineSorEf>(s => s.Id)
            .OnDelete(DeleteBehavior.Cascade);
    }
}