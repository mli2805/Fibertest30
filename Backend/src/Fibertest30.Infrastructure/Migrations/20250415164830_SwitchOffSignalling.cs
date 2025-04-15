using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fibertest30.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SwitchOffSignalling : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "SwitchOffRtuStatusEventsSignalling",
                table: "UserSettings",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SwitchOffSuspicionSignalling",
                table: "UserSettings",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SwitchOffRtuStatusEventsSignalling",
                table: "UserSettings");

            migrationBuilder.DropColumn(
                name: "SwitchOffSuspicionSignalling",
                table: "UserSettings");
        }
    }
}
