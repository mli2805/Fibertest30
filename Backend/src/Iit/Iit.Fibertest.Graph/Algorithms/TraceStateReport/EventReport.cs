﻿using System.Globalization;
using Iit.Fibertest.Dto;
using Iit.Fibertest.StringResources;
using Iit.Fibertest.UtilsLib;

namespace Iit.Fibertest.Graph
{
    public static class EventReport
    {
        private static string ForReport(this DateTime timestamp)
        {
            return timestamp.ToString(Thread.CurrentThread.CurrentUICulture.DateTimeFormat.ShortTimePattern) +
                            @" " + timestamp.ToString(Thread.CurrentThread.CurrentUICulture.DateTimeFormat.ShortDatePattern);
        }

        public static string GetTestSms()
        {
            return Resources.SID_Fibertest20__Test_SMS_message;
        }

        public static string GetShortMessageForNetworkEvent(this Model model, Guid rtuId, bool isMainChannel, bool isOk)
        {
            var rtu = model.Rtus.FirstOrDefault(r => r.Id == rtuId);
            if (rtu == null) return null;
            var channel = isMainChannel ? Resources.SID_Main_channel : Resources.SID_Reserve_channel;
            var what = isOk ? Resources.SID_Recovered : Resources.SID_Broken;
            return $@"RTU ""{rtu.Title}"" {channel} - {what}";
        }
        public static string GetShortMessageForBopState(BopNetworkEvent cmd)
        {
            var state = cmd.IsOk ? Resources.SID_Ok : Resources.SID_Breakdown;
            return string.Format(Resources.SID_BOP__0_____1__at__2_, cmd.OtauIp, state, cmd.EventTimestamp.ForReport());
        }
        public static string GetShortMessageForMonitoringResult(this Model model, MonitoringResultDto dto)
        {
            var trace = model.Traces.FirstOrDefault(t => t.TraceId == dto.PortWithTrace.TraceId);
            if (trace == null) return null;

            return string.Format(Resources.SID_Trace___0___state_is_changed_to___1___at__2_, trace.Title,
                dto.TraceState.ToLocalizedString(), dto.TimeStamp.ForReport());
        }

        public static string GetShortMessageForRtuStatusEvent(this Model model, RtuAccident accident)
        {
            if (accident.IsMeasurementProblem)
            {
                var trace = model.Traces.FirstOrDefault(t => t.TraceId == accident.TraceId);
                if (trace == null) return null;

                var codeString = accident.ReturnCode == ReturnCode.MeasurementBaseRefNotFound
                    ? string.Format(accident.ReturnCode.GetLocalizedString(), accident.BaseRefType.GetLocalizedFemaleString())
                    : string.Format(accident.ReturnCode.GetLocalizedString(), accident.BaseRefType.GetLocalizedGenitiveString());
                var sms = string.Format(Resources.SID_Trace___0_____1__at__2_, 
                    trace.Title, codeString, accident.EventRegistrationTimestamp.ForReport());
                Console.WriteLine(sms);
                return sms;
            }
            else
            {
                var rtu = model.Rtus.FirstOrDefault(r => r.Id == accident.RtuId);
                if (rtu == null) return null;

                return string.Format(Resources.SID_RTU___0_____1__at__2_, 
                    rtu.Title, accident.ReturnCode.GetLocalizedString(), accident.EventRegistrationTimestamp.ForReport());
            }
        }

        public static EventReportModel CreateReportModelFromMoniResult(this Model model, MonitoringResultDto dto)
        {
            if (!model.TryGetRtu(dto.RtuId, out Rtu rtu)) return null;
            if (!model.TryGetTrace(dto.PortWithTrace.TraceId, out Trace trace)) return null;

            var result = new EventReportModel
            {
                TraceTitle = trace.Title,
                TraceState = dto.TraceState.ToLocalizedString(),
                RtuTitle = rtu.Title,
                Port = dto.PortWithTrace.OtauPort.OpticalPortToString(),
            };
            return result;
        }

        private static string OpticalPortToString(this OtauPortDto dto)
        {
            return string.Format(Resources.SID__0__on_BOP__1_, dto.OpticalPort, dto.Serial);
        }

        public static string FillInHtmlReportForTraceState(EventReportModel reportModel)
        {
            var content = File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + @"Resources\Reports\TraceStateReport.html");
            content = content.Replace(@"@CaptionConst", Resources.SID_Trace_State_Report);
            content = content.Replace(@"@TraceStateConst", Resources.SID_Trace_state);
            content = content.Replace(@"@TraceTitleConst", Resources.SID_Trace);
            content = content.Replace(@"@trace-title", reportModel.TraceTitle);
            content = content.Replace(@"@trace-state", reportModel.TraceState);
            content = content.Replace(@"@RtuTitleConst", @"RTU");
            content = content.Replace(@"@rtu-title", reportModel.RtuTitle);
            content = content.Replace(@"@PortConst", Resources.SID_Port);
            content = content.Replace(@"@port", reportModel.Port);
            content = content.Replace(@"@DateConst", Resources.SID_Date);
            content = content.Replace(@"@date", reportModel.TimeStamp.ToString(CultureInfo.CurrentCulture.DateTimeFormat.ShortDatePattern));
            content = content.Replace(@"@TimeConst", Resources.SID_Time);
            content = content.Replace(@"@time", reportModel.TimeStamp.ToString(CultureInfo.CurrentCulture.DateTimeFormat.ShortTimePattern));

            var path = FileOperations.GetParentFolder(AppDomain.CurrentDomain.BaseDirectory) + @"\temp";
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
            var filename = path + $@"\report-{reportModel.TimeStamp:yyyy-MM-dd-hh-mm-ss}.html";
            File.WriteAllText(filename, content);
            return filename;
        }
    }
}