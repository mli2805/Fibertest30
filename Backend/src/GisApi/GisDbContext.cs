using Microsoft.EntityFrameworkCore;

namespace GisApi
{
    public class GisDbContextInitializer
    {
        private readonly GisDbContext _gisDbContext;

        public GisDbContextInitializer(GisDbContext gisDbContext)
        {
            _gisDbContext = gisDbContext;
        }

        public async Task InitializeAsync()
        {
            try
            {
                await _gisDbContext.Database.EnsureCreatedAsync();
            }
            catch (Exception e)
            {
                    Console.WriteLine(e);
                    throw;
            }
        }
    }

    public class GisDbContext : DbContext
    {
        public GisDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Tile> Tiles { get; set; }
        public DbSet<TileData> TilesData { get; set; } 
    }

    public class Tile
    {
        public int Id { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int Zoom { get; set; }

        public uint Type { get; set; }
        public DateTime CacheTime { get; set; }
    }

    public class TileData
    {
        public int Id { get; set; }
        public byte[]? Tile { get; set; }
    }
}
