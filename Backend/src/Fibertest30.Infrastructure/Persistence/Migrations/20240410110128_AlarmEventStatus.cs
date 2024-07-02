using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fibertest30.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AlarmEventStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "AlarmEvent",
                type: "TEXT",
                unicode: false,
                nullable: false,
                defaultValue: "Active");

            migrationBuilder.Sql("UPDATE AlarmEvent SET Status = NewStatus WHERE NewStatus IS NOT NULL");
            
            migrationBuilder.DropColumn(
                name: "NewStatus",
                table: "AlarmEvent");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "AlarmEvent");

            migrationBuilder.AddColumn<string>(
                name: "NewStatus",
                table: "AlarmEvent",
                type: "TEXT",
                unicode: false,
                nullable: true);
        }
    }
}
