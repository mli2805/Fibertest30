namespace Fibertest30.Infrastructure.Device;

public class OtdrSettings
{
    public const string SectionName = "Otdr";

    public OtdrConnectionParameters? ConnectionParameters { get; set; }

    public class OtdrConnectionParameters
    {
        public string? Use { get; set; } // allows easier merging multiple setting sources
        public TcpOtdrConnectionParameters? Tcp { get; set; }
        public UsbOtdrConnectionParameters? Usb { get; set; }

        public class TcpOtdrConnectionParameters
        {
            public string? Host { get; set; }
            public int Port { get; set; }

            public TcpOtdrConnectionParameters Validate()
            {
                // TODO: Consider using the required C#11 keyword and Microsoft.Extensions.Options.DataAnnotations for this instead
                if (Host == null)
                {
                    throw new ArgumentNullException(nameof(Host));
                }
                if (Port <= 0)
                {
                    throw new ArgumentException(nameof(Port));
                }
                return this;
            }
        }

        public class UsbOtdrConnectionParameters { }

        public OtdrConnectionParameters Validate()
        {
            // TODO: Consider using the required C#11 keyword and Microsoft.Extensions.Options.DataAnnotations for this instead
            if (Use != null && Use != nameof(Usb) && Use != nameof(Tcp))
            {
                throw new ArgumentException($"Invalid {nameof(Use)} value: {Use}");
            }
            if (Usb == null && Tcp == null && Use != nameof(Usb))
            {
                throw new ArgumentException($"Either {nameof(Tcp)} or {nameof(Usb)} must be specified," +
                    $" or {nameof(Use)} must be \"{nameof(Usb)}\"");
            }
            if (Usb != null && Tcp != null && Use == null)
            {
                throw new ArgumentException($"{{nameof(Use)}} must be specified, " +
                    $"if both {nameof(Tcp)} and {nameof(Usb)} are specified");
            }
            if (Tcp != null)
            {
                Tcp.Validate();
            }
            return this;
        }
    }

    public OtdrSettings Validate()
    {
        // TODO: Consider using the required C#11 keyword and Microsoft.Extensions.Options.DataAnnotations for this instead
        if (ConnectionParameters == null)
        {
            throw new ArgumentNullException(nameof(ConnectionParameters));
        }
        ConnectionParameters.Validate();
        return this;
    }
}
