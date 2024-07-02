﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fibertest30.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddMonitoringPortNote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "MonitoringPort",
                type: "TEXT",
                maxLength: 1000,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Note",
                table: "MonitoringPort");
        }
    }
}
