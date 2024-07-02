using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Fibertest30.Infrastructure;

public class CompletedOnDemandSorConfiguration : IEntityTypeConfiguration<CompletedOnDemandSor>
{
    public void Configure(EntityTypeBuilder<CompletedOnDemandSor> builder)
    {
        builder.ToTable("OnDemandSor");
        
        builder.HasKey(x => x.Id);

        builder.HasOne<CompletedOnDemand>() 
            .WithOne(c => c.Sor) 
            .HasForeignKey<CompletedOnDemandSor>(s => s.Id)
            .OnDelete(DeleteBehavior.Cascade);
    }
}