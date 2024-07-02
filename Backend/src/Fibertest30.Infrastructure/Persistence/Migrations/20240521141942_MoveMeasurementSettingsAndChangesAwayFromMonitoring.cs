﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fibertest30.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class MoveMeasurementSettingsAndChangesAwayFromMonitoring : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Changes",
                table: "Monitoring");

            migrationBuilder.DropColumn(
                name: "MeasurementSettings",
                table: "Monitoring");

            migrationBuilder.AddColumn<string>(
                name: "Changes",
                table: "MonitoringSor",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MeasurementSettings",
                table: "MonitoringSor",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ChangesCount",
                table: "Monitoring",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MostSevereChangeLevel",
                table: "Monitoring",
                type: "INTEGER",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Changes",
                table: "MonitoringSor");

            migrationBuilder.DropColumn(
                name: "MeasurementSettings",
                table: "MonitoringSor");

            migrationBuilder.DropColumn(
                name: "ChangesCount",
                table: "Monitoring");

            migrationBuilder.DropColumn(
                name: "MostSevereChangeLevel",
                table: "Monitoring");

            migrationBuilder.AddColumn<string>(
                name: "Changes",
                table: "Monitoring",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MeasurementSettings",
                table: "Monitoring",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
