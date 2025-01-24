using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph
{
    [Serializable]
    public class Rtu
    {
        public Guid Id { get; set; }

        // public string OtauId { get; set; } // in VeEX RTU main OTAU has its own ID
        public string OtdrId { get; set; } = string.Empty; // ditto
        public VeexOtau MainVeexOtau { get; set; } = new(); // in Veex RTU it is a separate unit

        public RtuMaker RtuMaker { get; set; }
        public string Mfid { get; set; } = null!;
        public string Mfsn { get; set; } = null!;
        public string Omid { get; set; } = null!;
        public string Omsn { get; set; } = null!;

        public Guid NodeId { get; set; }
        public string Title { get; set; } = null!;
        public string Comment { get; set; } = string.Empty;

        public NetAddress MainChannel { get; set; } = new(@"", -1);
        public RtuPartState MainChannelState { get; set; }
        public NetAddress ReserveChannel { get; set; } = new("", -1);
        public RtuPartState ReserveChannelState { get; set; }
        public bool IsReserveChannelSet { get; set; }
        public NetAddress OtdrNetAddress { get; set; } = new(@"0.0.0.0", 1500); // real address
        public bool IsAvailable => MainChannelState == RtuPartState.Ok ||
                                   ReserveChannelState == RtuPartState.Ok;
        public bool IsAllRight => MainChannelState != RtuPartState.Broken &&
                                  ReserveChannelState != RtuPartState.Broken;

        // pair OTAU ID - is OK or not
        private Dictionary<Guid, bool> _otauStates = new();
        public void SetOtauState(Guid otauId, bool isOk)
        {
            // if (_otauStates == null)
            //     _otauStates = new Dictionary<Guid, bool>();
            _otauStates[otauId] = isOk;
        }

        public void RemoveOtauState(Guid otauId)
        {
            // if (_otauStates == null)
            //     _otauStates = new Dictionary<Guid, bool>();
            if (_otauStates.ContainsKey(otauId))
                _otauStates.Remove(otauId);
        }

        public RtuPartState BopState
        {
            get
            {
                // if (_otauStates == null)
                //     _otauStates = new Dictionary<Guid, bool>();
                return _otauStates.Count == 0
                    ? RtuPartState.NotSetYet
                    : _otauStates.Any(s => s.Value != true)
                        ? RtuPartState.Broken
                        : RtuPartState.Ok;
            }
        }
        
        public string Serial { get; set; } = string.Empty;
        public int OwnPortCount { get; set; }
        public bool IsInitialized => OwnPortCount != 0;
        public int FullPortCount { get; set; }

        public string PortCount => OwnPortCount == FullPortCount ? $@"{FullPortCount}" : $@"{OwnPortCount} / {FullPortCount}";

        public string Version { get; set; } = String.Empty;
        public string Version2 { get; set; } = string.Empty;

        public Dictionary<int, OtauDto> Children { get; set; } = new();

        public MonitoringState MonitoringState { get; set; }
        public Frequency PreciseMeas { get; set; } = Frequency.EveryHour;
        public Frequency PreciseSave { get; set; } = Frequency.DoNot;
        public Frequency FastSave { get; set; } = Frequency.DoNot;

        public TreeOfAcceptableMeasParams AcceptableMeasParams { get; set; } = new();

        public List<Guid> ZoneIds { get; set; } = new();

    }
}
