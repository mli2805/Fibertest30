# Installation

This is current running procedure, which will change as soon as our build process changes.

Current procedure does not require old C++ firmware to be installed in /usr/local/rtu or somewhere else.


## Create the root folder in /usr/local

    mkdir -p /usr/local/rfts400


## Install ASP.NET Core Runtime 7 for ARM32 Linux in /usr/local/rfts400/dotnet-7/

  1. Download aspnetcore-runtime-7.0.9-linux-arm.tar.gz from https://dotnet.microsoft.com/en-us/download/dotnet/7.0
  2. Create dir to hold the .NET binaries: mkdir /home/root/rfts400/dotnet-7/
  3. Unpack the downloaded archive into /usr/local/rfts400/dotnet-7/


## Install OtdrMeasEngine with libusb-0.1 (required only for using real OTDR device, not needed for OTDR emulator)

OtdrMeasEngine should be built with OME_USB=rtu (requires libusb-0.1), OME_GRPC=1 (requires gRPC).

The install directory contents must be then copied to /usr/local/rfts400/iit_otdr/.

The libusb-0.1.so* files must be copied to /usr/local/rfts400/iit_otdr/lib/.


## Install lighttpd

Lighttpd must be installed into /usr/local/rfts400/lighttpd/.

The /usr/local/rfts400/lighttpd/usr/local/lib/ folder must at least contain mod_rewrite.so.

NOTE: mod_rewrite uses PCRE for its regular expressions matching, and generally lighttpd requires PCRE during built.
      But starting from 1.4.65 it's allowed to use the catchall "" filter w/o PCRE.

NOTE: Seems like starting from 1.4.70 the functionality of mod_rewrite becomes built-into the lighttpd executable,
      and mod_rewrite module is not built separately.


## Install .NET files into /usr/local/rfts400/api/

On device:
   mkdir -p /usr/local/rfts400/api

On dev host:
  1. dotnet publish -c Release -r linux-arm -p:PublishReadyToRun=true -p:PublishSingleFile=false --self-contained false .\Backend\src\Fibertest30.Api
        (actually -p:PublishSingleFile=false --self-contained false are defaults, so can be omitted)
  2. scp -r <publish-dir>\* root@<device-ip>:/usr/local/rfts400/api/


## Install Angular files into /usr/local/rfts400/ui/

On device
   mkdir -p /usr/local/rfts400/ui

On dev host:
  1. cd <VesionRfts/Rfts400/Web>
  2. ng build
  3. scp -r ./dist/rfts400/* root@<device-ip>:/usr/local/rfts400/ui/


## Create configuration file for lighttpd

Below is the sample working configuration file.
The '-2' postfix on errorlog and pid-file is used to distinguish files from the original C++ firmware,
which may be installed on the same device.
You may also want to change the TCP port in server.port and $SERVER["socket"] assignments,
e.g. if you plan to run the .NET version simultaneously with the original C++ firmware.

server.modules += ( "mod_rewrite" )
server.errorlog = "/var/log/lighttpd-2"
server.pid-file = "/var/run/lighttpd-2.pid"
server.document-root = "/usr/local/rfts400/ui/"
server.port = 80
server.bind = "0.0.0.0"                   # listen to IPv4
$SERVER["socket"] == "[::]:80" {  }       # listen to IPv6
mimetype.assign = (
  ".html" => "text/html",
  ".js" => "application/javascript",
  ".css" => "text/css",
  ".woff" => "application/font-woff",
  ".jpg" => "image/jpeg",
  ".png" => "image/png"
)
index-file.names = ( "index.html" )
url.rewrite-if-not-file = ( "" => "/index.html" )


## Check date/time on the device

If the date/time is invalid on the device then the API will fail to validate auth tokens and UI will need to login after refresh.
Setting UTC date/time seems to be enough.
ATTENTION: Don't forget to sync system date/time with hardware clock using hwclock command, otherwise the date/time will reset after reboot.


## Run the OtdrMeasEngine gRPC server (required only for using real OTDR device, not needed for OTDR emulator)

The server is called by the API upon start, so it must be run first.

To make sure libusb-0.1 is loaded when needed, we use the LD_LIBRARY_PATH variable.

   LD_LIBRARY_PATH=/usr/local/rfts400/iit_otdr/lib /usr/local/rfts400/iit_otdr/bin/grpc_otdr \
      --root /usr/local/rfts400/iit_otdr --log /var/log/reflect-2.log --verbose

The --verbose will cause each gRPC call to be logged to stdout.


## Edit API's appsettings.json (required only for using OTDR emulator instead of real OTDR device)

By default appsettings.json is written to use real OTDR device. If you want to use OTDR emulator,
you need to change "Emulator:Enabled" from false to true.

"Emulator": {
    "Enabled": true
}


## Run the API

Please note, that dotnet must be run within the API installation folder.

  1. cd /usr/local/rfts400/api
  2. /usr/local/rfts400/dotnet-7/dotnet ./Fibertest30.Api.dll

API should be ready after the line with 'Content root path: ...'.


## Run lighttpd for UI

   /usr/local/rfts400/lighttpd/sbin/lighttpd -f /usr/local/rfts400/lighttpd.conf -m /usr/local/rfts400/lighttpd/lib/ -D

Omit the -D switch if you want lighttpd to go to background as daemon.
