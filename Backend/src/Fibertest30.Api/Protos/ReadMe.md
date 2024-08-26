After adding a new proto file:

- Edit the .csproj file to generate the gRpc code for the server: 

`<Protobuf Include="Protos\demo.proto" GrpcServices="Server" />`
or
`<Protobuf Include="Protos\demo.proto" ProtoRoot="Protos" GrpcServices="Server" />`
if you import any data.*.proto files

- Add new service to /Services
- Add grpc mapping (app.MapGrpcService<DemoService>)



To generate gRpc clients for Web application:
- cd Web
- npx ts-node .\scripts\generate-grpc.ts 