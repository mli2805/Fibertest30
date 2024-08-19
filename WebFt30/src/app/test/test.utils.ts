import * as grpc from 'src/grpc-generated';

import { AppState, DeviceInfo } from '../core';
import { ServerError } from '../core/models/server-error';
import { AppTimezone, MeasurementSettings, OtauPortPath } from '../core/store/models';
import { MapUtils } from '../core/map.utils';

export class TestUtils {
  static InitialAppState: Partial<AppState> = {
    auth: {
      loading: false,
      error: null,
      token: null,
      user: null
    },
    settings: {
      theme: 'dark',
      language: 'en',
      dateTimeFormat: 'en',
      saveUserSettingsError: null
    }
  };

  static ValidToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0YWRjYTdmYS03ZTMyLTQ1OTUtOGFhMC1kZGI5Y2VmYjRjYmQiLCJqdGkiOiIwYzE1ZjI5MC0wNWVhLTQyNWUtODI4NC1hZWFiYjY1MGMxNGIiLCJuYW1lIjoiVmlld2VyIiwicm9sZSI6IlZpZXdlciIsIm5iZiI6MTY4MTIwNjE5MiwiZXhwIjoxNjgxMjA2NDkyLCJpc3MiOiJSZnRzNDAwIiwiYXVkIjoiUmZ0czQwMCJ9.h9ANo0tR_lvnJGX5kZ3nBxhQiftRnS84dsnpjL8tuc4';

  static ValidUser: grpc.User = {
    userId: '4adca7fa-7e32-4595-8aa0-ddb9cefb4cbd',
    userName: 'jdoe',
    role: 'Operator',
    permissions: [],
    firstName: 'John',
    lastName: 'Doe',
    email: 'j.doe@company.com',
    phoneNumber: '+4094445433',
    jobTitle: 'RFTS Expert'
  };

  static ValidUserSettings: grpc.UserSettings = {
    language: 'en',
    theme: 'dark',
    dateTimeFormat: 'short'
  };

  static ValidDeviceInfoResponse = TestUtils.getDeviceInfoResponse();

  static ValidDeviceInfo: DeviceInfo = MapUtils.toDeviceInfo(TestUtils.getDeviceInfoResponse());

  static MyServerError: ServerError = new ServerError('MyServerError', 'MyServerError');

  private static getDeviceInfoResponse(): grpc.DeviceInfoResponse {
    return {
      serialNumber: '1234567890',
      ipV4Address: '127.0.0.1',
      timezone: new AppTimezone(),
      apiVersion: '1.0.0',
      supportedMeasurementParameters: {
        laserUnits: []
      },
      otaus: [],
      monitoringPorts: [],
      monitoringTimeSlots: [],
      activeAlarms: [],
      notificationSettings: {
        id: 1,
        emailServer: {
          enabled: true,
          serverAddress: '192.168.0.1',
          serverPort: 587,
          outgoingAddress: 'rfts400@email.com',
          isAuthenticationOn: true,
          serverUserName: 'RFTS400',
          isPasswordSet: true,
          serverPassword: '123456',
          verifyCertificate: false,
          floodingPolicy: true,
          smsOverSmtp: false
        },
        trapReceiver: {
          enabled: true,
          snmpVersion: 'v3',
          useVeexOid: false,
          customOid: '1.3.6.1.4.1.859383',
          community: 'VeEX',
          authoritativeEngineId: '54A3BEF1',
          userName: 'snmp-master',
          isAuthPwdSet: true,
          authenticationPassword: '123',
          authenticationProtocol: 'SHA',
          isPrivPwdSet: true,
          privacyPassword: '321',
          privacyProtocol: 'Aes256',
          trapReceiverAddress: '192.168.96.188:162',
          trapReceiverPort: 162
        }
      },
      networkSettings: {
        networkMode: '',
        localIpAddress: '192.168.96.222',
        localSubnetMask: '255.255.255.128',
        localGatewayIp: '192.168.96.3',
        primaryDnsServer: '8.8.8.8'
      },
      timeSettings: {
        appTimeZone: new AppTimezone(),
        ntpSettings: {
          primaryNtpServer: '0.debian.pool.ntp.org',
          secondaryNtpServer: '71.52.196.112'
        }
      },
      portLabels: [],
      rtus: []
    };
  }

  static MonitoringPortId = 0;
  static MeasurementSettings: MeasurementSettings = new MeasurementSettings();
}
