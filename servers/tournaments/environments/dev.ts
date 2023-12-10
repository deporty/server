import { ServiceAccount } from 'firebase-admin';

export const env = {
  bucketName: 'deporty-dev.appspot.com',
  projectId: 'deporty-dev',
  databaseURL: '0,',
  middlewares: {
    'is-key-present': false,
    'is-authorized-user': false,
  },
  logging: false,
  directivesKindMember: ['owner', 'technical-director'],
  playerRoleId: 'hkO0lp8lbzq50s82Wu60',
  credentials: {
    type: 'service_account',
    project_id: 'deporty-dev',
    private_key_id: 'db4c3fe04c601ff8a4678d60a68ad56de93a334e',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8pFL/0h00Xxhr\nKgRlNICZFcMjoL9SJhvK6HGVNp1DPU4TxTwWIdGBoWJ1LXRIdmhsBQhqMCa+HSnE\nhubbkMOqW67iEmrewpYKEQLvI/LMI4J7y60iXUG1VVtMRyxUd//Z2DmO+oQYJnMq\nvI5RppuAVuvStM4UuTJ5QCHYNBVLBBADGOZiknZoUyhmtzDG4umUAI8LmW8h/Cxu\nmLrWw8gX+/HozcPN5r4ID3WIdNN5uFXNAuuIXnBD8lEdWREG+wIra6PyjxBq1JTz\nt5mh0sL1wIptWLr9RHFDT8rrkZ8FWIyB+Sf71K67W6OTFS6YgOMVCS/Rh+JmWz9j\ngm2srBFTAgMBAAECggEAEtScbGj+/VFY0Km7EpcxFxbzCcVsE7k2IQUfAXQYMrQV\n7SdNHjB2B2iiuWu2Jd2cAtxlwKPZ2jRzDOkidlx3C7RnOq33+RCXhZ25G0INZI9O\n4SitubZxbrZ8jJq2NCBea9KHvFwJf5em+2cjFcd50k/a7oeZ4rux7CSYvEpGrdwn\n/WCSNpspUZZ74tDsFJCmbM5WwPkMUyrYlU4hIKI7ZjZ+RFlgbQ7YKF+HQanGNO0m\n8aAoHq5de+lhvppLb8SbZGEm43a7V9FAvaXKtFaZ50huegJVOCy7ujPoNwfIq894\npPtbYPYqf/c21MWrgeJVAKaHwVS33Kh8dhfUWChGQQKBgQDqoZnZ1DKWEdQkK08g\nUWXx+Mpg/UkK3S2XxmbbOziFp+8cTcnQwQQ3OhSmRlJmhRlC0ZwyjGcTbKDoqmpD\nFK/hIc1cCqz2R6cW/44R5FXBSzdiyC/YAgjmWI8zSMxLxsM+mV94YwHAx0Jzypta\nRNCfz6VucSRMPbuaIRYljiS/gwKBgQDN0nyjjwZsjopipS/qDTZpvF2QTbcZ1Ows\nj4OQS/mcHDvuJbZcJCheS3LNVVjS58+uTgElgMKvUexOEyMBNOTfGeA1GTQ/SoVc\nL9tAwAUY6jqqfAooxcfLcqHRg5849rtSljBUQD9YdwthjyrZvppQdYo+wpdZr3VC\n3Ar7qANt8QKBgATD4W8GGzznAcr2QjYi0RI3/kw3+KrK0Sk6803ShxRX08hcYBPo\nR6CjglXaKcRBQcEUprp0FYfUdfQjueLA4c2NtTEAWoDp9Z/G8ui0HXW+hFJyRF57\ntBiRhd8BxHxpff+gd8rnH9r9cQEPBVaw/RexzOdQTu9pdYzszRlYKLDnAoGAbVAo\ngFm7CLbfyqp++yjPSHMRok2UPLT4RmZmcqHXTVE1hzMiWmedxQ7/RwzYIxOZGrM1\nKqzrOWAiSAkj40UrdU5x5OGg/ShgEekc4pPZYTUtuVQttR/uECCuzu7ABuoL7T31\nJxoESsDXG5aFJKZ1oNv8c364EZr9hWgGsUe3opECgYEAxwuBt9dcltKf0sxzfA31\n0qKczCLnLHN42uirRiswQ3ah2UlAhgU1suKUOG6B74nqvYfrtKoDtEND/tgzwrVQ\nKwEw8tbxtVejdWMsrXwDeUxMjsRjqxpipPRTYpunMRXYoExKZS6MwMxN+npXFCeh\njzKo79TE0+VmdlSFqGcvoIk=\n-----END PRIVATE KEY-----\n',
    client_email: 'server-dev@deporty-dev.iam.gserviceaccount.com',
    client_id: '111372770257738841072',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/server-dev%40deporty-dev.iam.gserviceaccount.com',
  } as ServiceAccount,
};
