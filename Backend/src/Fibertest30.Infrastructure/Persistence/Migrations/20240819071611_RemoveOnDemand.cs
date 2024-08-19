using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fibertest30.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveOnDemand : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OnDemandSor");

            migrationBuilder.DropTable(
                name: "OnDemand");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OnDemand",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedByUserId = table.Column<string>(type: "TEXT", nullable: false),
                    MeasurementSettings = table.Column<string>(type: "TEXT", nullable: false),
                    MonitoringPortId = table.Column<int>(type: "INTEGER", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OnDemand", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OnDemand_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OnDemand_MonitoringPort_MonitoringPortId",
                        column: x => x.MonitoringPortId,
                        principalTable: "MonitoringPort",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OnDemandSor",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Data = table.Column<byte[]>(type: "BLOB", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OnDemandSor", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OnDemandSor_OnDemand_Id",
                        column: x => x.Id,
                        principalTable: "OnDemand",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OnDemand_CreatedByUserId",
                table: "OnDemand",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_OnDemand_MonitoringPortId",
                table: "OnDemand",
                column: "MonitoringPortId");
        }
    }
}
