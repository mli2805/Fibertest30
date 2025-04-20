using GMap.NET;

namespace Iit.Fibertest.Dto
{
    public class AccidentLineDto
    {
        public string Caption = string.Empty;
     
        public int Number;
        public FiberState AccidentSeriousness;
        public string AccidentTypeLetter = string.Empty;
        public AccidentPlace AccidentPlace;

        public string TopLeft = string.Empty;
        public string TopCenter = string.Empty;
        public string TopRight = string.Empty;
        public string Bottom0 = string.Empty;
        public string Bottom1 = string.Empty;
        public string Bottom2 = string.Empty;
        public string Bottom3 = string.Empty;
        public string Bottom4 = string.Empty;
        public string PngPath = string.Empty; 

        public PointLatLng? Position;
    }
}