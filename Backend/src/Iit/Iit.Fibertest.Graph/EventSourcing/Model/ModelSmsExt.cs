﻿using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph
{
    public static class ModelSmsExt
    {
        public static List<string> GetPhonesToSendMonitoringResult(this Model writeModel, MonitoringResultDto dto)
        {
            var trace = writeModel.Traces.FirstOrDefault(t => t.TraceId == dto.PortWithTrace.TraceId);
            if (trace == null) return new List<string>();

            return writeModel.Users
                .Where(u => u.ShouldReceiveThisSms(dto) && trace.ZoneIds.Contains(u.ZoneId))
                .Select(u => u.Sms.PhoneNumber).ToList();

        }

        public static List<string> GetPhonesToSendNetworkEvent(this Model writeModel, Guid rtuId)
        {
            var rtu = writeModel.Rtus.FirstOrDefault(r => r.Id == rtuId);
            if (rtu == null) return new List<string>();

            return writeModel.Users
                .Where(u => u.ShouldReceiveNetworkEventSms() && rtu.ZoneIds.Contains(u.ZoneId))
                .Select(u => u.Sms.PhoneNumber).ToList();
        }

        public static List<string> GetPhonesToSendRtuStatusEvent(this Model writeModel, Guid rtuId)
        {
            var rtu = writeModel.Rtus.FirstOrDefault(r => r.Id == rtuId);
            if (rtu == null) return new List<string>();

            return writeModel.Users
                .Where(u => u.ShouldReceiveRtuStatusEventsSms() && rtu.ZoneIds.Contains(u.ZoneId))
                .Select(u => u.Sms.PhoneNumber).ToList();
        }

        public static List<string> GetPhonesToSendBopNetworkEvent(this Model writeModel, BopNetworkEvent cmd)
        {
            var otau = writeModel.Otaus.FirstOrDefault(o => o.Serial == cmd.Serial);
//            var otau = writeModel.Otaus.FirstOrDefault(o => o.NetAddress.Ip4Address == cmd.OtauIp
//                                                            && o.NetAddress.Port == cmd.TcpPort);
            if (otau == null) return new List<string>();
            var rtu = writeModel.Rtus.FirstOrDefault(r => r.Id == otau.RtuId);
            if (rtu == null) return new List<string>();

            return writeModel.Users
                .Where(u => u.ShouldReceiveBopEventSms() && rtu.ZoneIds.Contains(u.ZoneId))
                .Select(u => u.Sms.PhoneNumber).ToList();
        }
    }
}