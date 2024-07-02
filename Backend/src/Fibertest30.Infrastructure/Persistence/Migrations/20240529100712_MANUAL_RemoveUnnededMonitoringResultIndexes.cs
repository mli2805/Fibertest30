using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable


// NOTE: This is a fully manual migration (hence the MANUAL_ prefix),
// so this migration should be kept if we decide to squash migrations in the future.


namespace Fibertest30.Infrastructure.Persistence.Migrations
{
    public partial class MANUAL_RemoveUnnededMonitoringResultIndexes : Migration
    {
        protected override void Up(MigrationBuilder builder)
        {
            // EF automatically creates an index for each foreign key.
            
            // For the Monitoring talbe, we created a composite index (CompleteAt, MonitoringPortId) 
            // to be used in our queries, as we always going to use some datatime search window,
            // and load next page starting from last loaded item's datetime.
            
            // Unfortunatelly, sqlite chooses IX_Monitoring_MonitoringPortId as the index to use
            // until Analyze is run on the table.
            
            // While we should run Analyze from time to time in any case, we really don't need 
            // IX_Monitoring_MonitoringPortId and IX_Monitoring_BaselineId indexes. They are not selective at all.
            
            builder.DropIndex("IX_Monitoring_MonitoringPortId");
            builder.DropIndex("IX_Monitoring_BaselineId");
        }

        protected override void Down(MigrationBuilder builder)
        {
            // don't need to restore indexes.
        }
    }
}
