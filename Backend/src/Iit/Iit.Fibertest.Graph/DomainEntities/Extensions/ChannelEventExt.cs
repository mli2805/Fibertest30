﻿using Iit.Fibertest.Dto;
using Iit.Fibertest.StringResources;

namespace Iit.Fibertest.Graph
{
    public static class ChannelEventExt
    {
        public static RtuPartState ChangeChannelState(this ChannelEvent channelEvent, RtuPartState previousState)
        {
            if (channelEvent == ChannelEvent.Nothing) return previousState;
            return channelEvent == ChannelEvent.Broken ? RtuPartState.Broken : RtuPartState.Ok;
        }
        public static string ToLocalizedString(this ChannelEvent state)
        {
            switch (state)
            {
                case ChannelEvent.Broken:
                    return Resources.SID_Broken;
                case ChannelEvent.Nothing:
                    return "";
                case ChannelEvent.Repaired:
                    return Resources.SID_Repaired;
                default: return "";
            }
        }

      
    }
}