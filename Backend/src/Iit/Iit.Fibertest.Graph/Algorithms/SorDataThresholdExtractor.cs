﻿using Iit.Fibertest.Dto;
using Iit.Fibertest.UtilsLib;
using Optixsoft.SorExaminer.OtdrDataFormat;
using Optixsoft.SorExaminer.OtdrDataFormat.Structures;

namespace Iit.Fibertest.Graph
{
    public static class ThresholdFromSorBytesExtractor
    {
        public static ThresholdSet ExtractThresholds(this byte[] bytes)
        {
            if (SorData.TryGetFromBytes(bytes, out OtdrDataKnownBlocks sorData) != "")
                return null;

            var thresholdSet = new ThresholdSet() { levels = new List<Level>() };
            var levelNames = new List<string>() {@"Minor", @"Major", @"Critical"};

            levelNames.Select(n=>sorData.ExtractRftsLevel(n))
                .Where(l=>l != null).ToList()
                .ForEach(r=>thresholdSet.levels.Add(r));

            return thresholdSet;
        }

        private static Level ExtractRftsLevel(this OtdrDataKnownBlocks sorData, string levelName)
        {
            var rftsParametersLevel =
                sorData.RftsParameters.Levels.FirstOrDefault(l => l.LevelName.ToString() == levelName);
            if (rftsParametersLevel == null) return null;
            return new Level()
            {
                name = rftsParametersLevel.LevelName.ToString(), 
                groups = new List<Group>(){ new Group() { thresholds = GetLevelThresholds(rftsParametersLevel, sorData) }},
                advancedThresholds = GetAdvancedThresholds(sorData),
            };
        }

        private static Thresholds GetLevelThresholds(RftsLevel levelParams, OtdrDataKnownBlocks sorData)
        {
            return new Thresholds()
            {
                eventReflectance = Iit2CmbThreshold(levelParams.LevelThresholdSet.ReflectanceThreshold),
                eventLoss = Iit2CmbThreshold(levelParams.LevelThresholdSet.AttenuationThreshold),
                eventLeadingLossCoefficient =
                    Iit2CmbThreshold(levelParams.LevelThresholdSet.AttenuationCoefThreshold),
                eventMaxLevel = null, // PON, reflect do not work with this parameter

                reflectiveEventPosition = IitUniversalParam2CmbThreshold(sorData, @"EvtRDetectDeltaLen"),
                nonReflectiveEventPosition = IitUniversalParam2CmbThreshold(sorData, @"EvtDetectDeltaLen"),
            };
        }

        private static AdvancedThresholds GetAdvancedThresholds(OtdrDataKnownBlocks sorData)
        {
            return new AdvancedThresholds()
            {
                attenuationCoefficientChangeForNewEvents = IitUniversalParam2double(sorData, @"EvtDetectDeltaCT"),
                eofAttenuationCoefficientChangeForFiberBreak = IitUniversalParam2double(sorData, @"EvtChangeСT"),
                eofLossChangeForFiberBreak = IitUniversalParam2double(sorData, @"EvtChangeЕT"),
                maxEofAttenuationCoefficientForFiberBreak = 0.05,
                // noiseLevelChangeForFiberElongation, // is not used in IIT
            };
        }

        private static double IitUniversalParam2double(OtdrDataKnownBlocks sorData, string paramName)
        {
            var parameter = sorData.RftsParameters.UniversalParameters.FirstOrDefault(p => p.Name == paramName);
            if (parameter == null) return 0;

            return (double)parameter.Value / parameter.Scale;
        }

        private static CombinedThreshold IitUniversalParam2CmbThreshold(OtdrDataKnownBlocks sorData, string paramName)
        {
            var parameter = sorData.RftsParameters.UniversalParameters.FirstOrDefault(p => p.Name == paramName);
            if (parameter == null) return null;

            return new CombinedThreshold()
            {
                min = - parameter.Value / parameter.Scale,
                max = parameter.Value / parameter.Scale,
            };
        }

        private static CombinedThreshold Iit2CmbThreshold(ShortThreshold iitThreshold)
        {
            // ShortThreshold contains int values multiplied by 1000
            const double iitCoef = 1000;

            var cmbThreshold = new CombinedThreshold();
            if (iitThreshold.IsAbsolute)
            {
                cmbThreshold.min = - iitThreshold.AbsoluteThreshold / iitCoef;
                cmbThreshold.max = iitThreshold.AbsoluteThreshold / iitCoef;
            }
            else
            {
                cmbThreshold.increase = iitThreshold.RelativeThreshold / iitCoef;
                cmbThreshold.decrease = -iitThreshold.RelativeThreshold / iitCoef;
            }
            return cmbThreshold;
        }
    }
}
