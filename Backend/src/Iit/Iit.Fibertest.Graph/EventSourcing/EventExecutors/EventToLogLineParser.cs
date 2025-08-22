using Iit.Fibertest.Dto;
using Iit.Fibertest.StringResources;
using Microsoft.Extensions.Logging;

namespace Iit.Fibertest.Graph
{
    public class EventToLogLineParser
    {
        private readonly ILogger<EventToLogLineParser> _logger;
        private readonly Model _readModel;

        // rtuId - Title
        private Dictionary<Guid, string> _rtuTitles;

        // traceId - <Title, rtuId>
        private Dictionary<Guid, Tuple<string, Guid>> _traces;

        // tceId - Title
        private Dictionary<Guid, string> _tceTitles;

        // SorfileId - Measurement
        private Dictionary<int, MeasurementAdded> _measurements;

        public EventToLogLineParser(ILogger<EventToLogLineParser> logger, Model readModel)
        {
            _logger = logger;
            _readModel = readModel;
            _rtuTitles = new Dictionary<Guid, string>();
            _traces = new Dictionary<Guid, Tuple<string, Guid>>();
            _tceTitles = new Dictionary<Guid, string>();
            _measurements = new Dictionary<int, MeasurementAdded>();
        }

        public LogLine? ParseEventBody(object body)
        {
            switch (body)
            {
                case RtuAtGpsLocationAdded evnt: return Parse(evnt);
                case RtuUpdated evnt: return Parse(evnt);
                case RtuAddressCleared evnt: return Parse(evnt);
                case RtuInitialized evnt: return Parse(evnt);
                case RtuRemoved evnt: return Parse(evnt);

                case TraceAdded evnt: return Parse(evnt);
                case TraceUpdated evnt: return Parse(evnt);
                case TraceAttached evnt: return Parse(evnt);
                case TraceDetached evnt: return Parse(evnt);
                case TraceCleaned evnt: return Parse(evnt);
                case TraceRemoved evnt: return Parse(evnt);
                case BaseRefAssigned evnt: return Parse(evnt);

                case TceWithRelationsAddedOrUpdated evnt: return Parse(evnt);
                case TceRemoved evnt: return Parse(evnt);

                case MonitoringSettingsChanged evnt: return Parse(evnt);
                case MonitoringStarted evnt: return Parse(evnt);
                case MonitoringStopped evnt: return Parse(evnt);

                case ClientStationRegistered evnt: return Parse(evnt);
                case ClientStationUnregistered _: return new LogLine() { OperationCode = LogOperationCode.ClientExited };
                case ClientConnectionLost _:
                    return new LogLine() { OperationCode = LogOperationCode.ClientConnectionLost };
                case UsersMachineKeyAssigned evnt: return Parse(evnt);

                case MeasurementAdded evnt: return Parse(evnt);
                case MeasurementUpdated evnt: return Parse(evnt);

                case EventsAndSorsRemoved evnt: return Parse(evnt);
                case SnapshotMade evnt: return Parse(evnt);
                default: return null;
            }
        }

        public void InitializeBySnapshot(Model modelAtSnapshot)
        {
            // for old snapshots made before event log move to server
            if (modelAtSnapshot.UserActionsLog == null)
                modelAtSnapshot.UserActionsLog = new List<LogLine>();

            foreach (var rtu in modelAtSnapshot.Rtus)
                _rtuTitles.Add(rtu.Id, rtu.Title);

            foreach (var trace in modelAtSnapshot.Traces)
                _traces.Add(trace.TraceId, new Tuple<string, Guid>(trace.Title, trace.RtuId));

            foreach (var tce in modelAtSnapshot.TcesNew)
                _tceTitles.Add(tce.Id, tce.Title);

        }

        private LogLine Parse(RtuAtGpsLocationAdded e)
        {
            _rtuTitles.Add(e.Id, e.Title);
            return new LogLine() { OperationCode = LogOperationCode.RtuAdded, RtuTitle = e.Title };
        }

        private LogLine Parse(RtuUpdated e)
        {
            _rtuTitles[e.RtuId] = e.Title;
            return new LogLine { OperationCode = LogOperationCode.RtuUpdated, RtuTitle = e.Title };
        }  
        
