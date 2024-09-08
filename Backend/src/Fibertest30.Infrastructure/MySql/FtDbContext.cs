using Iit.Fibertest.Dto;
using Microsoft.EntityFrameworkCore;
// ReSharper disable InconsistentNaming

namespace Fibertest30.Infrastructure;
public class FtDbContext : DbContext
{
    public FtDbContext()  { }
    public FtDbContext(DbContextOptions<FtDbContext> options) : base(options) { }


#pragma warning disable VSSpell001 // Spell Check
    public DbSet<RtuStation> rtustations { get; set; }
#pragma warning restore VSSpell001 // Spell Check
    public DbSet<SorFile> sorFiles { get; set; }
    public DbSet<Snapshot> snapshots { get; set; }

}
