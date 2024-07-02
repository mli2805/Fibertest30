export class User {
  id!: string;
  name!: string;
  role!: string;
  permissions!: string[];
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneNumber!: string;
  jobTitle!: string;
  fullName!: string;

  // FYI: getter is not used, as after UserStateAdapter.updateOne the User object is ruined

  // get fullName(): string {
  //  ...
  // }
}
