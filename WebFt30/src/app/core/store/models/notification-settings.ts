export class NotificationSettings {
  id!: number;
  emailServer!: EmailServer;
  trapReceiver!: TrapReceiver;
  syslog!: SyslogNotificationSettings;
  push!: PushNotificationSettings;
  relay!: RelayNotificationSettings;
}

export class EmailServer {
  enabled!: boolean;
  smtpServerAddress!: string;
  smtpServerPort!: number;
  outgoingAddress!: string;
  isAuthenticationOn!: boolean;
  serverUserName!: string;
  isPasswordSet!: boolean;
  serverPassword!: string;
  verifyCertificate!: boolean;
  floodingPolicy!: boolean;
  smsOverSmtp!: boolean;
}

export class TrapReceiver {
  enabled!: boolean;
  snmpVersion = 'v1';
  useIitOid = true;
  customOid = '';
  community = '';
  authoritativeEngineId = '';
  userName = '';
  isAuthPswSet = false;
  authenticationPassword = '';
  authenticationProtocol = 'SHA';
  isPrivPswSet = false;
  privacyPassword = '';
  privacyProtocol = 'Aes256';
  trapReceiverAddress = '';
  trapReceiverPort = 162;
  snmpLanguage = 'en-US';
}

export class SyslogHost {
  name!: string;
  version!: string;
  hostAddress!: string;
  transportProtocol!: string;
}

export class SyslogNotificationSettings {
  enabled!: boolean;
  hosts!: SyslogHost[];
}
export class PushNotificationSettings {
  enabled!: boolean;
}
export class RelayNotificationSettings {
  enabled!: boolean;
  relay1Enabled!: boolean;
  relay2Enabled!: boolean;
}
