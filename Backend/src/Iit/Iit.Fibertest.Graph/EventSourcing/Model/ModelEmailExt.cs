﻿using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph
{
    public static class ModelEmailExt
    {
        public static List<string> GetEmailsToSendMonitoringResult(this Model writeModel, MonitoringResultDto dto)
        {
            return writeModel.ForTrace(dto.PortWithTrace.TraceId);
        }

        private static List<string> ForTrace(this Model writeModel, Guid traceId)
        {
            var trace = writeModel.Traces.FirstOrDefault(t => t.TraceId == traceId);
            if (trace == null) return new List<string>();

            return writeModel.Users.Where(u => u.Email.IsActivated && trace.ZoneIds.Contains(u.ZoneId))
                .Select(u => u.Email.Address).ToList();
        }

        public static List<string> GetEmailsToSendNetworkEvent(this Model writeModel, Guid rtuId)
        {
            return writeModel.ForRtu(rtuId);
        }

        private static List<string> ForRtu(this Model writeModel, Guid rtuId)
        {
            var rtu = writeModel.Rtus.FirstOrDefault(r => r.Id == rtuId);
            if (rtu == null) return new List<string>();

            return writeModel.Users.Where(u => u.Email.IsActivated && rtu.ZoneIds.Contains(u.ZoneId))
                .Select(u => u.Email.Address).ToList();
        }

        public static List<string> GetEmailsToSendBopNetworkEvent(this Model writeModel, BopNetworkEvent cmd)
        {
            var otau = writeModel.Otaus.FirstOrDefault(o => o.NetAddress.Ip4Address == cmd.OtauIp && o.NetAddress.Port == cmd.TcpPort);
            if (otau == null) return new List<string>();
            var rtu = writeModel.Rtus.FirstOrDefault(r => r.Id == otau.RtuId);
            if (rtu == null) return new List<string>();

            return writeModel.Users.Where(u => u.Email.IsActivated && rtu.ZoneIds.Contains(u.ZoneId))
                .Select(u => u.Email.Address).ToList();
        }

        public static List<string> GetEmailsToSendRtuStatusEvent(this Model writeModel, RtuAccident accident)
        {
            if (accident.IsMeasurementProblem)
                return writeModel.ForTrace(accident.TraceId);
            else return writeModel.ForRtu(accident.RtuId);
        }
    }
}