using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fibertest30.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SourceMapId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SourceMapId",
                table: "UserSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SourceMapId",
                table: "UserSettings");
        }
    }
}
