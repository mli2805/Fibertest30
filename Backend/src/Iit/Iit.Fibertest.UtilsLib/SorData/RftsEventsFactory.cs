﻿using System.Globalization;
using Iit.Fibertest.Dto;
using Optixsoft.SorExaminer.OtdrDataFormat;
using Optixsoft.SorExaminer.OtdrDataFormat.Structures;

namespace Iit.Fibertest.UtilsLib
{
    public static class RftsEventsFactory
    {
        public static RftsEventsDto Create(byte[] sorBytes)
        {
            var sorData = SorData.FromBytes(sorBytes);
            return sorData.GetRftsEvents();
        }

        private static RftsEventsDto GetRftsEvents(this OtdrDataKnownBlocks sorData)
        {
            var rftsEventsDto = new RftsEventsDto
            {
                IsNoFiber = sorData.RftsEvents.MonitoringResult == (int)ComparisonReturns.NoFiber
            };

            if (rftsEventsDto.IsNoFiber) return rftsEventsDto;

            rftsEventsDto.LevelArray = CreateLevelArray(sorData).ToArray();
            rftsEventsDto.Summary = new RftsEventsSummaryDto() { Orl = sorData.KeyEvents.OpticalReturnLoss };
            var ts = GetTraceState(sorData, rftsEventsDto.LevelArray);
            rftsEventsDto.Summary.TraceState = ts.Item1;
            rftsEventsDto.Summary.BreakLocation = ts.Item2;
            return rftsEventsDto;
        }

        private static (FiberState, double) GetTraceState(OtdrDataKnownBlocks sorData, RftsLevelDto[] levels)
        {
            var traceState = FiberState.Ok;
            var breakLocation = 0.0;

            var minor = levels.FirstOrDefault(l => l.Level == FiberState.Minor);
            if (minor != null && minor.IsFailed)
                traceState = FiberState.Minor;

            var major = levels.FirstOrDefault(l => l.Level == FiberState.Major);
            if (major != null && major.IsFailed)
                traceState = FiberState.Major;

            var critical = levels.FirstOrDefault(l => l.Level == FiberState.Critical);
            if (critical != null && critical.IsFailed)
                traceState = FiberState.Critical;

            var users = levels.FirstOrDefault(l => l.Level == FiberState.User);
            if (users != null && users.IsFailed)
                traceState = FiberState.User;

           
            if (sorData.RftsEvents.MonitoringResult == (int)ComparisonReturns.FiberBreak)
            {
                traceState = FiberState.FiberBreak;
                var owt = sorData.KeyEvents.KeyEvents[sorData.KeyEvents.KeyEventsCount - 1].EventPropagationTime;
                breakLocation = sorData.OwtToLenKm(owt);
            }

            return (traceState, breakLocation);
        }

        private static IEnumerable<RftsLevelDto> CreateLevelArray(OtdrDataKnownBlocks sorData)
        {
            var rftsEventsBlocks = sorData.GetRftsEventsBlockForEveryLevel().ToList();
            var rftsParameters = sorData.RftsParameters;
            for (int i = 0; i < rftsParameters.LevelsCount; i++)
            {
                var level = rftsParameters.Levels[i];
                if (level.IsEnabled)
                {
                    var rftsLevelDto = CreateLevel(sorData,
                        rftsEventsBlocks.FirstOrDefault(b => b.LevelName == level.LevelName)!, level);

                    yield return rftsLevelDto;
                }
            }
        }

        private static RftsLevelDto CreateLevel(OtdrDataKnownBlocks sorData, RftsEventsBlock eventBlock, RftsLevel level)
        {
            var rftsLevelDto = new RftsLevelDto
            {
                Level = level.LevelName.ToFiberState(),
                EventArray = CreateEventArray(sorData, eventBlock, level).ToArray()
            };
            var firstFailedEvent = rftsLevelDto.EventArray.FirstOrDefault(e => e.IsNew || e.IsFailed);
            if (firstFailedEvent != null)
            {
                rftsLevelDto.IsFailed = true;
                rftsLevelDto.FirstProblemLocation = firstFailedEvent.DistanceKm;
            }
            rftsLevelDto.TotalFiberLoss = CreateTotalFiberLossDto(sorData, level, eventBlock);
            return rftsLevelDto;
        }

