﻿using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure;
public partial class RtuManager
{
    private List<object> DtoToCommandList(InitializeRtuDto dto, RtuInitializedDto result)
    {
        var commandList = new List<object>();
        var originalRtu = _writeModel.Rtus.First(r => r.Id == result.RtuId);

        {
            foreach (var trace in _writeModel.Traces.Where(t => t.RtuId == dto.RtuId))
            {
                // after RTU initialization  active RTU state events should be turned off by mock OK events
                var lastAccident = _writeModel.RtuAccidents
                    .LastOrDefault(a => a.TraceId == trace.TraceId && a.IsMeasurementProblem);
                if (lastAccident != null && !lastAccident.IsGoodAccident)
                {
                    commandList.Add(CreateClearingAccidentCommand(dto, lastAccident, dto.Serial != result.Serial));
                }
            }
        }

        // change Charon Serial for traces on main charon ports
        if (dto.Serial != result.Serial)
        {
            // OtauPort is null until Trace attached
            foreach (var trace in _writeModel.Traces
                         .Where(t => t.RtuId == dto.RtuId && t.OtauPort != null && t.OtauPort.IsPortOnMainCharon))
            {
                commandList.Add(new UpdateTracePort { Id = trace.TraceId, Serial = result.Serial });
            }
        }


        // Own port count changed
        if (originalRtu.OwnPortCount > result.OwnPortCount)
        {
            var traces = _writeModel.Traces.Where(t =>
                t.RtuId == result.RtuId && t.OtauPort != null && t.Port >= result.OwnPortCount && t.OtauPort.Serial == originalRtu.Serial);
            foreach (var trace in traces)
            {
                var cmd = new DetachTrace { TraceId = trace.TraceId };
                commandList.Add(cmd);
            }
        }

        // main veex otau state changed
        if (!dto.IsFirstInitialization &&
            originalRtu.MainVeexOtau.connected != result.MainVeexOtau.connected)
        {
            commandList.Add(new AddBopNetworkEvent
            {
                EventTimestamp = DateTime.Now,
                RtuId = result.RtuId,
                Serial = originalRtu.Serial,
                OtauIp = originalRtu.OtdrNetAddress.Ip4Address,
                TcpPort = originalRtu.OtdrNetAddress.Port,
                IsOk = result.MainVeexOtau.connected,
            });
        }

        // BOP state changed
        foreach (var keyValuePair in result.Children)
        {
            var bop = _writeModel.Otaus.FirstOrDefault(o => o.NetAddress.Equals(keyValuePair.Value.NetAddress));
            if (bop == null)
            {
                // This happens when Khazanov writes into RTU's ini file while RTU works
                // should not happen in real life but anyway
                result.Children.Remove(keyValuePair.Key);
                _logger.LogError($"There is no bop with address {keyValuePair.Value.NetAddress.ToStringA()} in graph");
                continue;
            }
            if (bop.IsOk != keyValuePair.Value.IsOk)
                commandList.Add(new AddBopNetworkEvent
                {
                    EventTimestamp = DateTime.Now,
                    RtuId = result.RtuId,
                    Serial = keyValuePair.Value.Serial,
                    OtauIp = keyValuePair.Value.NetAddress.Ip4Address,
                    TcpPort = keyValuePair.Value.NetAddress.Port,
                    IsOk = keyValuePair.Value.IsOk,
                });
        }

        commandList.Add(GetInitializeRtuCommand(dto, result));
        return commandList;
    }

    private AddRtuAccident CreateClearingAccidentCommand(InitializeRtuDto dto, RtuAccident accident, bool serialChanged)
    {
        return new AddRtuAccident
        {
            IsMeasurementProblem = true,
            ReturnCode = serialChanged ? ReturnCode.MeasurementErrorCleared : ReturnCode.MeasurementErrorClearedByInit,

            EventRegistrationTimestamp = DateTime.Now,
            RtuId = dto.RtuId,
            TraceId = accident.TraceId,
            BaseRefType = accident.BaseRefType,

            ClearedAccidentWithId = accident.Id,

            Comment = "",
        };
    }

    private InitializeRtu GetInitializeRtuCommand(InitializeRtuDto dto, RtuInitializedDto result)
    {
        var cmd = new InitializeRtu
        {
            Id = result.RtuId,
            Maker = result.Maker,
            OtdrId = result.OtdrId,
            MainVeexOtau = result.MainVeexOtau,
            Mfid = result.Mfid,
            Mfsn = result.Mfsn,
            Omid = result.Omid,
            Omsn = result.Omsn,
            MainChannel = dto.RtuAddresses.Main,
            MainChannelState = RtuPartState.Ok,
            IsReserveChannelSet = dto.RtuAddresses.HasReserveAddress,
            ReserveChannel = dto.RtuAddresses.HasReserveAddress
                ? dto.RtuAddresses.Reserve
                : null,
            ReserveChannelState = dto.RtuAddresses.HasReserveAddress ? RtuPartState.Ok : RtuPartState.NotSetYet,
            OtauNetAddress = result.OtdrAddress,
            OwnPortCount = result.OwnPortCount,
            FullPortCount = result.FullPortCount,
            Serial = result.Serial,
            Version = result.Version,
            Version2 = result.Version2,
            IsMonitoringOn = result.IsMonitoringOn,
            Children = result.Children,
            AcceptableMeasParams = result.AcceptableMeasParams,
        };
        return cmd;
    }
}
