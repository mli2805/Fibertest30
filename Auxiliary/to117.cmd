rem команда подается в папке солюшена, если перенес батник, измени переходы между папками
cd c:\VsGitProjects\Fibertest30\Backend\
dotnet publish Fibertest30.sln -c Release --runtime linux-x64 --no-self-contained

set address="172.16.4.117"

c:\putty\pscp.exe -r c:\VsGitProjects\Fibertest30\Backend\src\Fibertest30.Api\bin\Release\net7.0\linux-x64\publish\ user@%address%:/var/fibertest/api