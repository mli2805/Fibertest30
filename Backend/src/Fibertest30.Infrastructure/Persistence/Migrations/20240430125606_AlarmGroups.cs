using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fibertest30.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AlarmGroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MonitoringAlarmGroupId",
                table: "AlarmEvent",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AlarmGroupId",
                table: "Alarm",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AlarmGroupId",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Stub = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlarmGroupId", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AlarmGroupId_Stub",
                table: "AlarmGroupId",
                column: "Stub",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlarmGroupId");

            migrationBuilder.DropColumn(
                name: "MonitoringAlarmGroupId",
                table: "AlarmEvent");

            migrationBuilder.DropColumn(
                name: "AlarmGroupId",
                table: "Alarm");
        }
    }
}
