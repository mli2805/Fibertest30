using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fibertest30.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddPortLables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PortLabel",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    HexColor = table.Column<string>(type: "TEXT", maxLength: 7, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PortLabel", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PortLabelMonitoringPort",
                columns: table => new
                {
                    PortLabelId = table.Column<int>(type: "INTEGER", nullable: false),
                    MonitoringPortId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PortLabelMonitoringPort", x => new { x.PortLabelId, x.MonitoringPortId });
                    table.ForeignKey(
                        name: "FK_PortLabelMonitoringPort_MonitoringPort_MonitoringPortId",
                        column: x => x.MonitoringPortId,
                        principalTable: "MonitoringPort",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PortLabelMonitoringPort_PortLabel_PortLabelId",
                        column: x => x.PortLabelId,
                        principalTable: "PortLabel",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PortLabel_Name",
                table: "PortLabel",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PortLabelMonitoringPort_MonitoringPortId",
                table: "PortLabelMonitoringPort",
                column: "MonitoringPortId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PortLabelMonitoringPort");

            migrationBuilder.DropTable(
                name: "PortLabel");
        }
    }
}
