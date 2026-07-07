import bcrypt from "bcryptjs";

export const PasswordHasher = {
  hash: async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },

  check: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  },
};