        private LogLine Parse(RtuAddressCleared e)
        {
            _rtuTitles.TryGetValue(e.RtuId, out string? rtuTitle);
            return new LogLine { OperationCode = LogOperationCode.RtuAddressCleared, RtuTitle = rtuTitle ?? "" };
        }

        private LogLine Parse(RtuInitialized e)
        {
            _rtuTitles.TryGetValue(e.Id, out string? rtuTitle);
            return new LogLine { OperationCode = LogOperationCode.RtuInitialized, RtuTitle = rtuTitle ?? "" };
        }

        private LogLine Parse(RtuRemoved e)
        {
            return new LogLine { OperationCode = LogOperationCode.RtuRemoved, RtuTitle = _rtuTitles[e.RtuId] };
        }

        private LogLine Parse(TraceAdded e)
        {
            _traces.Add(e.TraceId, new Tuple<string, Guid>(e.Title, e.RtuId));

            // все эти TryGetValue появились из-за подкладывания базы 2.0 в 3.0
            _rtuTitles.TryGetValue(e.RtuId, out string? rtuTitle);

            return new LogLine()
            {
                OperationCode = LogOperationCode.TraceAdded,
                RtuTitle = rtuTitle ?? "",
                TraceTitle = e.Title
            };
        }

        private LogLine Parse(TraceUpdated e)
        {
            // все эти TryGetValue появились из-за подкладывания базы 2.0 в 3.0
            _traces.TryGetValue(e.Id, out Tuple<string, Guid>? traceTuple);

            if (traceTuple != null)
            {
                var rtuId = traceTuple.Item2;
                _traces[e.Id] = new Tuple<string, Guid>(e.Title, rtuId);
            }
           
            return new LogLine
            {
                OperationCode = LogOperationCode.TraceUpdated,
                RtuTitle = traceTuple != null ? _rtuTitles[traceTuple.Item2] : "",
                TraceTitle = e.Title,
            };
        }

        private LogLine Parse(TraceAttached e)
        {
            // все эти TryGetValue появились из-за подкладывания базы 2.0 в 3.0
            _traces.TryGetValue(e.TraceId, out Tuple<string, Guid>? traceTuple);
            string? rtuTitle = "";
            if (traceTuple != null)
                _rtuTitles.TryGetValue(traceTuple.Item2, out rtuTitle);
           
            return new LogLine
            {
                OperationCode = LogOperationCode.TraceAttached,
                RtuTitle = rtuTitle ?? "",
                TraceTitle = traceTuple?.Item1 ?? "",
                OperationParams = e.OtauPortDto.ToStringB(),
            };
        }

        private LogLine Parse(TraceDetached e)
        {
            // все эти TryGetValue появились из-за подкладывания базы 2.0 в 3.0
            _traces.TryGetValue(e.TraceId, out Tuple<string, Guid>? traceTuple);
            string? rtuTitle = "";
            if (traceTuple != null)
                _rtuTitles.TryGetValue(traceTuple.Item2, out rtuTitle);

            return new LogLine
            {
                OperationCode = LogOperationCode.TraceDetached,
                RtuTitle = rtuTitle ?? "",
                TraceTitle = traceTuple?.Item1 ?? "",
            };
        }

        private LogLine Parse(TraceCleaned e)
        {
            return new LogLine
            {
                OperationCode = LogOperationCode.TraceCleaned,
                RtuTitle = _rtuTitles[_traces[e.TraceId].Item2],
                TraceTitle = _traces[e.TraceId].Item1,
            };
        }

        private LogLine Parse(TraceRemoved e)
        {
            return new LogLine
            {
                OperationCode = LogOperationCode.TraceRemoved,
                RtuTitle = _rtuTitles[_traces[e.TraceId].Item2],
                TraceTitle = _traces[e.TraceId].Item1,
            };
        }

        private LogLine Parse(BaseRefAssigned e)
        {
            // все эти TryGetValue появились из-за подкладывания базы 2.0 в 3.0
            _traces.TryGetValue(e.TraceId, out Tuple<string, Guid>? traceTuple);
            string? rtuTitle = "";
            if (traceTuple != null)
                _rtuTitles.TryGetValue(traceTuple.Item2, out rtuTitle);

            return new LogLine()
            {
                OperationCode = LogOperationCode.BaseRefAssigned,
                RtuTitle = rtuTitle ?? "",
                TraceTitle = traceTuple?.Item1 ?? "",
                OperationParams = string.Join(';', e.BaseRefs.Select(b => b.BaseRefType))
            };
        }

