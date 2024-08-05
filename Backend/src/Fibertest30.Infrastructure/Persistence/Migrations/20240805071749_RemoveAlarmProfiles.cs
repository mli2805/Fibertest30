using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fibertest30.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAlarmProfiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MonitoringPort_AlarmProfile_AlarmProfileId",
                table: "MonitoringPort");

            migrationBuilder.DropTable(
                name: "Threshold");

            migrationBuilder.DropTable(
                name: "AlarmProfile");

            migrationBuilder.DropIndex(
                name: "IX_MonitoringPort_AlarmProfileId",
                table: "MonitoringPort");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AlarmProfile",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlarmProfile", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Threshold",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    AlarmProfileId = table.Column<int>(type: "INTEGER", nullable: false),
                    Critical = table.Column<double>(type: "REAL", nullable: true),
                    IsCriticalOn = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsMajorOn = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsMinorOn = table.Column<bool>(type: "INTEGER", nullable: false),
                    Major = table.Column<double>(type: "REAL", nullable: true),
                    Minor = table.Column<double>(type: "REAL", nullable: true),
                    Parameter = table.Column<string>(type: "TEXT", unicode: false, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Threshold", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Threshold_AlarmProfile_AlarmProfileId",
                        column: x => x.AlarmProfileId,
                        principalTable: "AlarmProfile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MonitoringPort_AlarmProfileId",
                table: "MonitoringPort",
                column: "AlarmProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_Threshold_AlarmProfileId",
                table: "Threshold",
                column: "AlarmProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_MonitoringPort_AlarmProfile_AlarmProfileId",
                table: "MonitoringPort",
                column: "AlarmProfileId",
                principalTable: "AlarmProfile",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
