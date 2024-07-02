namespace Iit.Fibertest.Graph
{
    public interface IMachineKeyProvider
    {
        string Get();
    }
    public class MachineKeyProvider : IMachineKeyProvider
    {
        public string Get()
        {
            var cpuId = GetCpuId();
            var mbSerial = GetMotherBoardSerial();
            var ddSerial = GetDiskDriveSerial();
            return cpuId + mbSerial + ddSerial;
        }

        private string GetCpuId()
        {
            
            return @"SomeCpuId";
        }

        private static string GetMotherBoardSerial()
        {
            
            return @"SomeMotherBoardSerial";
        }  
        
        private static string GetDiskDriveSerial()
        {
           
            return @"SomeDiskDriveSerial";
        }
    }
}
