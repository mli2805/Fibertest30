using System.Runtime.Serialization;

namespace Iit.Fibertest.Dto
{
    [DataContract]
    public class InitializationResult : IDataFromRtu
    {
        [DataMember]
        public DateTime FinishedAt { get; set; }
        [DataMember]
        public RtuInitializedDto Result { get; set; }

        public InitializationResult(RtuInitializedDto result)
        {
            FinishedAt = DateTime.Now;
            Result = result;
        }
    }
}