using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fibertest30.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCompositeIndexToMonitoringResult : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Monitoring_CompletedAt",
                table: "Monitoring");

            migrationBuilder.CreateIndex(
                name: "IX_Monitoring_CompletedAt_MonitoringPortId",
                table: "Monitoring",
                columns: new[] { "CompletedAt", "MonitoringPortId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Monitoring_CompletedAt_MonitoringPortId",
                table: "Monitoring");

            migrationBuilder.CreateIndex(
                name: "IX_Monitoring_CompletedAt",
                table: "Monitoring",
                column: "CompletedAt");
        }
    }
}
