﻿using Iit.Fibertest.Dto;
using Iit.Fibertest.UtilsLib;
using Optixsoft.SorExaminer.OtdrDataFormat;

namespace Iit.Fibertest.Graph
{
    public class BaseRefLandmarksTool
    {
        private static readonly double LinK = 1.02;

        private readonly Model _readModel;

        public BaseRefLandmarksTool(Model readModel)
        {
            _readModel = readModel;
        }

        public void AugmentFastBaseRefSentByMigrator(Guid traceId, BaseRefDto baseRefDto)
        {
            var trace = _readModel.Traces.First(t => t.TraceId == traceId);
            var message = SorData.TryGetFromBytes(baseRefDto.SorBytes, out var otdrKnownBlocks);
            if (message != "") return;
            ApplyTraceToBaseRef(otdrKnownBlocks, trace,
                otdrKnownBlocks.LinkParameters.LandmarkBlocks.Length < trace.NodeIds.Count);
            baseRefDto.SorBytes = otdrKnownBlocks.ToBytes();
        }

        public void ApplyTraceToBaseRef(OtdrDataKnownBlocks otdrKnownBlocks, Trace trace,
            bool needToInsertLandmarksForEmptyNodes)
        {
            var modelWithoutAdjustmentPoint = _readModel
                .GetTraceComponentsByIds(trace)
                .ExcludeAdjustmentPoints();
            if (needToInsertLandmarksForEmptyNodes)
                InsertLandmarks(otdrKnownBlocks, modelWithoutAdjustmentPoint);
            ReCalculateLandmarksLocations(otdrKnownBlocks, modelWithoutAdjustmentPoint);
        }

        public void ReCalculateLandmarksLocations(OtdrDataKnownBlocks sorData, TraceModelForBaseRef model)
        {
            var landmarks = sorData.LinkParameters.LandmarkBlocks;
            ApplyPropertiesToLandmarks(sorData, model);

            var distancesMm = new int[landmarks.Length - 1];

            var leftLandmarkIndex = 0;

            while (leftLandmarkIndex < landmarks.Length - 1)
            {
                var rightLandmarkIndex = GetIndexOfLastLandmarkOfFixedSection(sorData, leftLandmarkIndex);

                var ratio = GetRatioForFixedSection(sorData, model, leftLandmarkIndex, rightLandmarkIndex);

                for (int i = leftLandmarkIndex; i < rightLandmarkIndex; i++)
                {
                    int pos;
                    if (model.FiberArray[i].UserInputedLength > 0)
                    {
                        pos = (int)Math.Round(model.FiberArray[i].UserInputedLength * 1000 * LinK);
                    }
                    else
                    {
                        pos = (int)Math.Round(model.DistancesMm[i] * ratio);
                    }
                    pos += model.EquipArray[i].Type == EquipmentType.CableReserve
                        ? (int)Math.Round(model.EquipArray[i].CableReserveLeft / 2.0 * 1000 * LinK)
                        : (int)Math.Round(model.EquipArray[i].CableReserveRight * 1000 * LinK);
                    pos += model.EquipArray[i + 1].Type == EquipmentType.CableReserve
                        ? (int)Math.Round(model.EquipArray[i + 1].CableReserveLeft / 2.0 * 1000 * LinK)
                        : (int)Math.Round(model.EquipArray[i + 1].CableReserveLeft * 1000 * LinK);
                    distancesMm[i] = pos;
                }

                // first and last landmarks of fixed section
                // are related to events, their locations are constant
                for (int i = leftLandmarkIndex + 1; i < rightLandmarkIndex; i++)
                {
                    landmarks[i].Location = landmarks[i - 1].Location + sorData.GetOwtFromMm(distancesMm[i - 1]);
                }

                leftLandmarkIndex = rightLandmarkIndex;
            }
        }

        private void InsertLandmarks(OtdrDataKnownBlocks sorData, TraceModelForBaseRef model)
        {
            var newLandmarks = new Optixsoft.SorExaminer.OtdrDataFormat.Structures.Landmark[model.EquipArray.Length];

            var oldLandmarkIndex = 0;
            for (var i = 0; i < model.EquipArray.Length; i++)
            {
                if (model.EquipArray[i].Type > EquipmentType.CableReserve)
                {
                    newLandmarks[i] = sorData.LinkParameters.LandmarkBlocks[oldLandmarkIndex];
                    oldLandmarkIndex++;
                }
                else
                    newLandmarks[i] = new Optixsoft.SorExaminer.OtdrDataFormat.Structures.Landmark() { Code = LandmarkCode.Manhole };
            }

            sorData.LinkParameters.LandmarkBlocks = newLandmarks;
            sorData.LinkParameters.LandmarksCount = (short)newLandmarks.Length;
        }

