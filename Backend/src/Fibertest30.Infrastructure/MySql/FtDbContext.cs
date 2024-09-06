using Iit.Fibertest.Dto;
using Microsoft.EntityFrameworkCore;
// ReSharper disable InconsistentNaming

namespace Fibertest30.Infrastructure;
public class FtDbContext : DbContext
{
    public FtDbContext()  { }
    public FtDbContext(DbContextOptions<FtDbContext> options) : base(options) { }


    public DbSet<RtuStation> rtustations { get; set; }
    public DbSet<SorFile> sorFiles { get; set; }
    public DbSet<Snapshot> snapshots { get; set; }

}
