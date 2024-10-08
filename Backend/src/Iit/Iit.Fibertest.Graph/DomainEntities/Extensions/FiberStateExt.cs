﻿using Iit.Fibertest.Dto;
using Iit.Fibertest.StringResources;

namespace Iit.Fibertest.Graph
{
    public static class FiberStateExt
    {
        public static FiberState ToFiberState(this string state)
        {
            switch (state.ToLower())
            {
                case "ok": return FiberState.Ok;
                case "no_fiber": return FiberState.NoFiber;
                case "fiber_break": return FiberState.FiberBreak;
                case "critical": return FiberState.Critical;
                case "major": return FiberState.Major;
                case "minor": return FiberState.Minor;
            }

            return FiberState.Unknown;
        }

        public static string ToLocalizedString(this FiberState state)
        {
            switch (state)
            {
                case FiberState.Nothing:
                    return "";
               case FiberState.NotInTrace:
                    return Resources.SID_Not_in_trace;
                case FiberState.NotJoined:
                    return Resources.SID_Not_joined;
                case FiberState.DistanceMeasurement:
                    return Resources.SID_Distace_measurement;
                case FiberState.Unknown:
                    return Resources.SID_Unknown;
                case FiberState.Ok:
                    return Resources.SID_Ok;
                case FiberState.Suspicion:
                    return Resources.SID_Suspicion;
                case FiberState.Minor:
                    return Resources.SID_Minor;
                case FiberState.Major:
                    return Resources.SID_Major;
                case FiberState.User:
                    return Resources.SID_User_s_threshold;
                case FiberState.Critical:
                    return Resources.SID_Critical;
                case FiberState.FiberBreak:
                    return Resources.SID_fiber_break;
                case FiberState.NoFiber:
                    return Resources.SID_No_fiber;
                case FiberState.HighLighted:
                    return Resources.SID_Highlighted;
                default:
                    return Resources.SID_Ok;
            }
        }

    
        public static Uri GetPictogram(this FiberState state)
        {
            switch (state)
            {
                case FiberState.NotJoined:
                case FiberState.Unknown:
                    return new Uri(@"pack://application:,,,/Resources/LeftPanel/EmptySquare.png");
                case FiberState.Ok:
                    return new Uri(@"pack://application:,,,/Resources/LeftPanel/GreenSquare.png");
                case FiberState.Suspicion:
                    return new Uri(@"pack://application:,,,/Resources/LeftPanel/YellowSquare.png");
                case FiberState.Minor:
                    return new Uri(@"pack://application:,,,/Resources/LeftPanel/MinorSquare.png");
                case FiberState.Major:
                    return new Uri(@"pack://application:,,,/Resources/LeftPanel/FuchsiaSquare.png");
                case FiberState.User:
                    return new Uri(@"pack://application:,,,/Resources/LeftPanel/GreenSquare.png");
                case FiberState.Critical:
                case FiberState.FiberBreak:
                case FiberState.NoFiber:
                    return new Uri(@"pack://application:,,,/Resources/LeftPanel/RedSquare.png");
                default:
                    return new Uri(@"pack://application:,,,/Resources/LeftPanel/EmptySquare.png");
            }
        }
    }

    public static class TraceToTceLinkStateExt
    {
        public static Uri GetPictogram(this TraceToTceLinkState state)
        {
            switch (state)
            {
                case TraceToTceLinkState.NoLink:
                    return new Uri(@"pack://application:,,,/Resources/LeftPanel/EmptySquare.png");
                case TraceToTceLinkState.LinkTceOn:
                    return new Uri(@"pack://application:,,,/Resources/LeftPanel/GreenSquare.png");
                case TraceToTceLinkState.LinkTceOff:
                    return new Uri(@"pack://application:,,,/Resources/LeftPanel/GreySquare.png");
                default:
                    return new Uri(@"pack://application:,,,/Resources/LeftPanel/EmptySquare.png");
            }
        }
    }
}