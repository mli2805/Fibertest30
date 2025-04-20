using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fibertest30.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class LatLngFormat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LatLngFormat",
                table: "UserSettings",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LatLngFormat",
                table: "UserSettings");
        }
    }
}