        private void ApplyPropertiesToLandmarks(OtdrDataKnownBlocks sorData, TraceModelForBaseRef model)
        {
            var landmarks = sorData.LinkParameters.LandmarkBlocks;

            for (int i = 0; i < landmarks.Length; i++)
            {
                var landmarkTitle = model.NodeArray[i].Title;
                if (i != 0 && !string.IsNullOrEmpty(model.EquipArray[i].Title))
                    landmarkTitle += $@" / {model.EquipArray[i].Title}";

                landmarks[i].Comment = landmarkTitle; // utf8, Reflect can now read it
                landmarks[i].Code = model.EquipArray[i].Type.ToLandmarkCode();
                landmarks[i].GpsLatitude = GisLabCalculator.GpsInSorFormat(model.NodeArray[i].Position.Lat);
                landmarks[i].GpsLongitude = GisLabCalculator.GpsInSorFormat(model.NodeArray[i].Position.Lng);
            }
        }

        /// <summary>
        /// фиксированный участок, т.е. участок между 2 ориентирами, которые привязаны к событиям
        ///
        /// для автоматического задания базовой
        ///     только начало и конец трассы привязаны, т.е. вся трасса - 1 участок
        ///
        /// для ручного задания базовой
        ///     пользователь может при редактировании привязать сколько захочет ориентиров
        ///     к событиям, но начало и конец обязательно
        /// </summary>
        /// <param name="sorData"></param>
        /// <param name="firstLandmarkIndex">номер левого (начального) ориентира участка</param>
        /// <returns>номер правого (конечного) ориентира участка</returns>
        private int GetIndexOfLastLandmarkOfFixedSection(OtdrDataKnownBlocks sorData, int firstLandmarkIndex)
        {
            var endIndex = firstLandmarkIndex + 1;
            var landmarks = sorData.LinkParameters.LandmarkBlocks;

            while (landmarks[endIndex].RelatedEventNumber == 0)
            {
                endIndex++;
            }
            return endIndex;
        }

        private double GetRatioForFixedSection(OtdrDataKnownBlocks sorData, TraceModelForBaseRef model,
            int leftRealEquipmentIndex, int rightRealEquipmentIndex)
        {
            var onGraph = GetNotUserInputDistancesFromGraph(model, leftRealEquipmentIndex, rightRealEquipmentIndex);
            var onBaseRef =
                GetNotUserInputDistancesFromRefMm(sorData, model, leftRealEquipmentIndex, rightRealEquipmentIndex);
            return onBaseRef / onGraph;
        }

        // возвращает сумму GPS-длин участков где пользователь ничего не ввел
        private int GetNotUserInputDistancesFromGraph(TraceModelForBaseRef model,
            int leftEquipmentIndex, int rightEquipmentIndex)
        {
            int result = 0;
            for (int i = leftEquipmentIndex; i < rightEquipmentIndex; i++)
                result += model.FiberArray[i].UserInputedLength > 0 ? 0 : model.DistancesMm[i];
            return result;
        }

        // оптическое расстояние между 2 ориентирами
        // если на этом отрезке есть такое, то отнимаем пользовательские длины и кабельные резервы
        private double GetNotUserInputDistancesFromRefMm(OtdrDataKnownBlocks sorData, TraceModelForBaseRef model,
            int leftEquipmentIndex, int rightEquipmentIndex)
        {
            var result =
                sorData.GetDistanceBetweenLandmarksInMm(leftEquipmentIndex, rightEquipmentIndex);

            for (int i = leftEquipmentIndex; i < rightEquipmentIndex; i++)
            {
                if (model.FiberArray[i].UserInputedLength > 0)
                    result -= model.FiberArray[i].UserInputedLength * 1000 * LinK;
            }

            if (model.EquipArray[leftEquipmentIndex].CableReserveRight > 0)
                result -= model.EquipArray[leftEquipmentIndex].CableReserveRight * 1000 * LinK;
            for (int i = leftEquipmentIndex + 1; i < rightEquipmentIndex; i++)
            {
                if (model.EquipArray[i].CableReserveLeft > 0)
                    result -= model.EquipArray[i].CableReserveLeft * 1000 * LinK;
                if (model.EquipArray[i].CableReserveRight > 0)
                    result -= model.EquipArray[i].CableReserveRight * 1000 * LinK;
            }
            if (model.EquipArray[rightEquipmentIndex].CableReserveLeft > 0)
                result -= model.EquipArray[rightEquipmentIndex].CableReserveLeft * 1000 * LinK;

            return result;
        }
    }
}