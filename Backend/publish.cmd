dotnet publish Fibertest30.sln -c Release --runtime linux-x64 --no-self-contained

xcopy /E/Y/I c:\VsGitProjects\Fibertest30\Backend\src\Fibertest30.Api\bin\Release\net8.0\linux-x64\publish c:\temp\publish

rem scp -r c:\VsGitProjects\Fibertest30\Backend\src\Fibertest30.Api\bin\Release\net8.0\linux-x64\publish\*.* user@172.16.4.118:/var/fibertest/api/

rem scp -r c:\temp\publish\*.* user@172.16.4.177:var/fibertest/api/

rem ren c:\temp\publish api

pause


