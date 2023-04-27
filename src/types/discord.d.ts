interface IGuild {
  id: string;
  name: string;
  icon: string;
  owner: Boolean;
  permissions: number;
  features: Array<string>;
  permissions_new: string;
  setup?: boolean;
}
