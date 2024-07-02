# Code in this folder

All the C# code in this folder is an analog of this Python sample:
https://gist.github.com/nourspace/04264118a5c4c0bffe5a8724b486ab4d

## prometheus.proto

**prometheus.proto** - is taken from this very sample.<br>
  Note: it is **proto3**!

## Prometheus.cs

  **Prometheus.cs** - is generated from 'prometheus.proto' and protoc.exe (https://protobuf.dev/downloads/)

  Command line (if you place all files in [bin] folder with protoc.exe):<br> 
  _protoc.exe --proto_path=. --csharp_out=. prometheus.proto_

  
# Don't forget to enable the remote write feature on the Prometheus side

  Specify the Prometheus command line parameter:<br>
  _--web.enable-remote-write-receiver_