namespace Fibertest30.Application;

public static class ScheduledPortExtension
{
   public static List<ScheduledPort> ToScheduledPorts(this IEnumerable<MonitoringPort> ports)
   {
       var scheduledPorts = ports.Select(x => x.ToScheduledPort()).ToList();
       return scheduledPorts;
   }

   public static ScheduledPort ToScheduledPort(this MonitoringPort port)
   {
       // TODO: fill testTime after baseline setup is done
       var testTime = TimeSpan.FromMinutes(1);
       
       switch (port.Mode)
       {
           case MonitoringSchedulerMode.RoundRobin:
               return new RoundRobinPort(port.Id, testTime, port.LastRun);
           case MonitoringSchedulerMode.FixedTimeSlot:
               var timeSlots = port.TimeSlots.Select(x => new TimeSlot(x.StartTime, x.EndTime)).ToList();
               return new FixedTimeSlotPort(port.Id, testTime, timeSlots , port.LastRun);
           case MonitoringSchedulerMode.AtLeastOnceIn:
               if (port.Interval == null)
               {
                   throw new ArgumentException($"{nameof(port.Interval)} must be set for {nameof(MonitoringSchedulerMode.AtLeastOnceIn)}");
               }
               return new AtLeastOnceInPort(port.Id, testTime, port.Interval.Value, port.LastRun);
           default:
               throw new ArgumentOutOfRangeException($"Unknown {nameof(MonitoringSchedulerMode)}: {port.Mode}");
       }
   }
}