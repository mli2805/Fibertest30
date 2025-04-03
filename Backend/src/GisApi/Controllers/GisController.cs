using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace GisApi.Controllers;

[ApiController]
[Route("[controller]")]
public class GisController : ControllerBase
{
    private readonly GisDbContext _gisDbContext;

    public GisController(GisDbContext gisDbContext)
    {
        _gisDbContext = gisDbContext;
    }

    [HttpGet("{x}/{y}/{z}"), ActionName("GetTile")]
    public async Task GetTile(int x, int y, int z)
    {
        Debug.WriteLine($"Tile (x={x}, y={y}, zoom={z}) requested");
        var tile = _gisDbContext.Tiles.FirstOrDefault(t => t.X == x && t.Y == y && t.Zoom == z);
        if (tile == null)
        {
            Debug.WriteLine("Tile not found");
            Response.StatusCode = 404;
            return ;
        }
        var data = _gisDbContext.TilesData.FirstOrDefault(d => d.Id == tile.Id);
        if (data == null)
        {
            Debug.WriteLine("Tile not found");
            Response.StatusCode = 404;
            return ;
        }

        Response.ContentType = "image/png";
        Response.StatusCode = 200;
        await Response.Body.WriteAsync(data.Tile);
    }

   

}