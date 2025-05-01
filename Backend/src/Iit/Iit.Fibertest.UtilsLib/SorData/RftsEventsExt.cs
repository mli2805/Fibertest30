using Iit.Fibertest.Dto;
using Optixsoft.SorExaminer.OtdrDataFormat;
using Optixsoft.SorExaminer.OtdrDataFormat.Structures;

namespace Iit.Fibertest.UtilsLib
{
    // for WebFt30
    public static class RftsEventsExt
    {
        public static RftsWords ForStateInDto(this RftsEventTypes rftsEventType, bool isFailed)
        {
            if ((rftsEventType & RftsEventTypes.IsFiberBreak) != 0)
                return RftsWords.fiberBreak;
            if ((rftsEventType & RftsEventTypes.IsNew) != 0)
                return RftsWords.newEvent;
            if ((rftsEventType & RftsEventTypes.IsFailed) != 0)
                return RftsWords.fail;
            if ((rftsEventType & RftsEventTypes.IsMonitored) != 0)
                return isFailed ? RftsWords.fail : RftsWords.pass;
            if (rftsEventType == RftsEventTypes.None)
                return RftsWords.empty;
            return RftsWords.empty;
        } 
       
        public static RftsWords ForEnabledInDto(this RftsEventTypes rftsEventType)
        {
            if ((rftsEventType & RftsEventTypes.IsNew) != 0)
                return RftsWords.newEvent;
            if ((rftsEventType & RftsEventTypes.IsMonitored) != 0)
                return RftsWords.yes;
            if (rftsEventType == RftsEventTypes.None)
                return RftsWords.pass;
            return RftsWords.empty;
        }
        
        public static EquipmentType ForDto(this LandmarkCode landmarkCode)
        {
            switch (landmarkCode)
            {
                case LandmarkCode.FiberDistributingFrame: return EquipmentType.Rtu;
                case LandmarkCode.Coupler: return EquipmentType.Closure;
                case LandmarkCode.WiringCloset: return EquipmentType.Cross;
                case LandmarkCode.Manhole: return EquipmentType.EmptyNode;
                case LandmarkCode.RemoteTerminal: return EquipmentType.Terminal;
                case LandmarkCode.Other: return EquipmentType.Other;
            }
            return EquipmentType.Other;
        }

        public static string EventCodeForTable(this string eventCode)
        {
            var str = eventCode[0] == '0' ? @"S" : @"R";
            return $@"{str} : {eventCode[1]}";
        }

        public static string ForDeviationInTable(this RftsEventDto rftsEventDto, ShortDeviation deviation, string letter)
        {
            var formattedValue = $@"{(short)deviation.Deviation / 1000.0: 0.000}";
            if ((deviation.Type & ShortDeviationTypes.IsExceeded) != 0)
            {
                formattedValue += $@" ( {letter} ) ";
                rftsEventDto.IsFailed = true;
                rftsEventDto.DamageType += $@" {letter}";
            }
            return formattedValue;
        }
      
        public static FiberState ToFiberState(this RftsLevelType level)
        {
            switch (level)
            {
                case RftsLevelType.Minor: return FiberState.Minor;
                case RftsLevelType.Major: return FiberState.Major;
                case RftsLevelType.Critical: return FiberState.Critical;
                default: return FiberState.User;
            }
        }
    }
}