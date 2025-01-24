namespace Iit.Fibertest.Dto
{
    public class AboutDto
    {
        public string DcSoftware = string.Empty;
        public string WebApiSoftware = string.Empty;
        public string WebClientSoftware = string.Empty;
        public List<AboutRtuDto> Rtus = new();
    }
}