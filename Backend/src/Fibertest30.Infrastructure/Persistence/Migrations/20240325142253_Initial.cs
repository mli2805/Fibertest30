using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Fibertest30.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    FirstName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    JobTitle = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    UserName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "TEXT", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: true),
                    SecurityStamp = table.Column<string>(type: "TEXT", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "TEXT", nullable: true),
                    PhoneNumber = table.Column<string>(type: "TEXT", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "INTEGER", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "TEXT", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "INTEGER", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NotificationSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    EmailServer = table.Column<string>(type: "TEXT", nullable: false),
                    TrapReceiver = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Otau",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Type = table.Column<string>(type: "TEXT", unicode: false, nullable: false),
                    OcmPortIndex = table.Column<int>(type: "INTEGER", nullable: false),
                    PortCount = table.Column<int>(type: "INTEGER", nullable: false),
                    SerialNumber = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Location = table.Column<string>(type: "TEXT", nullable: false),
                    Rack = table.Column<string>(type: "TEXT", nullable: false),
                    Shelf = table.Column<string>(type: "TEXT", nullable: false),
                    Note = table.Column<string>(type: "TEXT", nullable: false),
                    JsonData = table.Column<string>(type: "TEXT", nullable: false),
                    OnlineAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    OfflineAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Otau", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Threshold",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Parameter = table.Column<string>(type: "TEXT", unicode: false, nullable: false),
                    IsMinorOn = table.Column<bool>(type: "INTEGER", nullable: false),
                    Minor = table.Column<double>(type: "REAL", nullable: true),
                    IsMajorOn = table.Column<bool>(type: "INTEGER", nullable: false),
                    Major = table.Column<double>(type: "REAL", nullable: true),
                    IsCriticalOn = table.Column<bool>(type: "INTEGER", nullable: false),
                    Critical = table.Column<double>(type: "REAL", nullable: true),
                    AlarmProfileId = table.Column<int>(type: "INTEGER", nullable: false)
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

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RoleId = table.Column<string>(type: "TEXT", nullable: false),
                    ClaimType = table.Column<string>(type: "TEXT", nullable: true),
                    ClaimValue = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    ClaimType = table.Column<string>(type: "TEXT", nullable: true),
                    ClaimValue = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "TEXT", nullable: false),
                    ProviderKey = table.Column<string>(type: "TEXT", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "TEXT", nullable: true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    RoleId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    LoginProvider = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SystemEvent",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Type = table.Column<string>(type: "TEXT", unicode: false, nullable: false),
                    Level = table.Column<string>(type: "TEXT", unicode: false, nullable: false),
                    JsonData = table.Column<string>(type: "TEXT", nullable: false),
                    At = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UserId = table.Column<string>(type: "TEXT", nullable: true),
                    Source = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemEvent", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SystemEvent_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserSettings",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    Theme = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Language = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Timezone = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    DateTimeFormat = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSettings", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_UserSettings_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserSystemNotification",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    SystemEventId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSystemNotification", x => new { x.UserId, x.SystemEventId });
                    table.ForeignKey(
                        name: "FK_UserSystemNotification_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserSystemNotification_SystemEvent_SystemEventId",
                        column: x => x.SystemEventId,
                        principalTable: "SystemEvent",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Alarm",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MonitoringPortId = table.Column<int>(type: "INTEGER", nullable: false),
                    MonitoringResultId = table.Column<int>(type: "INTEGER", nullable: false),
                    LastChangedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ActiveAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ResolvedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Type = table.Column<string>(type: "TEXT", unicode: false, nullable: false),
                    Level = table.Column<string>(type: "TEXT", unicode: false, nullable: false),
                    Status = table.Column<string>(type: "TEXT", unicode: false, nullable: false),
                    DistanceMeters = table.Column<double>(type: "REAL", nullable: true),
                    Change = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alarm", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AlarmEvent",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MonitoringPortId = table.Column<int>(type: "INTEGER", nullable: false),
                    MonitoringAlarmId = table.Column<int>(type: "INTEGER", nullable: false),
                    MonitoringResultId = table.Column<int>(type: "INTEGER", nullable: false),
                    Type = table.Column<string>(type: "TEXT", unicode: false, nullable: false),
                    DistanceMeters = table.Column<double>(type: "REAL", nullable: true),
                    At = table.Column<DateTime>(type: "TEXT", nullable: false),
                    OldStatus = table.Column<string>(type: "TEXT", unicode: false, nullable: true),
                    NewStatus = table.Column<string>(type: "TEXT", unicode: false, nullable: true),
                    OldLevel = table.Column<string>(type: "TEXT", unicode: false, nullable: true),
                    Level = table.Column<string>(type: "TEXT", unicode: false, nullable: false),
                    Change = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlarmEvent", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AlarmEvent_Alarm_MonitoringAlarmId",
                        column: x => x.MonitoringAlarmId,
                        principalTable: "Alarm",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserAlarmNotification",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    AlarmEventId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAlarmNotification", x => new { x.UserId, x.AlarmEventId });
                    table.ForeignKey(
                        name: "FK_UserAlarmNotification_AlarmEvent_AlarmEventId",
                        column: x => x.AlarmEventId,
                        principalTable: "AlarmEvent",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserAlarmNotification_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Baseline",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MonitoringPortId = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedByUserId = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    MeasurementSettings = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Baseline", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Baseline_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "BaselineSor",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false),
                    Data = table.Column<byte[]>(type: "BLOB", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaselineSor", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BaselineSor_Baseline_Id",
                        column: x => x.Id,
                        principalTable: "Baseline",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MonitoringPort",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    BaselineId = table.Column<int>(type: "INTEGER", nullable: true),
                    Status = table.Column<string>(type: "TEXT", unicode: false, nullable: false),
                    SchedulerMode = table.Column<string>(type: "TEXT", unicode: false, nullable: false),
                    Interval = table.Column<TimeSpan>(type: "TEXT", nullable: true),
                    LastRun = table.Column<DateTime>(type: "TEXT", nullable: true),
                    AlarmProfileId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MonitoringPort", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MonitoringPort_AlarmProfile_AlarmProfileId",
                        column: x => x.AlarmProfileId,
                        principalTable: "AlarmProfile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MonitoringPort_Baseline_BaselineId",
                        column: x => x.BaselineId,
                        principalTable: "Baseline",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Monitoring",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MonitoringPortId = table.Column<int>(type: "INTEGER", nullable: false),
                    BaselineId = table.Column<int>(type: "INTEGER", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    MeasurementSettings = table.Column<string>(type: "TEXT", nullable: false),
                    Changes = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Monitoring", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Monitoring_Baseline_BaselineId",
                        column: x => x.BaselineId,
                        principalTable: "Baseline",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Monitoring_MonitoringPort_MonitoringPortId",
                        column: x => x.MonitoringPortId,
                        principalTable: "MonitoringPort",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MonitoringTimeSlot",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MonitoringPortId = table.Column<int>(type: "INTEGER", nullable: true),
                    StartTime = table.Column<string>(type: "TEXT", nullable: false),
                    EndTime = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MonitoringTimeSlot", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MonitoringTimeSlot_MonitoringPort_MonitoringPortId",
                        column: x => x.MonitoringPortId,
                        principalTable: "MonitoringPort",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "OnDemand",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedByUserId = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    MonitoringPortId = table.Column<int>(type: "INTEGER", nullable: false),
                    MeasurementSettings = table.Column<string>(type: "TEXT", nullable: false)
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
                name: "OtauPort",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OtauId = table.Column<int>(type: "INTEGER", nullable: false),
                    MonitoringPortId = table.Column<int>(type: "INTEGER", nullable: false),
                    PortIndex = table.Column<int>(type: "INTEGER", nullable: false),
                    Unavailable = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OtauPort", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OtauPort_MonitoringPort_MonitoringPortId",
                        column: x => x.MonitoringPortId,
                        principalTable: "MonitoringPort",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OtauPort_Otau_OtauId",
                        column: x => x.OtauId,
                        principalTable: "Otau",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MonitoringSor",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false),
                    Data = table.Column<byte[]>(type: "BLOB", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MonitoringSor", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MonitoringSor_Monitoring_Id",
                        column: x => x.Id,
                        principalTable: "Monitoring",
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
                name: "IX_Alarm_MonitoringPortId",
                table: "Alarm",
                column: "MonitoringPortId");

            migrationBuilder.CreateIndex(
                name: "IX_Alarm_MonitoringResultId",
                table: "Alarm",
                column: "MonitoringResultId");

            migrationBuilder.CreateIndex(
                name: "IX_AlarmEvent_MonitoringAlarmId",
                table: "AlarmEvent",
                column: "MonitoringAlarmId");

            migrationBuilder.CreateIndex(
                name: "IX_AlarmEvent_MonitoringPortId",
                table: "AlarmEvent",
                column: "MonitoringPortId");

            migrationBuilder.CreateIndex(
                name: "IX_AlarmEvent_MonitoringResultId",
                table: "AlarmEvent",
                column: "MonitoringResultId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Baseline_CreatedByUserId",
                table: "Baseline",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Baseline_MonitoringPortId",
                table: "Baseline",
                column: "MonitoringPortId");

            migrationBuilder.CreateIndex(
                name: "IX_Monitoring_BaselineId",
                table: "Monitoring",
                column: "BaselineId");

            migrationBuilder.CreateIndex(
                name: "IX_Monitoring_MonitoringPortId",
                table: "Monitoring",
                column: "MonitoringPortId");

            migrationBuilder.CreateIndex(
                name: "IX_MonitoringPort_AlarmProfileId",
                table: "MonitoringPort",
                column: "AlarmProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_MonitoringPort_BaselineId",
                table: "MonitoringPort",
                column: "BaselineId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MonitoringTimeSlot_MonitoringPortId",
                table: "MonitoringTimeSlot",
                column: "MonitoringPortId");

            migrationBuilder.CreateIndex(
                name: "IX_OnDemand_CreatedByUserId",
                table: "OnDemand",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_OnDemand_MonitoringPortId",
                table: "OnDemand",
                column: "MonitoringPortId");

            migrationBuilder.CreateIndex(
                name: "IX_OtauPort_MonitoringPortId",
                table: "OtauPort",
                column: "MonitoringPortId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OtauPort_OtauId_PortIndex",
                table: "OtauPort",
                columns: new[] { "OtauId", "PortIndex" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SystemEvent_UserId",
                table: "SystemEvent",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Threshold_AlarmProfileId",
                table: "Threshold",
                column: "AlarmProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_UserAlarmNotification_AlarmEventId",
                table: "UserAlarmNotification",
                column: "AlarmEventId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSystemNotification_SystemEventId",
                table: "UserSystemNotification",
                column: "SystemEventId");

            migrationBuilder.AddForeignKey(
                name: "FK_Alarm_MonitoringPort_MonitoringPortId",
                table: "Alarm",
                column: "MonitoringPortId",
                principalTable: "MonitoringPort",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Alarm_Monitoring_MonitoringResultId",
                table: "Alarm",
                column: "MonitoringResultId",
                principalTable: "Monitoring",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AlarmEvent_MonitoringPort_MonitoringPortId",
                table: "AlarmEvent",
                column: "MonitoringPortId",
                principalTable: "MonitoringPort",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AlarmEvent_Monitoring_MonitoringResultId",
                table: "AlarmEvent",
                column: "MonitoringResultId",
                principalTable: "Monitoring",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Baseline_MonitoringPort_MonitoringPortId",
                table: "Baseline",
                column: "MonitoringPortId",
                principalTable: "MonitoringPort",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Baseline_MonitoringPort_MonitoringPortId",
                table: "Baseline");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "BaselineSor");

            migrationBuilder.DropTable(
                name: "MonitoringSor");

            migrationBuilder.DropTable(
                name: "MonitoringTimeSlot");

            migrationBuilder.DropTable(
                name: "NotificationSettings");

            migrationBuilder.DropTable(
                name: "OnDemandSor");

            migrationBuilder.DropTable(
                name: "OtauPort");

            migrationBuilder.DropTable(
                name: "Threshold");

            migrationBuilder.DropTable(
                name: "UserAlarmNotification");

            migrationBuilder.DropTable(
                name: "UserSettings");

            migrationBuilder.DropTable(
                name: "UserSystemNotification");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "OnDemand");

            migrationBuilder.DropTable(
                name: "Otau");

            migrationBuilder.DropTable(
                name: "AlarmEvent");

            migrationBuilder.DropTable(
                name: "SystemEvent");

            migrationBuilder.DropTable(
                name: "Alarm");

            migrationBuilder.DropTable(
                name: "Monitoring");

            migrationBuilder.DropTable(
                name: "MonitoringPort");

            migrationBuilder.DropTable(
                name: "AlarmProfile");

            migrationBuilder.DropTable(
                name: "Baseline");

            migrationBuilder.DropTable(
                name: "AspNetUsers");
        }
    }
}
