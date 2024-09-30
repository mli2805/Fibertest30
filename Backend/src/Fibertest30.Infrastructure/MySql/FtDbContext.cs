﻿using Iit.Fibertest.Dto;
using Microsoft.EntityFrameworkCore;

namespace Fibertest30.Infrastructure;
public class FtDbContext : DbContext
{
    public FtDbContext()  { }
    public FtDbContext(DbContextOptions<FtDbContext> options) : base(options) { }


    public DbSet<RtuStation> RtuStations { get; set; }
    public DbSet<SorFile> SorFiles { get; set; }
    public DbSet<Snapshot> Snapshots { get; set; }

}
