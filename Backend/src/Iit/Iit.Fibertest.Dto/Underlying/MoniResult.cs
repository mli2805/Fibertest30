﻿namespace Iit.Fibertest.Dto
{
    public class MoniResult
    {
        #region Measurement Return Code
        // Trace could be broken and ReturnCode could be MeasurementEndedNormally - means measurement process ended normally

        // user acknowledged errors (no base ref, invalid base ref)
        public ReturnCode UserReturnCode { get; set; } = ReturnCode.MeasurementEndedNormally;
        // errors that should be handled by service itself (hardware errors - port, otdr, etc) or Interrupted
        public ReturnCode HardwareReturnCode { get; set; } = ReturnCode.MeasurementEndedNormally;

        public bool IsMeasurementEndedNormally =>
            UserReturnCode == ReturnCode.MeasurementEndedNormally && HardwareReturnCode == ReturnCode.MeasurementEndedNormally;

        #endregion
       
     
        #region State of trace
        public bool IsNoFiber { get; set; }
        public bool IsFiberBreak { get; set; }
        public List<MoniLevel> Levels { get; set; } = new List<MoniLevel>();
        #endregion

        public BaseRefType BaseRefType { get; set; }
        public double FirstBreakDistance { get; set; }

        public List<AccidentInSor> Accidents { get; set; } // could be null

        public byte[] SorBytes { get; set; } // could be null

        public FiberState GetAggregatedResult()
        {
            if (!IsMeasurementEndedNormally)
            //if (ReturnCode == ReturnCode.MeasurementInterrupted)
                return FiberState.Unknown;

            if (IsNoFiber)
                return FiberState.NoFiber;
            if (IsFiberBreak)
                return FiberState.FiberBreak;

            var lvl = Levels.LastOrDefault(l => l.IsLevelFailed);
            return lvl == null ? FiberState.Ok : (FiberState) (int) lvl.Type;
        }

        public bool IsStateChanged(MoniResult previous)
        {
            if (previous == null) return true;
            var currentState = GetAggregatedResult();
            if (previous.GetAggregatedResult() != currentState)
                return true;

            if (currentState == FiberState.NoFiber || currentState == FiberState.Ok)
                return false;

            if (previous.Accidents.Count != Accidents.Count)
                return true;

            for (int i = 0; i < Accidents.Count; i++)
            {
                if (!Accidents[i].IsTheSame(previous.Accidents[i])) return true;
            }

            return false;
        }

        public MoniResult()
        {
        }

        public MoniResult(ReturnCode userReturnCode, ReturnCode hardwareReturnCode)
        {
            UserReturnCode = userReturnCode;
            HardwareReturnCode = hardwareReturnCode;
        }
    }
}
