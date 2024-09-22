﻿using System.Diagnostics;
using AutoMapper;
using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph
{
    public static class WebDtoFactory
    {
        public static RtuDto GetRtu(this Model writeModel, string rtuGuid, User user)
        {
            var rtuId = Guid.Parse(rtuGuid);
            var rtu = writeModel.Rtus.First(r => r.Id == rtuId);
            return writeModel.GetRtuWithChildren(rtu, user);
        }

        public static IEnumerable<RtuDto> GetTree(this Model writeModel, User user)
        {
            return from rtu in writeModel.Rtus 
                where rtu.ZoneIds.Contains(user.ZoneId) 
                select writeModel.GetRtuWithChildren(rtu, user);
        }

        private static RtuDto GetRtuWithChildren(this Model writeModel, Rtu rtu, User user)
        {
            var rtuDto = rtu.CreateRtuDto();
            for (int i = 1; i <= rtuDto.OwnPortCount; i++)
            {
                ChildDto? childForPort = rtu.GetChildForPort(i, writeModel, user);
                if (childForPort != null)
                {
                    rtuDto.Children.Add(childForPort);
                }
            }
            //detached traces
            foreach (var trace in writeModel.Traces.Where(t => t.RtuId == rtu.Id && t.Port == -1))
            {
                rtuDto.Children.Add(trace.CreateTraceDto(rtu, null));
            }
            return rtuDto;
        }

        public static IEnumerable<AboutRtuDto> CreateAboutRtuList(this Model writeModel, User user)
        {
            foreach (var rtu in writeModel.Rtus)
            {
                if (!rtu.ZoneIds.Contains(user.ZoneId))
                    continue;
                yield return rtu.CreateAboutRtuDto();
            }
        }

        private static AboutRtuDto CreateAboutRtuDto(this Rtu r)
        {
            return new AboutRtuDto()
            {
                Title = r.Title,
                Model = r.Mfid,
                Serial = r.Serial,
                Version = r.Version,
            };
        }

        private static RtuDto CreateRtuDto(this Rtu r)
        {
            return new RtuDto()
            {
                RtuId = r.Id,
                Title = r.Title,
                RtuMaker = r.RtuMaker,
                Serial = r.Serial,
                MainVeexOtau = r.MainVeexOtau,
                Mfid = r.Mfid,
                Mfsn = r.Mfsn,
                Omid = r.Omid,
                Omsn = r.Omsn,
                OtdrId = r.OtdrId,

                FullPortCount = r.FullPortCount,
                OwnPortCount = r.OwnPortCount,

                MainChannel = r.MainChannel.Clone(),
                MainChannelState = r.MainChannelState,
                ReserveChannel = r.ReserveChannel.Clone(),
                ReserveChannelState = r.ReserveChannelState,
                IsReserveChannelSet = r.IsReserveChannelSet,
                OtdrNetAddress = r.OtdrNetAddress.Clone(),
                BopState = r.BopState,

                MonitoringMode = r.MonitoringState,
                PreciseMeas = r.PreciseMeas,
                PreciseSave = r.PreciseSave,
                FastSave = r.FastSave,

                Version = r.Version,
                Version2 = r.Version2,

                TreeOfAcceptableMeasParams = r.AcceptableMeasParams
            };
        }

        private static ChildDto? GetChildForPort(this Rtu rtu, int port, Model writeModel, User user)
        {
            if (rtu.Children.TryGetValue(port, out var child))
            {
                var otau = writeModel.Otaus
                    .FirstOrDefault(o => o.NetAddress?.Ip4Address == child.NetAddress.Ip4Address);
                if (otau == null)
                {
                    Debug.WriteLine($@"Something strange happened on RTU {rtu.Title} port {port}: otau not found");
                    return null;
                }
                var otauWebDto = otau.CreateOtauWebDto(port);
                for (var j = 1; j <= otau.PortCount; j++)
                {
                    var traceOnOtau = writeModel.Traces
                        .FirstOrDefault(t => t.RtuId == rtu.Id
                                                    && t.OtauPort != null
                                                    && t.OtauPort.Serial == otau.Serial
                                                    && t.OtauPort.OpticalPort == j
                                                    && t.ZoneIds.Contains(user.ZoneId));
                    otauWebDto.Children.Add(traceOnOtau != null
                        ? traceOnOtau.CreateTraceDto(rtu, otauWebDto)
                        : new ChildDto(ChildType.FreePort) { Port = j });
                }
                return otauWebDto;
            }

            var trace = writeModel.Traces.FirstOrDefault(t => t.RtuId == rtu.Id
                                                              && t.OtauPort != null
                                                              && t.OtauPort.IsPortOnMainCharon
                                                              && t.Port == port
                                                              && t.ZoneIds.Contains(user.ZoneId));
            return trace != null
                ? trace.CreateTraceDto(rtu, null)
                : new ChildDto(ChildType.FreePort) { Port = port };
        }

        private static TraceDto CreateTraceDto(this Trace t, Rtu rtu, OtauWebDto? otauWebDto)
        {
            OtauPortDto? otauPortDto = null;
            if (t.OtauPort != null) // trace attached
            {
                var otauId = t.OtauPort.IsPortOnMainCharon
                    ? rtu.RtuMaker == RtuMaker.IIT
                        ? null
                        : rtu.MainVeexOtau.id
                    : t.OtauPort.OtauId;

                otauPortDto = new OtauPortDto()
                {
                    OtauId = otauId,
                    NetAddress = t.OtauPort.IsPortOnMainCharon ? rtu.MainChannel : t.OtauPort.NetAddress,
                    OpticalPort = t.Port,
                    Serial = otauWebDto == null ? rtu.Serial : otauWebDto.Serial,
                    IsPortOnMainCharon = t.OtauPort.IsPortOnMainCharon,
                    MainCharonPort = t.OtauPort.MainCharonPort,
                };
            }

            return new TraceDto(ChildType.Trace)
            {
                TraceId = t.TraceId,
                RtuId = t.RtuId,
                Title = t.Title,
                OtauPort = t.OtauPort != null ? otauPortDto : null,
                IsAttached = t.IsAttached,
                Port = t.Port,
                State = t.State,
                HasEnoughBaseRefsToPerformMonitoring = t.HasEnoughBaseRefsToPerformMonitoring,
                FastDuration = t.FastDuration,
                PreciseDuration = t.PreciseDuration,
                AdditionalDuration = t.AdditionalDuration,
                IsIncludedInMonitoringCycle = t.IsIncludedInMonitoringCycle,
                TceLinkState = t.TraceToTceLinkState
            };
        }

        private static OtauWebDto CreateOtauWebDto(this Otau o, int port)
        {
            return new OtauWebDto(ChildType.Otau)
            {
                OtauId = o.Id,
                RtuId = o.RtuId,
                OtauNetAddress = o.NetAddress,
                IsOk = o.IsOk,
                Serial = o.Serial,
                MasterPort = o.MasterPort,
                PortCount = o.PortCount,

                Port = port,
            };
        }

        public static OpticalEventDto CreateOpticalEventDto(this Measurement m, Model writeModel)
        {
            return new OpticalEventDto()
            {
                EventId = m.SorFileId,
                RtuTitle = writeModel.Rtus.FirstOrDefault(r => r.Id == m.RtuId)?.Title ?? "",
                TraceTitle = writeModel.Traces.FirstOrDefault(t => t.TraceId == m.TraceId)?.Title ?? "",
                TraceState = m.TraceState,
                BaseRefType = m.BaseRefType,
                EventRegistrationTimestamp = m.EventRegistrationTimestamp,
                MeasurementTimestamp = m.MeasurementTimestamp,

                EventStatus = m.EventStatus,
                StatusChangedTimestamp = m.StatusChangedTimestamp,
                StatusChangedByUser = m.StatusChangedByUser,

                Comment = m.Comment,
            };
        }

        public static OpticalAlarm CreateOpticalAlarm(this Measurement m)
        {
            return new OpticalAlarm()
            {
                SorFileId = m.SorFileId,
                TraceId = m.TraceId,
                HasBeenSeen = true,
            };
        }

        private static readonly IMapper Mapper = new MapperConfiguration(
            cfg => cfg.AddProfile<MappingWebApiProfile>()).CreateMapper();

        public static NetworkEventDto CreateNetworkEventDto(this NetworkEvent n, Model writeModel)
        {
            var dto = Mapper.Map<NetworkEventDto>(n);
            dto.RtuTitle = writeModel.Rtus.FirstOrDefault(r => r.Id == n.RtuId)?.Title ?? "";
            return dto;
        }

        public static RtuAccidentDto CreateAccidentDto(this RtuAccident n, Model writeModel)
        {
            var dto = Mapper.Map<RtuAccidentDto>(n);
            dto.RtuTitle = writeModel.Rtus.FirstOrDefault(r => r.Id == n.RtuId)?.Title ?? "";
            dto.TraceTitle = writeModel.Traces.FirstOrDefault(t => t.TraceId == n.TraceId)?.Title ?? "";
            return dto;
        }

        public static BopEventDto CreateBopEventDto(this BopNetworkEvent n, Model writeModel)
        {
            var dto = Mapper.Map<BopEventDto>(n);
            dto.RtuTitle = writeModel.Rtus.FirstOrDefault(r => r.Id == n.RtuId)?.Title ?? "";
            return dto;
        }

        public static IEnumerable<NetworkAlarm> CreateNetworkAlarms(this NetworkEvent n)
        {
            var na = new NetworkAlarm { EventId = n.Ordinal, RtuId = n.RtuId, HasBeenSeen = true };
            if (n.OnMainChannel == ChannelEvent.Broken)
            {
                na.Channel = @"Main";
                yield return na;
            }
            if (n.OnReserveChannel == ChannelEvent.Broken)
            {
                na.Channel = @"Reserve";
                yield return na;
            }
        }

        public static BopAlarm CreateBopAlarm(this BopNetworkEvent b)
        {
            return new BopAlarm() { EventId = b.Ordinal, Serial = b.Serial, HasBeenSeen = true };
        }

        public static RtuStateAlarm CreateRtuAccidentAlarm(this RtuAccident a)
        {
            return new RtuStateAlarm()
            {
                Id = a.Id,
                IsMeasurementProblem = a.IsMeasurementProblem,
                RtuId = a.RtuId,
                TraceId = a.TraceId,
                HasBeenSeen = true
            };
        }
    }
}
