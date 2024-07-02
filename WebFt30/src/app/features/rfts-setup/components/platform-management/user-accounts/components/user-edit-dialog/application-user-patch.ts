export class ApplicationUserPatch {
  userName!: string; // required to find existing user
  firstName: string | undefined = undefined;
  lastName: string | undefined = undefined;
  role: string | undefined = undefined;
  jobTitle: string | undefined = undefined;
  email: string | undefined = undefined;
  phoneNumber: string | undefined = undefined;
  password: string | undefined = undefined;
}
