using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Fibertest30.Infrastructure;

public class MonitoringResultSorConfiguration : IEntityTypeConfiguration<MonitoringResultSor>
{
    public void Configure(EntityTypeBuilder<MonitoringResultSor> builder)
    {
        builder.ToTable("MonitoringSor");
        
        builder.HasKey(x => x.Id);

        builder.HasOne<MonitoringResult>() 
            .WithOne(c => c.Sor) 
            .HasForeignKey<MonitoringResultSor>(s => s.Id)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.Property(x => x.MeasurementSettings)
            .HasConversion(
                v => JsonSerializer.Serialize(v, JsonSerializerEx.SerializerOptions),
                v => JsonSerializer.Deserialize<MeasurementSettings>(v, JsonSerializerEx.SerializerOptions)!)
            .HasColumnType("TEXT");
        
        var valueComparer = new ValueComparer<List<MonitoringChange>>(
            (c1, c2) => c1!.SequenceEqual(c2!),
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
            c => c.ToList());
        
        builder.Property(x => x.Changes)
            .HasConversion(
                v => JsonSerializer.Serialize(v, JsonSerializerEx.SerializerOptions),
                v => JsonSerializer.Deserialize<List<MonitoringChange>>(v, JsonSerializerEx.SerializerOptions)!)
            .HasColumnType("TEXT")
            .Metadata.SetValueComparer(valueComparer);
    }
}