using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fibertest30.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAlarmProfiles2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlarmProfileId",
                table: "MonitoringPort");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AlarmProfileId",
                table: "MonitoringPort",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }
    }
}
