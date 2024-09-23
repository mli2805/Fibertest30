import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

function execShellCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
        reject(stderr);
      }
      resolve(stdout);
    });
  });
}

async function gRpcGenerate(protosPath: string, outputPath: string): Promise<void> {
  try {
    const allFiles = fs.readdirSync(protosPath);
    const protoFiles = allFiles.filter((file) => path.extname(file) === '.proto');

    for (const protoFile of protoFiles) {
      const command = `protoc --ts_out ${outputPath} --ts_opt long_type_string --ts_opt optimize_code_size --experimental_allow_proto3_optional --proto_path ${protosPath} ${protoFile}`;
      console.log(`${command}`);
      await execShellCommand(command);
    }
  } catch (error) {
    console.error('Error generating proto files:', error);
  }
}

function fixTs4114ErrorByAddingOverride(outputPath: string) {
  const allFiles = fs.readdirSync(outputPath);
  const affectedFiles = allFiles.filter(
    (file) => path.extname(file) === '.ts' && !file.endsWith('.client.ts')
  );

  for (const file of affectedFiles) {
    const filePath = path.join(outputPath, file);
    console.log('fix TS4114 override', filePath);
    fix4114Issue(filePath);
  }
}

function fix4114Issue(filePath: string): void {
  let content = fs.readFileSync(filePath, 'utf-8');

  const methods = [
    'create(value',
    'internalBinaryRead(reader',
    'internalBinaryWrite(message',
    'internalJsonWrite(message',
    'internalJsonRead(json'
  ];

  for (const method of methods) {
    const pattern = method.replace('(', '\\(');
    const regex = new RegExp(pattern, 'g');
    content = content.replace(regex, `override ${method}`);
  }

  fs.writeFileSync(filePath, content);
}

async function main() {
  const protosPath = path.join(__dirname, '../../Backend/src/Fibertest30.Api/Protos');
  const outputPath = path.join(__dirname, '../src/grpc-generated');

  console.log('protos:', protosPath);
  console.log('output:', outputPath);

  await gRpcGenerate(protosPath, outputPath);

  // protoc generates typescript with TS4114 error
  // needed only if --ts_opt optimize_speed is used
  // await fixTs4114ErrorByAddingOverride(outputPath);

  await fix4114Issue(path.join(__dirname, '../src/grpc-generated/google/protobuf/timestamp.ts'));
  await fix4114Issue(path.join(__dirname, '../src/grpc-generated/google/protobuf/duration.ts'));
  // await fix4114Issue(path.join(__dirname, '../src/grpc-generated/google/protobuf/wrappers.ts'));
}

// npx ts-node ./scripts/generate-grpc.ts
main();