        private static IEnumerable<RftsEventDto> CreateEventArray(OtdrDataKnownBlocks sorData, RftsEventsBlock rftsEventsBlock, RftsLevel level)
        {
            for (int i = 0; i < rftsEventsBlock.EventsCount; i++)
            {
                var rftsEventDto = new RftsEventDto() { Ordinal = i };

                // Common information
                var landmark = sorData.LinkParameters.LandmarkBlocks.FirstOrDefault(b => b.RelatedEventNumber == i + 1);
                if (landmark != null)
                {
                    rftsEventDto.LandmarkTitle = landmark.Comment ?? "";
                    rftsEventDto.LandmarkType = landmark.Code.ForDto();
                }
                else
                {
                    rftsEventDto.LandmarkTitle = "";
                    rftsEventDto.LandmarkType = EquipmentType.AccidentPlace;
                }

                rftsEventDto.DistanceKm = $@"{sorData.OwtToLenKm(sorData.KeyEvents.KeyEvents[i].EventPropagationTime):0.00000}";
                if ((rftsEventsBlock.Events[i].EventTypes & RftsEventTypes.IsNew) != 0)
                    rftsEventDto.IsNew = true;
                rftsEventDto.Enabled = rftsEventsBlock.Events[i].EventTypes.ForEnabledInDto();
                rftsEventDto.EventType = sorData.KeyEvents.KeyEvents[i].EventCode.EventCodeForTable();


                // Current measurement
                rftsEventDto.ReflectanceCoeff = sorData.KeyEvents.KeyEvents[i].EventReflectance.ToString(CultureInfo.CurrentCulture);
                if (i != 0)
                {
                    var eventLoss = sorData.KeyEvents.KeyEvents[i].EventLoss;
                    var endOfFiberThreshold = sorData.FixedParameters.EndOfFiberThreshold;
                    rftsEventDto.AttenuationInClosure = eventLoss > endOfFiberThreshold ? $@">{endOfFiberThreshold:0.000}" : $@"{eventLoss:0.000}";
                    var attenuationCoeffToDbKm = sorData.KeyEvents.KeyEvents[i].LeadInFiberAttenuationCoefficient /
                                                 sorData.GetOwtToKmCoeff();
                    rftsEventDto.AttenuationCoeff = $@"{attenuationCoeffToDbKm: 0.000}";
                }

                // Monitoring threshold
                if ((rftsEventsBlock.Events[i].EventTypes & RftsEventTypes.IsNew) == 0)
                {
                    var threshold = level.ThresholdSets[i];
                    rftsEventDto.ReflectanceCoeffThreshold = threshold.ReflectanceThreshold.Convert();
                    rftsEventDto.AttenuationInClosureThreshold = threshold.AttenuationThreshold.Convert();
                    rftsEventDto.AttenuationCoeffThreshold = threshold.AttenuationCoefThreshold.Convert();
                }

                // Deviations
                if ((rftsEventsBlock.Events[i].EventTypes & RftsEventTypes.IsFiberBreak) != 0)
                {
                    rftsEventDto.IsFailed = true;
                    rftsEventDto.DamageType = @"B";
                }

                rftsEventDto.ReflectanceCoeffDeviation
                    = rftsEventDto.ForDeviationInTable(rftsEventsBlock.Events[i].ReflectanceThreshold, @"R");

                if (i < rftsEventsBlock.EventsCount - 1)
                    rftsEventDto.AttenuationInClosureDeviation
                        = rftsEventDto.ForDeviationInTable(rftsEventsBlock.Events[i].AttenuationThreshold, @"L");

                rftsEventDto.AttenuationCoeffDeviation
                    = rftsEventDto.ForDeviationInTable(rftsEventsBlock.Events[i].AttenuationCoefThreshold, @"C");

                rftsEventDto.State = rftsEventsBlock.Events[i].EventTypes.ForStateInDto(rftsEventDto.IsFailed);
                yield return rftsEventDto;
            }
        }


        private static MonitoringThreshold Convert(this ShortThreshold threshold)
        {
            return new MonitoringThreshold
            {
                Value = threshold.IsAbsolute ? threshold.AbsoluteThreshold : threshold.RelativeThreshold,
                IsAbsolute = threshold.IsAbsolute
            };
        }


        private static TotalFiberLossDto CreateTotalFiberLossDto(OtdrDataKnownBlocks sorData, RftsLevel rftsLevel, RftsEventsBlock rftsEventsBlock)
        {
            return new TotalFiberLossDto()
            {
                Value = sorData.KeyEvents.EndToEndLoss,
                Threshold = rftsLevel.EELT.Convert(),
                Deviation = (short)rftsEventsBlock.EELD.Deviation / 1000.0,
                IsPassed = (rftsEventsBlock.EELD.Type & ShortDeviationTypes.IsExceeded) == 0,
            };
        }

    }
}
