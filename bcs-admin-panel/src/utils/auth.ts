
export interface UserCredential {
  email: string;
  password: string;
  role: string;
  name: string;
}

export const sampleUsers: UserCredential[] = [
  {
    email: "admin@bcs.com",
    password: "admin123",
    role: "admin",
    name: "John Admin"
  },
  {
    email: "cashier@bcs.com",
    password: "cashier123",
    role: "cashier",
    name: "Sarah Cashier"
  },
  {
    email: "assistant@bcs.com",
    password: "assistant123",
    role: "assistant",
    name: "Mike Assistant"
  },
  {
    email: "dispatcher@bcs.com",
    password: "dispatcher123",
    role: "dispatcher",
    name: "Dave Dispatcher"
  }
];

export const authenticateUser = (email: string, password: string): UserCredential | null => {
  return sampleUsers.find(user => 
    user.email === email && user.password === password
  ) || null;
};
