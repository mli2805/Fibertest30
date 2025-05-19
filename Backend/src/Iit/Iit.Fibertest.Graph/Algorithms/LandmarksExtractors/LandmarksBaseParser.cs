﻿using GMap.NET;
using Iit.Fibertest.Dto;
using Iit.Fibertest.UtilsLib;
using Optixsoft.SorExaminer.OtdrDataFormat;

namespace Iit.Fibertest.Graph
{
    public class LandmarksBaseParser
    {
        private readonly Model _readModel;

        public LandmarksBaseParser(Model readModel)
        {
            _readModel = readModel;
        }

        // web client requests landmarks for trace, calculated on DC
        public List<Landmark> GetLandmarksFromBaseRef(OtdrDataKnownBlocks sorData, Trace trace)
        {
            var modelWith = _readModel
                .GetTraceComponentsByIds(trace);
            var modelWithoutAdjustmentPoint = modelWith
                .ExcludeAdjustmentPoints();
            return GetLandmarks(sorData, modelWithoutAdjustmentPoint, modelWith);
        }

        // LandmarksView in desktop client
        // already has traceModel - recalculate distances and returns landmarks
        // смысл в том чтобы не брать полную ридмодель и трассу, а брать traceModel когда нужен пересчет
        // но координаты могли измениться - нужен пересчет distances это можно из traceModel если там есть точки привязки
        // могли подменить оборудование - нужно чтобы новое оборудование уже было в traceModel с точками привязки
        public List<Landmark> GetLandmarksFromBaseRef(OtdrDataKnownBlocks sorData, TraceModelForBaseRef modelWith)
        {
            var modelWithoutAdjustmentPoint = modelWith.ExcludeAdjustmentPoints();
            return GetLandmarks(sorData, modelWithoutAdjustmentPoint, modelWith);
        }

        private List<Landmark> GetLandmarks(OtdrDataKnownBlocks sorData,
            TraceModelForBaseRef modelWithoutAdjustmentPoint, TraceModelForBaseRef modelWith)
        {
            var gpsDistance = 0.0;
            var result = new List<Landmark>();

            var rtu = _readModel.Rtus.First(r => r.NodeId == modelWithoutAdjustmentPoint.NodeArray[0].NodeId);

            var linkParameters = sorData.LinkParameters;
            var prevOwt = linkParameters.LandmarkBlocks[0].Location;
            var numberIncludingAdjustmentPoints = 0;
            for (int i = 0; i < linkParameters.LandmarksCount; i++)
            {
                var sorLandmark = linkParameters.LandmarkBlocks[i];
                var equipmentId = modelWithoutAdjustmentPoint.EquipArray[i].EquipmentId;
                var equipment = i > 0 ? modelWithoutAdjustmentPoint.EquipArray[i] : null;
                var fiber = i > 0 ? modelWithoutAdjustmentPoint.FiberArray[i - 1] : null;
                var section = fiber == null
                    ? 0
                    : fiber.UserInputedLength > 0
                        ? fiber.UserInputedLength / 1000
                        : Math.Round(modelWithoutAdjustmentPoint.DistancesMm[i - 1] / 1_000_000.0, 3);
                gpsDistance += section;
                var comment = i == 0
                    ? _readModel.Rtus.First(r => r.NodeId == modelWithoutAdjustmentPoint.NodeArray[0].NodeId).Comment
                    : modelWithoutAdjustmentPoint.NodeArray[i].Comment;

                if (i > 0)
                {
                    // в случае разворотов один и тот же инстанс оборудования несколько раз в массиве
                    var equipmentWithAdj = modelWith.EquipArray
                        .First(e => e.EquipmentId == equipmentId);
                    // начинаем искать в массиве с позиции оборудования использованного на предыдущей итерации
                    numberIncludingAdjustmentPoints = 
                        Array.IndexOf(modelWith.EquipArray, equipmentWithAdj, numberIncludingAdjustmentPoints);
                }

                var landmark = new Landmark
                {
                    IsFromBase = true,
                    Number = i,
                    NumberIncludingAdjustmentPoints = numberIncludingAdjustmentPoints,
                    NodeId = modelWithoutAdjustmentPoint.NodeArray[i].NodeId,
                    NodeTitle = i == 0 ? rtu.Title : modelWithoutAdjustmentPoint.NodeArray[i].Title ?? "",
                    FiberId = fiber?.FiberId ?? Guid.Empty,
                    NodeComment = comment ?? "",
                    EquipmentId = equipmentId,
                    EquipmentTitle = i > 0 ? equipment?.Title ?? "" : "",
                    EquipmentType = ToEquipmentType(sorLandmark.Code),
                    EventNumber = sorLandmark.RelatedEventNumber - 1,
                    LeftCableReserve = equipment?.CableReserveLeft ?? 0,
                    RightCableReserve = equipment?.CableReserveRight ?? 0,
                    GpsDistance = gpsDistance,
                    GpsSection = section,
                    IsUserInput = fiber is { UserInputedLength: > 0 },
                    OpticalDistance = sorData.OwtToLenKm(sorLandmark.Location),
                    OpticalSection = sorData.OwtToLenKm(sorLandmark.Location - prevOwt),
                    GpsCoors = GetPointLatLng(sorLandmark),
                };
                result.Add(landmark);
                prevOwt = sorLandmark.Location;
            }
            return result;
        }

        private PointLatLng GetPointLatLng(Optixsoft.SorExaminer.OtdrDataFormat.Structures.Landmark landmark)
        {
            var lat = SorIntCoorToDoubleInDegrees(landmark.GpsLatitude);
            var lng = SorIntCoorToDoubleInDegrees(landmark.GpsLongitude);
            return new PointLatLng(lat, lng);
        }

        private double SorIntCoorToDoubleInDegrees(int coor)
        {
            var degrees = Math.Truncate(coor / 1e6);
            var minutes = Math.Truncate(coor % 1e6 / 1e4);
            var seconds = (coor % 1e4) / 100;
            return degrees + minutes / 60 + seconds / 3600;
        }

        private static EquipmentType ToEquipmentType(LandmarkCode landmarkCode)
        {
            switch (landmarkCode)
            {
                case LandmarkCode.FiberDistributingFrame: return EquipmentType.Rtu;
                case LandmarkCode.Coupler: return EquipmentType.Closure;
                case LandmarkCode.WiringCloset: return EquipmentType.Cross;
                case LandmarkCode.Manhole: return EquipmentType.EmptyNode;
                case LandmarkCode.CableSlackLoop: return EquipmentType.CableReserve;
                case LandmarkCode.RemoteTerminal: return EquipmentType.Terminal;
                case LandmarkCode.Other: return EquipmentType.Other;
            }
            return EquipmentType.Error;
        }

    }


}