        private LogLine Parse(TceWithRelationsAddedOrUpdated e)
        {
            var isCreation = false;
            if (!_tceTitles.ContainsKey(e.Id))
            {
                isCreation = true;
                _tceTitles.Add(e.Id, e.Title);
            }

            // var additionalInfo = isCreation
            //     ? $@"TCE {e.Title}, {e.AllRelationsOfTce.Count} " + Resources.SID_links_added
            //     : $@"TCE {e.Title}, {e.ExcludedTraceIds.Count} " + Resources.SID_links_removed + $@", {e.AllRelationsOfTce.Count} " + Resources.SID_links_exist;
            return new LogLine()
            {
                OperationCode = isCreation ? LogOperationCode.TceAdded : LogOperationCode.TceUpdated,
                OperationParams = $"{_tceTitles[e.Id]}",
            };
        }

        private LogLine Parse(TceRemoved e)
        {
            return new LogLine()
            {
                OperationCode = LogOperationCode.TceRemoved,
                OperationParams = $"{_tceTitles[e.Id]}",
            };
        }

        private LogLine Parse(MonitoringSettingsChanged e)
        {
            var mode = e.IsMonitoringOn ? @"AUTO" : @"MANUAL";
            return new LogLine()
            {
                OperationCode = LogOperationCode.MonitoringSettingsChanged,
                RtuTitle = _rtuTitles[e.RtuId],
                OperationParams = e.IsMonitoringOn.ToString(),
            };
        }

        private LogLine Parse(MonitoringStarted e)
        {
            return new LogLine() { OperationCode = LogOperationCode.MonitoringStarted, RtuTitle = _rtuTitles[e.RtuId] };
        }

        private LogLine Parse(MonitoringStopped e)
        {
            return new LogLine() { OperationCode = LogOperationCode.MonitoringStopped, RtuTitle = _rtuTitles[e.RtuId] };
        }

        private LogLine Parse(ClientStationRegistered e)
        {
            return new LogLine()
            {
                OperationCode = LogOperationCode.ClientStarted,
                OperationParams = $"{e.RegistrationResult}",
            };
        }

        private LogLine Parse(UsersMachineKeyAssigned e)
        {
            return new LogLine()
            {
                OperationCode = LogOperationCode.UsersMachineKeyAssigned,
                OperationParams = _readModel.Users.FirstOrDefault(u => u.UserId == e.UserId)?.Title ?? e.UserId.ToString()
            };
        }

        private LogLine? Parse(MeasurementAdded e)
        {
            if (_measurements.ContainsKey(e.SorFileId))
                _logger.LogInformation($"Event to log parse MeasurementAdded error. SorFileId = {e.SorFileId} already exists");
            else 
                _measurements.Add(e.SorFileId, e);
            return null;
        }

        private LogLine? Parse(MeasurementUpdated e)
        {
            // появились после добавления эмулятором файковых измерений
            if (!_measurements.TryGetValue(e.SorFileId, out MeasurementAdded? meas))
                return null;

            //  у не Accident нельзя поменять статус, значит поменяли комент, значит не надо логировать
            if (meas.EventStatus <= EventStatus.EventButNotAnAccident)
                return null;

            return new LogLine()
            {
                OperationCode = LogOperationCode.MeasurementUpdated,
                RtuTitle = _rtuTitles[meas.RtuId],
                TraceTitle = _traces[meas.TraceId].Item1,
                OperationParams = $"{e.EventStatus}",
            };
        }


        private LogLine Parse(EventsAndSorsRemoved e)
        {
            return new LogLine()
            {
                OperationCode = LogOperationCode.EventsAndSorsRemoved,
                OperationParams = $@"{e.UpTo.Date:d}  {(e.IsMeasurementsNotEvents ? 1 : 0)}/{(e.IsOpticalEvents ? 1 : 0)}/{(e.IsNetworkEvents ? 1 : 0)}",
            };
        }

        private LogLine Parse(SnapshotMade e)
        {
            return new LogLine()
            {
                OperationCode = LogOperationCode.SnapshotMade,
                OperationParams = $@"{e.UpTo.Date:d}",
            };
        }
    }
}